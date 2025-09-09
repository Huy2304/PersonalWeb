import axios from 'axios';

const API_BASE_URL = 'https://personalweb-5cn1.onrender.com/api';

const samplePosts = [
  // Công nghệ
  {
    title: "Xu hướng AI trong năm 2024",
    post: "Trí tuệ nhân tạo đang phát triển với tốc độ chóng mặt. Trong năm 2024, chúng ta sẽ chứng kiến những bước tiến đáng kể trong lĩnh vực AI, từ ChatGPT đến các ứng dụng thực tế trong y tế, giáo dục và kinh doanh. AI không chỉ là tương lai mà đã trở thành hiện tại của chúng ta.",
    category_id: "", // Sẽ được điền sau
    status: true,
    likes_count: 15,
    comments_count: 8
  },
  {
    title: "Blockchain và tiền điện tử: Từ hype đến thực tế",
    post: "Sau những cơn sốt Bitcoin và Ethereum, blockchain đang tìm đường đi vào các ứng dụng thực tế. Từ quản lý chuỗi cung ứng đến bỏ phiếu điện tử, công nghệ này đang chứng minh giá trị vượt ra ngoài tiền điện tử. Hãy cùng khám phá những ứng dụng thực tế của blockchain.",
    category_id: "",
    status: true,
    likes_count: 12,
    comments_count: 6
  },
  {
    title: "Bảo mật thông tin trong thời đại số",
    post: "Với sự gia tăng của các cuộc tấn công mạng, bảo mật thông tin trở nên quan trọng hơn bao giờ hết. Bài viết này sẽ cung cấp những kiến thức cơ bản về bảo mật, từ mật khẩu mạnh đến xác thực hai yếu tố, giúp bạn bảo vệ thông tin cá nhân trong thế giới số.",
    category_id: "",
    status: true,
    likes_count: 18,
    comments_count: 10
  },

  // Du lịch
  {
    title: "10 địa điểm du lịch đẹp nhất Việt Nam",
    post: "Việt Nam với vẻ đẹp thiên nhiên hùng vĩ và văn hóa đa dạng là điểm đến lý tưởng cho du khách. Từ Hạ Long đến Sapa, từ Phố cổ Hội An đến Đồng bằng sông Cửu Long, mỗi nơi đều mang đến những trải nghiệm độc đáo. Hãy cùng khám phá những địa điểm không thể bỏ qua.",
    category_id: "",
    status: true,
    likes_count: 25,
    comments_count: 12
  },
  {
    title: "Kinh nghiệm du lịch bụi Đông Nam Á",
    post: "Du lịch bụi Đông Nam Á là trải nghiệm tuyệt vời cho những ai yêu thích phiêu lưu. Với ngân sách hạn chế, bạn vẫn có thể khám phá những địa điểm tuyệt đẹp, thưởng thức ẩm thực địa phương và gặp gỡ những con người thân thiện. Bài viết chia sẻ kinh nghiệm thực tế từ chuyến đi.",
    category_id: "",
    status: true,
    likes_count: 20,
    comments_count: 15
  },
  {
    title: "Du lịch mùa thu Nhật Bản: Mùa lá đỏ Momiji",
    post: "Mùa thu Nhật Bản với những chiếc lá đỏ Momiji tạo nên khung cảnh nên thơ, lãng mạn. Từ Kyoto cổ kính đến Tokyo hiện đại, mỗi nơi đều mang đến vẻ đẹp riêng biệt của mùa thu. Hãy cùng lên kế hoạch cho chuyến du lịch mùa thu đáng nhớ tại xứ sở hoa anh đào.",
    category_id: "",
    status: true,
    likes_count: 22,
    comments_count: 8
  },

  // Ẩm thực
  {
    title: "Nghệ thuật nấu ăn truyền thống Việt Nam",
    post: "Ẩm thực Việt Nam nổi tiếng với hương vị tinh tế và cách chế biến độc đáo. Từ phở bò Hà Nội đến bún bò Huế, từ bánh mì Sài Gòn đến cao lầu Hội An, mỗi món ăn đều mang đậm bản sắc văn hóa địa phương. Bài viết sẽ giới thiệu những món ăn truyền thống và cách chế biến.",
    category_id: "",
    status: true,
    likes_count: 30,
    comments_count: 18
  },
  {
    title: "Khám phá ẩm thực đường phố Hà Nội",
    post: "Hà Nội không chỉ nổi tiếng với văn hóa lịch sử mà còn là thiên đường ẩm thực đường phố. Từ bánh cuốn Thanh Trì đến chả cá Lã Vọng, từ bún chả đến phở cuốn, mỗi món ăn đều mang hương vị đặc trưng của thủ đô. Hãy cùng khám phá những món ăn không thể bỏ qua khi đến Hà Nội.",
    category_id: "",
    status: true,
    likes_count: 28,
    comments_count: 20
  },
  {
    title: "Cách làm bánh chưng truyền thống",
    post: "Bánh chưng là món ăn truyền thống không thể thiếu trong dịp Tết Nguyên Đán của người Việt. Với nguyên liệu đơn giản gồm gạo nếp, đậu xanh, thịt lợn và lá dong, bánh chưng mang ý nghĩa sâu sắc về sự sum vầy, đoàn viên. Bài viết hướng dẫn chi tiết cách làm bánh chưng truyền thống.",
    category_id: "",
    status: true,
    likes_count: 35,
    comments_count: 25
  },

  // Giáo dục
  {
    title: "Phương pháp học tập hiệu quả cho sinh viên",
    post: "Học tập hiệu quả không chỉ là dành nhiều thời gian mà còn cần có phương pháp đúng đắn. Từ kỹ thuật Pomodoro đến mind mapping, từ active recall đến spaced repetition, mỗi phương pháp đều có ưu điểm riêng. Bài viết chia sẻ những phương pháp học tập đã được khoa học chứng minh hiệu quả.",
    category_id: "",
    status: true,
    likes_count: 18,
    comments_count: 12
  },
  {
    title: "Tầm quan trọng của giáo dục STEM",
    post: "Giáo dục STEM (Khoa học, Công nghệ, Kỹ thuật, Toán học) đang trở thành xu hướng toàn cầu. Với sự phát triển của công nghệ, việc trang bị kiến thức STEM cho học sinh là vô cùng cần thiết. Bài viết phân tích tầm quan trọng và cách áp dụng giáo dục STEM vào thực tế.",
    category_id: "",
    status: true,
    likes_count: 15,
    comments_count: 8
  },
  {
    title: "Kỹ năng mềm: Chìa khóa thành công trong tương lai",
    post: "Trong thời đại công nghệ, kỹ năng mềm trở nên quan trọng hơn bao giờ hết. Từ giao tiếp, làm việc nhóm đến tư duy phản biện, sáng tạo, những kỹ năng này sẽ giúp bạn thích nghi và thành công trong mọi môi trường. Hãy cùng phát triển những kỹ năng cần thiết.",
    category_id: "",
    status: true,
    likes_count: 20,
    comments_count: 14
  },

  // Sức khỏe
  {
    title: "Chế độ ăn uống lành mạnh cho người bận rộn",
    post: "Cuộc sống bận rộn khiến nhiều người khó duy trì chế độ ăn uống lành mạnh. Tuy nhiên, với một số thay đổi nhỏ và kế hoạch hợp lý, bạn vẫn có thể có bữa ăn đầy đủ dinh dưỡng. Bài viết chia sẻ những bí quyết đơn giản để có chế độ ăn uống tốt cho sức khỏe.",
    category_id: "",
    status: true,
    likes_count: 25,
    comments_count: 16
  },
  {
    title: "Tập thể dục tại nhà: Không cần phòng gym",
    post: "Bạn không cần phòng gym đắt tiền để có cơ thể khỏe mạnh. Với những bài tập đơn giản tại nhà, bạn vẫn có thể đạt được mục tiêu fitness. Từ yoga, pilates đến HIIT, mỗi loại hình tập luyện đều mang lại lợi ích riêng. Hãy bắt đầu hành trình rèn luyện sức khỏe ngay hôm nay.",
    category_id: "",
    status: true,
    likes_count: 22,
    comments_count: 12
  },
  {
    title: "Chăm sóc sức khỏe tinh thần trong thời đại số",
    post: "Sức khỏe tinh thần là yếu tố quan trọng không kém sức khỏe thể chất. Trong thời đại số với nhiều áp lực, việc chăm sóc sức khỏe tinh thần trở nên cần thiết hơn bao giờ hết. Bài viết chia sẻ những phương pháp đơn giản để duy trì sự cân bằng và hạnh phúc trong cuộc sống.",
    category_id: "",
    status: true,
    likes_count: 28,
    comments_count: 18
  }
];

