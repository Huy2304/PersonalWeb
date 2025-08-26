# Hướng dẫn cấu hình tính năng Quên mật khẩu

## Tính năng đã được thêm

### Backend
- ✅ API `/api/auth/forgot-password` - Gửi email reset password
- ✅ API `/api/auth/reset-password` - Đặt lại mật khẩu
- ✅ Model User đã được cập nhật với các trường reset token
- ✅ Sử dụng nodemailer để gửi email

### Frontend
- ✅ Component `ForgotPassword` - Form nhập email
- ✅ Component `ResetPassword` - Form đặt lại mật khẩu
- ✅ Nút "Quên mật khẩu?" trong form đăng nhập
- ✅ Routing cho reset password
- ✅ UX/UI được thiết kế tốt

## Cấu hình cần thiết

### 1. Tạo file .env trong thư mục backend

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blog_system
JWT_SECRET=your-secret-key-for-blog-project-2024
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:3000
```

### 2. Cấu hình Gmail App Password

1. Vào Google Account Settings
2. Bật 2-Factor Authentication
3. Tạo App Password cho ứng dụng
4. Sử dụng App Password thay vì mật khẩu thường

### 3. Các biến môi trường cần thiết

- `EMAIL_USER`: Email Gmail của bạn
- `EMAIL_PASS`: App Password từ Gmail
- `FRONTEND_URL`: URL của frontend (mặc định: http://localhost:3000)

## Cách sử dụng

1. **Quên mật khẩu**: Click "Quên mật khẩu?" trong form đăng nhập
2. **Nhập email**: Nhập email đã đăng ký
3. **Kiểm tra email**: Nhận link reset password qua email
4. **Đặt lại mật khẩu**: Click link và nhập mật khẩu mới
5. **Đăng nhập**: Sử dụng mật khẩu mới để đăng nhập

## Tính năng bảo mật

- ✅ Token reset có thời hạn 1 giờ
- ✅ Token được xóa sau khi sử dụng
- ✅ Mật khẩu được hash bằng bcrypt
- ✅ Validation đầy đủ cho mật khẩu mới
- ✅ Kiểm tra email tồn tại trong hệ thống

## Lưu ý

- Đảm bảo MongoDB đang chạy
- Cấu hình email đúng để gửi được email
- Test tính năng với email thật
- Link reset password sẽ có dạng: `http://localhost:3000/reset-password/[token]`
