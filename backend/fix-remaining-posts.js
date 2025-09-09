const API_BASE_URL = 'https://personalweb-5cn1.onrender.com/api';

const fixRemainingPosts = async () => {
  try {
    console.log('Đang kiểm tra lại danh sách bài viết...');
    
    // Lấy danh sách bài viết
    const response = await fetch(`${API_BASE_URL}/blogs`);
    const posts = await response.json();
    
    console.log(`\n📋 Tìm thấy ${posts.length} bài viết:`);
    
    // Tìm các bài viết vẫn còn user_id cụ thể
    const postsWithUser = posts.filter(post => {
      // Kiểm tra nếu post.user_id có giá trị và không phải null/undefined
      return post.user_id && 
             post.user_id !== null && 
             post.user_id !== 'Ẩn danh' &&
             typeof post.user_id === 'object' && 
             post.user_id._id;
    });
    
    if (postsWithUser.length === 0) {
      console.log('\n✅ Tất cả bài viết đã là Ẩn danh!');
      return;
    }
    
    console.log(`\n🔄 Tìm thấy ${postsWithUser.length} bài viết vẫn còn user_id cụ thể:`);
    postsWithUser.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title}`);
      console.log(`   Tác giả hiện tại: ${post.user_id?.email || 'Có user_id'}`);
      console.log(`   ID: ${post._id}`);
      console.log('---');
    });
    
    // Sửa tất cả bài viết thành Ẩn danh
    console.log('\n🔄 Đang sửa các bài viết thành Ẩn danh...');
    
    for (const post of postsWithUser) {
      try {
        const updateData = {
          title: post.title,
          post: post.post,
          category_id: post.category_id?._id || post.category_id,
          user_id: null, // Đặt user_id thành null để thành Ẩn danh
          status: post.status,
          img_path: post.img_path || ''
        };
        
        console.log(`Đang sửa: ${post.title}...`);
        
        const updateResponse = await fetch(`${API_BASE_URL}/blogs/${post._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData)
        });
        
        if (updateResponse.ok) {
          console.log(`✅ Đã sửa bài viết: ${post.title}`);
        } else {
          const errorData = await updateResponse.json();
          console.log(`❌ Lỗi khi sửa bài viết "${post.title}":`, errorData.message || 'Lỗi không xác định');
        }
      } catch (error) {
        console.log(`❌ Lỗi khi sửa bài viết "${post.title}":`, error.message);
      }
      
      // Đợi một chút giữa các request
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    console.log('\n🎉 Hoàn thành sửa bài viết thành Ẩn danh!');
    
    // Kiểm tra lại danh sách sau khi sửa
    console.log('\n📋 Danh sách bài viết sau khi sửa:');
    const finalResponse = await fetch(`${API_BASE_URL}/blogs`);
    const finalPosts = await finalResponse.json();
    
    finalPosts.forEach((post, index) => {
      const author = post.user_id?.email || 'Ẩn danh';
      console.log(`${index + 1}. ${post.title} - Tác giả: ${author}`);
    });
    
    // Đếm số bài viết Ẩn danh
    const anonymousPosts = finalPosts.filter(post => !post.user_id || post.user_id === 'Ẩn danh');
    console.log(`\n📊 Thống kê:`);
    console.log(`- Tổng số bài viết: ${finalPosts.length}`);
    console.log(`- Bài viết Ẩn danh: ${anonymousPosts.length}`);
    console.log(`- Bài viết có tác giả: ${finalPosts.length - anonymousPosts.length}`);
    
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  }
};

// Chạy script
fixRemainingPosts();
