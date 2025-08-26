# Hướng dẫn Test Chức năng Like

## Tính năng đã được cải thiện

### 1. **Cập nhật ngay lập tức**
- ✅ Số like cập nhật ngay khi nhấn nút (không cần refresh trang)
- ✅ Hoạt động cả trong danh sách bài viết và trang chi tiết
- ✅ Xử lý toggle like (thích/bỏ thích)

### 2. **Giao diện cải thiện**
- ✅ Nút like có hiệu ứng hover và animation
- ✅ Hiển thị trạng thái loading (⏳) khi đang xử lý
- ✅ Thông báo toast khi thích/bỏ thích thành công
- ✅ Định dạng số like đẹp (1K, 1.5K, 1M)

### 3. **UX/UI tốt hơn**
- ✅ Disable nút khi chưa đăng nhập
- ✅ Hiển thị thông báo lỗi rõ ràng
- ✅ Animation mượt mà

## Cách test

### Test 1: Like bài viết
1. Đăng nhập vào tài khoản
2. Nhấn nút "👍 0 Thích" trên bất kỳ bài viết nào
3. **Kết quả mong đợi**: 
   - Số like tăng ngay lập tức từ 0 → 1
   - Hiển thị thông báo "Đã like bài viết"
   - Nút có hiệu ứng loading trong quá trình xử lý

### Test 2: Bỏ thích bài viết
1. Nhấn lại nút "👍 1 Thích" trên bài viết đã thích
2. **Kết quả mong đợi**:
   - Số like giảm ngay lập tức từ 1 → 0
   - Hiển thị thông báo "Đã hủy like bài viết"

### Test 3: Test khi chưa đăng nhập
1. Đăng xuất khỏi tài khoản
2. Nhấn nút like
3. **Kết quả mong đợi**:
   - Hiển thị thông báo "Vui lòng đăng nhập để thích bài viết"
   - Nút like bị disable

### Test 4: Test trong trang chi tiết
1. Click vào một bài viết để xem chi tiết
2. Nhấn nút like trong trang chi tiết
3. **Kết quả mong đợi**:
   - Số like cập nhật ngay lập tức
   - Thông báo hiển thị ở góc phải trên

### Test 5: Test nhiều bài viết
1. Thích nhiều bài viết khác nhau
2. **Kết quả mong đợi**:
   - Mỗi bài viết có số like riêng biệt
   - Không bị conflict giữa các bài viết

## Lưu ý kỹ thuật

### Backend API
- Endpoint: `POST /api/interaction`
- Body: `{ postId, userId, type: 'like' }`
- Response: `{ message: "Đã like bài viết" }` hoặc `{ message: "Đã hủy like bài viết" }`

### Frontend Logic
- Sử dụng `setPosts` để cập nhật state ngay lập tức
- Sử dụng `setSelectedPost` để cập nhật trang chi tiết
- Xử lý toggle dựa trên response message từ backend

### Error Handling
- Hiển thị thông báo lỗi khi API call thất bại
- Disable nút khi đang loading
- Timeout tự động ẩn thông báo

## Debug

Để debug, mở Console trong Developer Tools và xem:
- Log khi nhấn nút like
- Response từ API
- State updates trong React DevTools
