const API_BASE_URL = 'https://personalweb-5cn1.onrender.com/api';

const newCategories = [
  {
    name: "Du lịch",
    description: "Những bài viết về du lịch, khám phá thế giới",
    status: true
  },
  {
    name: "Ẩm thực", 
    description: "Những bài viết về ẩm thực, nấu ăn",
    status: true
  },
  {
    name: "Giáo dục",
    description: "Những bài viết về giáo dục, học tập",
    status: true
  },
  {
    name: "Sức khỏe",
    description: "Những bài viết về sức khỏe, thể thao",
    status: true
  }
];

const addCategories = async () => {
  try {
    console.log('Bắt đầu thêm danh mục mới...');
    
    for (const categoryData of newCategories) {
      try {
        const response = await fetch(`${API_BASE_URL}/category`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(categoryData)
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log(`✅ Đã thêm danh mục: ${categoryData.name}`);
        } else {
          const errorData = await response.json();
          console.log(`❌ Lỗi khi thêm danh mục "${categoryData.name}":`, errorData.message || 'Lỗi không xác định');
        }
      } catch (error) {
        console.log(`❌ Lỗi khi thêm danh mục "${categoryData.name}":`, error.message);
      }
      
      // Đợi một chút giữa các request
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log('\n🎉 Hoàn thành thêm danh mục!');
    
    // Hiển thị danh sách danh mục sau khi thêm
    console.log('\n📋 Danh sách danh mục hiện tại:');
    const categoriesResponse = await fetch(`${API_BASE_URL}/category`);
    const categories = await categoriesResponse.json();
    categories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.name} (ID: ${cat._id})`);
    });
    
  } catch (error) {
    console.error('❌ Lỗi khi thêm danh mục:', error.message);
  }
};

// Chạy script
addCategories();
