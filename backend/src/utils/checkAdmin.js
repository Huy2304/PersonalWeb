const mongoose = require('mongoose');
require('dotenv').config();

async function checkAdminUsers() {
  try {
    // Kết nối đến MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB');
    
    // Truy vấn trực tiếp collection users
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    // Tìm tất cả admin users
    console.log('\n=== ADMIN USERS ===');
    const adminUsers = await usersCollection.find({ role: 'admin' }).toArray();
    console.log(adminUsers.map(user => ({
      _id: user._id,
      email: user.email,
      role: user.role,
      name: user.name
    })));
    
    // Kiểm tra token
    console.log('\n=== RECENT TOKENS ===');
    const tokensCollection = db.collection('tokens');
    const recentTokens = await tokensCollection.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();
      
    console.log(recentTokens.map(token => ({
      user_id: token.user_id,
      createdAt: token.createdAt,
      expiresAt: token.expiresAt,
      tokenPreview: token.token.substring(0, 15) + '...'
    })));

    // Kiểm tra cụ thể token cho admin user
    if (adminUsers.length > 0) {
      console.log('\n=== ADMIN USER TOKENS ===');
      const adminId = adminUsers[0]._id;
      const adminTokens = await tokensCollection.find({ 
        user_id: adminId 
      }).toArray();
      
      console.log(adminTokens.map(token => ({
        tokenPreview: token.token.substring(0, 15) + '...',
        createdAt: token.createdAt,
        expiresAt: token.expiresAt,
        isValid: new Date() < new Date(token.expiresAt)
      })));
    }
    
  } catch (error) {
    console.error('Error checking admin users:', error);
  } finally {
    // Đóng kết nối
    await mongoose.connection.close();
    console.log('\nMongoDB connection closed');
  }
}

// Chạy hàm kiểm tra
checkAdminUsers();