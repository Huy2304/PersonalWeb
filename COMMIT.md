# 🛠️ YÊU CẦU PHÂN TÍCH & MỞ RỘNG PROJECT – ADMIN CRUD

## 1. Mục tiêu
- Đọc và phân tích **toàn bộ source code project hiện tại**
- Giữ nguyên kiến trúc, style code, naming convention
- **Mở rộng giao diện Admin** bằng cách:
  - Thêm **1 cột “Hành động” (Actions)** trong bảng dữ liệu
  - Cột này chỉ hiển thị với **role = admin**
  - Cung cấp đầy đủ chức năng **CRUD**

---

## 2. Phạm vi áp dụng
- Chỉ áp dụng cho **Admin**
- User thường và Guest:
  - Chỉ được xem dữ liệu
  - KHÔNG hiển thị nút CRUD
- Áp dụng cho các bảng quản lý (ví dụ: blog, user, post, category…)

---

## 3. Yêu cầu chi tiết cho cột CRUD (Admin)

### 3.1 Cột “Hành động” (Actions)
- Thêm 1 cột mới ở **cuối bảng**
- Tên cột: `Hành động` hoặc `Actions`
- Nội dung gồm các nút:
  - ✏️ Edit
  - 🗑️ Delete
  - ➕ Create (có thể nằm ngoài bảng nếu hợp lý)

---

### 3.2 Chức năng CRUD

#### ✅ CREATE
- Có nút `Thêm mới`
- Mở form (modal hoặc page riêng)
- Validate dữ liệu trước khi submit
- Gọi API tạo mới
- Sau khi thành công:
  - Reload bảng
  - Hiển thị thông báo thành công

---

#### ✅ READ
- Giữ nguyên logic đọc dữ liệu hiện tại
- Không thay đổi API đọc
- Không ảnh hưởng user/guest

---

#### ✅ UPDATE
- Nút `Edit` trên mỗi dòng
- Khi click:
  - Mở form với dữ liệu đã có
  - Cho phép chỉnh sửa
- Gọi API update
- Sau khi thành công:
  - Cập nhật lại bảng
  - Hiển thị thông báo

---

#### ✅ DELETE
- Nút `Delete` trên mỗi dòng
- Bắt buộc có bước xác nhận (confirm)
- Gọi API delete
- Sau khi thành công:
  - Xóa item khỏi UI
  - Không reload toàn trang

---


