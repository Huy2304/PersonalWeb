import User from '../models/User.js';

// Danh sách từ khóa spam và nhạy cảm (tiếng Việt)
const SPAM_KEYWORDS = [
  'spam', 'quảng cáo', 'khuyến mãi', 'giảm giá', 'miễn phí', 'click here', 'đăng ký ngay',
  'kiếm tiền', 'làm giàu', 'bán hàng', 'mua ngay', 'ưu đãi', 'sale off', 'promotion',
  'casino', 'cờ bạc', 'đánh bạc', 'poker', 'xxx', 'sex', 'porn', 'viagra',
  'thuốc lá', 'ma túy', 'heroin', 'cocaine', 'cần sa', 'methamphetamine'
];

// Từ khóa không phù hợp
const INAPPROPRIATE_KEYWORDS = [
  'chết tiệt', 'đồ chó', 'con điên', 'thằng ngu', 'con khùng', 'đồ súc sinh',
  'fuck', 'shit', 'damn', 'bitch', 'asshole', 'bastard'
];

// URL patterns đáng ngờ
const SUSPICIOUS_URL_PATTERNS = [
  /bit\.ly/i, /tinyurl/i, /t\.co/i, /goo\.gl/i, /ow\.ly/i,
  /\.tk$/i, /\.ml$/i, /\.ga$/i, /\.cf$/i // Top-level domains miễn phí thường dùng cho spam
];

export const validatePostContent = async (req, res, next) => {
  try {
    const { title, post, user_id } = req.body;
    const errors = [];
    let spamScore = 0;

    // 1. Kiểm tra độ dài cơ bản
    if (!title || title.trim().length < 5) {
      errors.push('Tiêu đề phải có ít nhất 5 ký tự');
    }
    
    if (!post || post.trim().length < 10) {
      errors.push('Nội dung bài viết phải có ít nhất 10 ký tự');
    }

    if (title && title.length > 255) {
      errors.push('Tiêu đề không được vượt quá 255 ký tự');
    }

    if (post && post.length > 50000) {
      errors.push('Nội dung bài viết không được vượt quá 50,000 ký tự');
    }

    // 2. Kiểm tra spam keywords
    const fullContent = `${title} ${post}`.toLowerCase();
    
    SPAM_KEYWORDS.forEach(keyword => {
      const regex = new RegExp(keyword, 'gi');
      const matches = fullContent.match(regex);
      if (matches) {
        spamScore += matches.length * 2;
      }
    });

    INAPPROPRIATE_KEYWORDS.forEach(keyword => {
      const regex = new RegExp(keyword, 'gi');
      const matches = fullContent.match(regex);
      if (matches) {
        spamScore += matches.length * 3;
        errors.push(`Nội dung chứa từ ngữ không phù hợp: ${keyword}`);
      }
    });

    // 3. Kiểm tra URLs đáng ngờ
    const urlRegex = /(https?:\/\/[^\s]+)/gi;
    const urls = fullContent.match(urlRegex) || [];
    
    urls.forEach(url => {
      SUSPICIOUS_URL_PATTERNS.forEach(pattern => {
        if (pattern.test(url)) {
          spamScore += 5;
        }
      });
    });

    // 4. Kiểm tra lặp lại ký tự
    const repeatedChars = /(.)\1{4,}/g; // 5+ ký tự liên tiếp giống nhau
    if (repeatedChars.test(fullContent)) {
      spamScore += 3;
    }

    // 5. Kiểm tra CAPS LOCK
    const capsWords = fullContent.match(/[A-Z]{3,}/g) || [];
    if (capsWords.length > 5) {
      spamScore += 2;
    }

    // 6. Kiểm tra số lượng URLs
    if (urls.length > 3) {
      spamScore += urls.length;
    }

    // 7. Kiểm tra tỷ lệ số/chữ
    const numberCount = (fullContent.match(/\d/g) || []).length;
    const letterCount = (fullContent.match(/[a-záàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]/gi) || []).length;
    
    if (letterCount > 0 && numberCount / letterCount > 0.3) {
      spamScore += 2;
    }

    // 8. Kiểm tra lịch sử user
    if (user_id || req.user?.id) {
      const userId = user_id || req.user.id;
      const user = await User.findById(userId);
      
      if (user) {
        // Kiểm tra tần suất đăng bài
        if (user.lastPostTime) {
          const timeSinceLastPost = Date.now() - user.lastPostTime.getTime();
          if (timeSinceLastPost < 60000) { // Dưới 1 phút
            spamScore += 5;
          }
        }

        // Cập nhật spam score cho user
        user.spamScore = (user.spamScore || 0) + spamScore;
        user.lastPostTime = new Date();
        
        // Tự động ban nếu spam score quá cao
        if (user.spamScore > 20 && user.role !== 'admin') {
          user.isBanned = true;
          user.banReason = 'Tự động ban do hành vi spam';
          user.banUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // Ban 24h
          
          await user.save();
          
          return res.status(403).json({
            message: 'Tài khoản của bạn đã bị tạm khóa do hành vi spam. Thời gian khóa: 24 giờ.',
            spamScore: user.spamScore
          });
        }

        await user.save();
      }
    }

    // 9. Kiểm tra tổng spam score
    if (spamScore > 10) {
      errors.push(`Nội dung có dấu hiệu spam (điểm: ${spamScore})`);
    }

    // Trả về lỗi nếu có
    if (errors.length > 0) {
      return res.status(400).json({
        message: 'Nội dung không hợp lệ',
        errors: errors,
        spamScore: spamScore
      });
    }

    // Thêm spam score vào request để log
    req.spamScore = spamScore;
    next();

  } catch (error) {
    console.error('Error in content validation:', error);
    res.status(500).json({ message: 'Lỗi server khi kiểm tra nội dung' });
  }
};

// Middleware validation cho comments
export const validateCommentContent = async (req, res, next) => {
  try {
    const { mess } = req.body;
    const errors = [];
    let spamScore = 0;

    if (!mess || mess.trim().length < 1) {
      errors.push('Nội dung bình luận không được để trống');
    }

    if (mess && mess.length > 1000) {
      errors.push('Bình luận không được vượt quá 1000 ký tự');
    }

    // Kiểm tra spam trong comment
    const content = mess.toLowerCase();
    
    INAPPROPRIATE_KEYWORDS.forEach(keyword => {
      if (content.includes(keyword)) {
        spamScore += 3;
        errors.push(`Bình luận chứa từ ngữ không phù hợp`);
      }
    });

    // URLs trong comment
    const urlRegex = /(https?:\/\/[^\s]+)/gi;
    const urls = content.match(urlRegex) || [];
    if (urls.length > 1) {
      spamScore += 5;
    }

    if (spamScore > 5) {
      errors.push('Bình luận có dấu hiệu spam');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: 'Bình luận không hợp lệ',
        errors: errors
      });
    }

    next();
  } catch (error) {
    console.error('Error in comment validation:', error);
    res.status(500).json({ message: 'Lỗi server khi kiểm tra bình luận'});
  }
};

