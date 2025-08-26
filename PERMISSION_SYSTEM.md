# Hệ thống Quyền Xóa Bài Viết

## Tổng quan
Hệ thống này đảm bảo rằng chỉ những người dùng có quyền mới có thể xóa bài viết và nút xóa chỉ hiển thị cho những người dùng có quyền.

## Quyền xóa bài viết

### 1. Admin (role = 'admin')
- **Quyền**: Có thể xóa tất cả bài viết
- **Hiển thị nút xóa**: Có trên tất cả bài viết
- **Chức năng đặc biệt**: Có thể chọn nhiều bài viết để xóa cùng lúc

### 2. User thường (role = 'user')
- **Quyền**: Chỉ có thể xóa bài viết của chính mình
- **Hiển thị nút xóa**: Chỉ hiển thị trên bài viết của mình
- **Chức năng**: Không thể chọn nhiều bài viết để xóa

### 3. Khách (chưa đăng nhập)
- **Quyền**: Không có quyền xóa bài viết nào
- **Hiển thị nút xóa**: Không hiển thị nút xóa nào

## Cách hoạt động

### Frontend (PostList.js)
```javascript
const canDeletePost = (post) => {
  // Kiểm tra user đăng nhập
  if (!user) return false;
  
  // Kiểm tra thông tin bài viết
  if (!post) return false;
  
  // Admin có thể xóa tất cả
  if (user.role === 'admin') return true;
  
  // User thường chỉ xóa bài của mình
  const userId = user._id || user.id;
  const postUserId = post.user_id?._id || post.user_id?.id;
  
  return userId && postUserId && userId.toString() === postUserId.toString();
};
```

### Backend (Posts.controllers.js)
```javascript
// Kiểm tra quyền trước khi xóa
const userId = req.user.id || req.user._id;
const isAdmin = req.user.role === 'admin';
const isAuthor = post.user_id && userId && post.user_id.toString() === userId.toString();

if (!isAdmin && !isAuthor) {
  return res.status(403).json({ message: "Bạn không có quyền xóa bài viết này" });
}
```

## Giao diện người dùng

### Thông tin quyền
- Hiển thị thông tin về quyền xóa của người dùng hiện tại
- Admin: "Bạn có quyền xóa tất cả bài viết"
- User thường: "Bạn chỉ có thể xóa bài viết của mình"
- Khách: "Đăng nhập để có thể xóa bài viết"

### Nút xóa
- Chỉ hiển thị khi người dùng có quyền xóa bài viết đó
- Màu đỏ (#dc3545) để dễ nhận biết
- Có icon 🗑️ để trực quan

### Chế độ chọn nhiều (Admin only)
- Chỉ admin mới có thể chọn nhiều bài viết để xóa
- Hiển thị checkbox trên các bài viết có thể xóa
- Hiển thị 🚫 trên các bài viết không thể xóa

## Bảo mật

### Frontend
- Ẩn nút xóa cho người dùng không có quyền
- Kiểm tra quyền trước khi hiển thị chức năng

### Backend
- Middleware xác thực JWT token
- Kiểm tra quyền trước khi thực hiện xóa
- Trả về lỗi 403 nếu không có quyền

## Debug
Hệ thống có console.log để debug quyền xóa:
```javascript
console.log('Delete permission check:', {
  postTitle: post.title,
  userId: userId,
  postUserId: postUserId,
  userRole: user.role,
  canDelete: canDelete
});
```

## Cách test
1. Đăng nhập với tài khoản admin - kiểm tra có thể xóa tất cả bài viết
2. Đăng nhập với tài khoản user thường - kiểm tra chỉ có thể xóa bài của mình
3. Đăng xuất - kiểm tra không có nút xóa nào hiển thị
