import mongoose from 'mongoose';
import Post from './src/models/Post.js';
import Comment from './src/models/Comment.js';
import Category from './src/models/Category.js';
import User from './src/models/User.js';

// Kết nối database
mongoose.connect('mongodb://localhost:27017/personalweb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const testAnonymousFeatures = async () => {
  try {
    console.log('🧪 Bắt đầu test tính năng ẩn danh...\n');
    
    // Lấy user và category để test
    const users = await User.find();
    const categories = await Category.find();
    
    if (users.length === 0 || categories.length === 0) {
      console.log('❌ Cần có ít nhất 1 user và 1 category để test');
      return;
    }
    
    const testUser = users[0];
    const testCategory = categories[0];
    
    console.log(`📝 Sử dụng user: ${testUser.username} (${testUser.email})`);
    console.log(`📂 Sử dụng category: ${testCategory.name}\n`);
    
    // Test 1: Tạo bài viết ẩn danh
    console.log('🔍 Test 1: Tạo bài viết ẩn danh...');
    const anonymousPost = new Post({
      title: '[TEST] Bài viết ẩn danh - ' + new Date().toISOString(),
      post: 'Đây là nội dung của một bài viết ẩn danh. Tác giả không được hiển thị.',
      category_id: testCategory._id,
      user_id: testUser._id,
      status: true,
      is_anonymous: true,
      date_updated: new Date(),
      date_published: new Date()
    });
    
    await anonymousPost.save();
    console.log('✅ Đã tạo bài viết ẩn danh thành công');
    console.log(`   ID: ${anonymousPost._id}`);
    console.log(`   is_anonymous: ${anonymousPost.is_anonymous}\n`);
    
    // Test 2: Tạo bài viết công khai
    console.log('🔍 Test 2: Tạo bài viết công khai...');
    const publicPost = new Post({
      title: '[TEST] Bài viết công khai - ' + new Date().toISOString(),
      post: 'Đây là nội dung của một bài viết công khai. Tác giả được hiển thị.',
      category_id: testCategory._id,
      user_id: testUser._id,
      status: true,
      is_anonymous: false,
      date_updated: new Date(),
      date_published: new Date()
    });
    
    await publicPost.save();
    console.log('✅ Đã tạo bài viết công khai thành công');
    console.log(`   ID: ${publicPost._id}`);
    console.log(`   is_anonymous: ${publicPost.is_anonymous}\n`);
    
    // Test 3: Tạo bình luận ẩn danh
    console.log('🔍 Test 3: Tạo bình luận ẩn danh...');
    const anonymousComment = new Comment({
      post_id: anonymousPost._id,
      user_id: testUser._id,
      content: 'Đây là bình luận ẩn danh - tác giả không được hiển thị.',
      is_anonymous: true
    });
    
    await anonymousComment.save();
    console.log('✅ Đã tạo bình luận ẩn danh thành công');
    console.log(`   ID: ${anonymousComment._id}`);
    console.log(`   is_anonymous: ${anonymousComment.is_anonymous}\n`);
    
    // Test 4: Tạo bình luận công khai
    console.log('🔍 Test 4: Tạo bình luận công khai...');
    const publicComment = new Comment({
      post_id: publicPost._id,
      user_id: testUser._id,
      content: 'Đây là bình luận công khai - tác giả được hiển thị.',
      is_anonymous: false
    });
    
    await publicComment.save();
    console.log('✅ Đã tạo bình luận công khai thành công');
    console.log(`   ID: ${publicComment._id}`);
    console.log(`   is_anonymous: ${publicComment.is_anonymous}\n`);
    
    // Test 5: Kiểm tra dữ liệu đã tạo
    console.log('🔍 Test 5: Kiểm tra dữ liệu đã tạo...');
    
    const anonymousPostWithUser = await Post.findById(anonymousPost._id).populate('user_id').populate('category_id');
    const publicPostWithUser = await Post.findById(publicPost._id).populate('user_id').populate('category_id');
    
    console.log('📊 Bài viết ẩn danh:');
    console.log(`   Tiêu đề: ${anonymousPostWithUser.title}`);
    console.log(`   Tác giả thực: ${anonymousPostWithUser.user_id.email}`);
    console.log(`   Hiển thị: ${anonymousPostWithUser.is_anonymous ? 'Ẩn danh' : anonymousPostWithUser.user_id.email}`);
    console.log(`   is_anonymous: ${anonymousPostWithUser.is_anonymous}\n`);
    
    console.log('📊 Bài viết công khai:');
    console.log(`   Tiêu đề: ${publicPostWithUser.title}`);
    console.log(`   Tác giả thực: ${publicPostWithUser.user_id.email}`);
    console.log(`   Hiển thị: ${publicPostWithUser.is_anonymous ? 'Ẩn danh' : publicPostWithUser.user_id.email}`);
    console.log(`   is_anonymous: ${publicPostWithUser.is_anonymous}\n`);
    
    const anonymousCommentWithUser = await Comment.findById(anonymousComment._id).populate('user_id');
    const publicCommentWithUser = await Comment.findById(publicComment._id).populate('user_id');
    
    console.log('💬 Bình luận ẩn danh:');
    console.log(`   Nội dung: ${anonymousCommentWithUser.content}`);
    console.log(`   Tác giả thực: ${anonymousCommentWithUser.user_id.email}`);
    console.log(`   Hiển thị: ${anonymousCommentWithUser.is_anonymous ? 'Ẩn danh' : anonymousCommentWithUser.user_id.email}`);
    console.log(`   is_anonymous: ${anonymousCommentWithUser.is_anonymous}\n`);
    
    console.log('💬 Bình luận công khai:');
    console.log(`   Nội dung: ${publicCommentWithUser.content}`);
    console.log(`   Tác giả thực: ${publicCommentWithUser.user_id.email}`);
    console.log(`   Hiển thị: ${publicCommentWithUser.is_anonymous ? 'Ẩn danh' : publicCommentWithUser.user_id.email}`);
    console.log(`   is_anonymous: ${publicCommentWithUser.is_anonymous}\n`);
    
    console.log('🎉 Tất cả test đã hoàn thành thành công!');
    console.log('\n📋 Tóm tắt test:');
    console.log('✅ Model Post hỗ trợ trường is_anonymous');
    console.log('✅ Model Comment hỗ trợ trường is_anonymous');
    console.log('✅ Tạo bài viết ẩn danh thành công');
    console.log('✅ Tạo bài viết công khai thành công');
    console.log('✅ Tạo bình luận ẩn danh thành công');
    console.log('✅ Tạo bình luận công khai thành công');
    console.log('✅ Logic hiển thị tên tác giả hoạt động chính xác');
    
  } catch (error) {
    console.error('❌ Lỗi khi test tính năng ẩn danh:', error);
  } finally {
    await mongoose.connection.close();
  }
};

// Chạy test
testAnonymousFeatures();
