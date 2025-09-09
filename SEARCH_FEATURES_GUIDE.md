# Hướng Dẫn Sử Dụng Tính Năng Tìm Kiếm

## Tổng Quan

Hệ thống đã được thiết kế với **3 giao diện tìm kiếm khác biệt** cho từng trang, phù hợp với mục đích sử dụng và đối tượng người dùng.

## 1. Trang Chính (`/`) - Tìm Kiếm Công Khai

### Tính Năng:
- 🔍 **Tìm kiếm theo từ khóa**: Tiêu đề và nội dung bài viết
- 📱 **Giao diện thân thiện**: Thiết kế modern, dễ sử dụng
- 🔄 **Kết hợp với filter danh mục**: Tìm kiếm + phân loại
- ⚡ **Tìm kiếm real-time**: Kết quả hiển thị ngay lập tức

### Cách Sử Dụng:
1. Nhập từ khóa vào ô tìm kiếm
2. Kết quả hiển thị ngay lập tức
3. Có thể kết hợp với filter danh mục
4. Nhấn nút "✕" để xóa tìm kiếm

### Giao Diện:
- Ô tìm kiếm với icon 🔍
- Nút xóa tìm kiếm khi có nội dung
- Hiển thị số lượng kết quả tìm được
- Nút "Xem tất cả bài viết" để reset

---

## 2. Trang Admin Users (`/admin/users`) - Tìm Kiếm Quản Trị

### Tính Năng:
- 🔍 **Tìm kiếm đa tiêu chí**: Tên, email, vai trò, trạng thái
- 🎯 **Filter nâng cao**: Role (User/Admin/Moderator), Status (Active/Banned)
- 📊 **Thống kê kết quả**: Hiển thị số lượng người dùng
- 🗑️ **Xóa bộ lọc**: Reset tất cả filter một lần

### Cách Sử Dụng:
1. **Tìm kiếm cơ bản**: Nhập tên hoặc email
2. **Filter theo vai trò**: Chọn role cụ thể
3. **Filter theo trạng thái**: Active hoặc Banned
4. **Kết hợp nhiều filter**: Có thể dùng đồng thời
5. **Xóa bộ lọc**: Nhấn nút "🗑️ Xóa bộ lọc"

### Giao Diện:
- Ô tìm kiếm với placeholder "🔍 Tìm theo tên hoặc email..."
- Dropdown chọn vai trò
- Dropdown chọn trạng thái
- Nút xóa bộ lọc (chỉ active khi có filter)
- Hiển thị thống kê kết quả

---

## 3. Trang Admin Blog (`/admin/blog`) - Tìm Kiếm Quản Trị

### Tính Năng:
- 🔍 **Tìm kiếm đa tiêu chí**: Tiêu đề, nội dung, tác giả, danh mục
- 📅 **Filter theo thời gian**: Khoảng ngày đăng bài
- 🏷️ **Filter theo danh mục**: Chọn danh mục cụ thể
- 👤 **Filter theo tác giả**: Tìm theo tên hoặc email tác giả
- 📊 **Thống kê chi tiết**: Số lượng bài viết tìm được

### Cách Sử Dụng:
1. **Tìm kiếm cơ bản**: Nhập từ khóa tiêu đề/nội dung
2. **Filter theo danh mục**: Chọn danh mục từ dropdown
3. **Filter theo tác giả**: Nhập tên hoặc email tác giả
4. **Filter theo thời gian**: Chọn khoảng ngày bắt đầu và kết thúc
5. **Kết hợp nhiều filter**: Có thể dùng đồng thời
6. **Xóa bộ lọc**: Nhấn nút "🗑️ Xóa bộ lọc"

### Giao Diện:
- Ô tìm kiếm với placeholder "🔍 Tìm theo tiêu đề hoặc nội dung..."
- Dropdown chọn danh mục
- Ô nhập tác giả với placeholder "👤 Tác giả..."
- 2 ô chọn ngày (từ ngày - đến ngày)
- Nút xóa bộ lọc
- Hiển thị thống kê kết quả

---

## 4. Component Tìm Kiếm Chung (`SearchBox`)

### Tính Năng:
- 🔧 **Tái sử dụng**: Có thể dùng cho nhiều trang
- 📏 **Đa kích thước**: Small, Medium, Large
- 🎨 **Tùy chỉnh**: Placeholder, callback functions
- ♿ **Accessibility**: Hỗ trợ keyboard navigation
- 🌙 **Dark theme**: Tự động thích ứng

### Cách Sử Dụng:
```jsx
import SearchBox from './components/SearchBox';

// Sử dụng cơ bản
<SearchBox 
  placeholder="🔍 Tìm kiếm..."
  onSearch={(query) => handleSearch(query)}
  onClear={() => handleClear()}
/>

// Sử dụng với kích thước khác
<SearchBox 
  size="large"
  placeholder="🔍 Tìm kiếm nâng cao..."
  onSearch={handleSearch}
  onClear={handleClear}
/>
```

---

## 5. Đặc Điểm Kỹ Thuật

### Performance:
- ⚡ **Tìm kiếm local**: Không gọi API mỗi lần gõ
- 🔄 **Debounced search**: Tối ưu hiệu suất
- 📱 **Responsive**: Hoạt động tốt trên mọi thiết bị

### UX/UI:
- 🎯 **Visual feedback**: Loading states, hover effects
- 🔍 **Clear indicators**: Hiển thị rõ kết quả tìm kiếm
- 🗑️ **Easy reset**: Nút xóa filter dễ thấy
- 📊 **Results summary**: Thống kê kết quả rõ ràng

### Accessibility:
- ♿ **Keyboard navigation**: Hỗ trợ Tab, Enter, Escape
- 🏷️ **ARIA labels**: Hỗ trợ screen readers
- 🎨 **Color contrast**: Đảm bảo khả năng đọc
- 📱 **Touch friendly**: Kích thước button phù hợp mobile

---

## 6. Hướng Dẫn Tùy Chỉnh

### Thay Đổi Style:
- CSS variables trong `SearchBox.css`
- Theme colors trong `AdminLayout.css`
- Responsive breakpoints

### Thêm Filter Mới:
1. Thêm state cho filter
2. Cập nhật logic tìm kiếm
3. Thêm UI component
4. Cập nhật CSS

### Tích Hợp API:
- Thay thế `handleSearch` local bằng API call
- Thêm loading states
- Xử lý error handling

---

## 7. Troubleshooting

### Vấn Đề Thường Gặp:
1. **Tìm kiếm không hoạt động**: Kiểm tra callback functions
2. **Filter không reset**: Kiểm tra state management
3. **UI không responsive**: Kiểm tra CSS media queries
4. **Performance chậm**: Kiểm tra logic filter

### Debug:
- Console logs trong browser
- React DevTools
- Network tab cho API calls
- Performance tab cho rendering

---

## Kết Luận

Hệ thống tìm kiếm đã được thiết kế với **3 giao diện khác biệt**, mỗi trang có tính năng phù hợp với mục đích sử dụng:

- **Trang chính**: Giao diện thân thiện, tìm kiếm đơn giản
- **Admin Users**: Filter nâng cao theo vai trò và trạng thái
- **Admin Blog**: Tìm kiếm chi tiết với nhiều tiêu chí

Tất cả đều có **responsive design**, **accessibility support** và **performance optimization** để đảm bảo trải nghiệm người dùng tốt nhất.
