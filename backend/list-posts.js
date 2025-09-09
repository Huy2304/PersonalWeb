const API_BASE_URL = 'https://personalweb-5cn1.onrender.com/api';

const listAndUpdatePosts = async () => {
  try {
    console.log('Đang lấy danh sách bài viết...');
    
    // Lấy danh sách bài viết
    const response = await fetch(`${API_BASE_URL}/blogs`);
    const posts = await response.json();
    
    console.log(`\n📋 Tìm thấy ${posts.length} bài viết:`);
    posts.forEach((post, index) => {
      const author = post.user_id?.email || 'Ẩn danh';
      console.log(`${index + 1}. ${post.title}`);
      console.log(`   Tác giả: ${author}`);
      console.log(`   ID: ${post._id}`);
      console.log(`   Danh mục: ${post.category_id?.name || 'Không có'}`);
      console.log(`   Trạng thái: ${post.status ? 'Đã xuất bản' : 'Nháp'}`);
      console.log('---');
    });
    
    // Tìm các bài viết có user_id cụ thể (không phải Ẩn danh)
    const postsWithUser = posts.filter(post => post.user_id && post.user_id !== 'Ẩn danh');
    
    if (postsWithUser.length === 0) {
      console.log('\n✅ Tất cả bài viết đã là Ẩn danh!');
      return;
    }
    
    console.log(`\n🔄 Tìm thấy ${postsWithUser.length} bài viết cần sửa thành Ẩn danh:`);
    postsWithUser.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title} (ID: ${post._id})`);
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
      await new Promise(resolve => setTimeout(resolve, 200));
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
    
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  }
};

// Chạy script
listAndUpdatePosts();