const addSamplePosts = async () => {
  try {
    console.log('Bắt đầu thêm bài viết mẫu...');
    
    // Lấy danh sách danh mục
    const categoriesResponse = await axios.get(`${API_BASE_URL}/category`);
    const categories = categoriesResponse.data;
    console.log('Tìm thấy', categories.length, 'danh mục');
    
    // Hiển thị danh sách danh mục
    categories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.name} (ID: ${cat._id})`);
    });
    
    // Lấy user đầu tiên làm tác giả (cần có token)
    console.log('\nLưu ý: Bạn cần đăng nhập và lấy token để thêm bài viết.');
    console.log('Hoặc có thể sửa script để sử dụng user_id cụ thể.');
    
    // Tạm thời sử dụng user_id mặc định (cần thay đổi)
    const defaultUserId = "68ab03955df495345505b0f4"; // Thay bằng user_id thực tế
    
    // Thêm từng bài viết
    for (let i = 0; i < samplePosts.length; i++) {
      const postData = samplePosts[i];
      
      // Tìm category theo tên
      const category = categories.find(cat => cat.name === getCategoryName(i));
      if (!category) {
        console.log('Không tìm thấy danh mục cho bài viết:', postData.title);
        continue;
      }
      
      postData.category_id = category._id;
      postData.user_id = defaultUserId;
      
      try {
        const response = await axios.post(`${API_BASE_URL}/blogs`, postData);
        console.log(`Đã thêm bài viết: ${postData.title}`);
      } catch (error) {
        console.log(`Lỗi khi thêm bài viết "${postData.title}":`, error.response?.data?.message || error.message);
      }
      
      // Đợi một chút giữa các request
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('\nHoàn thành thêm bài viết mẫu!');
    
  } catch (error) {
    console.error('Lỗi khi thêm bài viết mẫu:', error.message);
  }
};

// Hàm helper để lấy tên danh mục dựa trên index
const getCategoryName = (index) => {
  if (index < 3) return "Công nghệ";
  if (index < 6) return "Du lịch";
  if (index < 9) return "Ẩm thực";
  if (index < 12) return "Giáo dục";
  if (index < 15) return "Sức khỏe";
  return "Khác";
};

// Chạy script
addSamplePosts();
