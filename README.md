# 🚀 PersonalWeb - Hệ thống Blog Cá nhân

Ứng dụng web viết bằng **JavaScript** nhằm mục đích học tập và phát triển kỹ năng lập trình. Dự án này có thể mở rộng để xây dựng website, ứng dụng quản lý hoặc công cụ tiện ích.

---

## 📖 Mục lục

* [Giới thiệu](#giới-thiệu)
* [Cài đặt](#cài-đặt)
* [Cách sử dụng](#cách-sử-dụng)
* [Cấu trúc thư mục](#cấu-trúc-thư-mục)
* [Công nghệ sử dụng](#công-nghệ-sử-dụng)
* [Tính năng](#tính-năng)
* [Hướng dẫn sử dụng](#hướng-dẫn-sử-dụng)
* [Đóng góp](#đóng-góp)
* [Giấy phép](#giấy-phép)

---

## 📌 Giới thiệu

Dự án này được xây dựng để:

* Thực hành lập trình với **JavaScript (ES6+)**
* Quản lý dữ liệu và giao diện người dùng hiệu quả
* Học cách tổ chức mã nguồn và đóng gói dự án
* Xây dựng hệ thống blog với đầy đủ tính năng

---

## ⚙️ Cài đặt

Clone repo:

```bash
git clone https://github.com/username/javascript-project.git
cd javascript-project
```

Cài đặt dependencies:

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

---

## ▶️ Cách sử dụng

**Khởi động Backend:**
```bash
cd backend
npm start
```

**Khởi động Frontend:**
```bash
cd frontend
npm start
```

---

## 📂 Cấu trúc thư mục

```
PersonalWeb/
│── backend/          # Backend API (Node.js + Express)
│   ├── src/
│   │   ├── config/   # Database configuration
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
│── frontend/         # Frontend (React)
│   ├── src/
│   │   ├── admin/    # Admin panel
│   │   ├── components/
│   │   ├── context/
│   │   └── Services/
│   └── package.json
│── README.md
```

---

## 🛠️ Công nghệ sử dụng

* **Backend:**
  - Node.js
  - Express.js
  - MongoDB + Mongoose
  - JWT Authentication
  - Nodemailer (Email service)
  - bcrypt (Password hashing)

* **Frontend:**
  - React
  - JavaScript (ES6+)
  - HTML5, CSS3
  - Tailwind CSS

---

## ✨ Tính năng

### Tính năng chính:
- ✅ Đăng ký/Đăng nhập người dùng
- ✅ Quản lý bài viết (CRUD)
- ✅ Quản lý danh mục
- ✅ Bình luận bài viết
- ✅ Tương tác (Like, Share)
- ✅ Tìm kiếm bài viết
- ✅ Quản lý người dùng (Admin)
- ✅ Hệ thống quyền và phân quyền
- ✅ Đăng bài/Bình luận ẩn danh
- ✅ Quên mật khẩu/Reset mật khẩu
- ✅ Hệ thống chống spam

---

## 📚 Hướng dẫn sử dụng

### 1. Tính năng Đăng bài và Bình luận Ẩn danh

Tính năng này cho phép người dùng đăng bài viết và bình luận mà không hiển thị tên tác giả, thay vào đó sẽ hiển thị "Ẩn danh".

#### Cách sử dụng:

**Đăng bài ẩn danh:**
1. Vào trang tạo bài viết
2. Điền thông tin bài viết như bình thường
3. Tích vào checkbox "Đăng bài ẩn danh"
4. Bấm "Tạo bài viết"
5. Bài viết sẽ hiển thị tác giả là "Ẩn danh"

**Bình luận ẩn danh:**
1. Vào chi tiết bài viết bất kỳ
2. Viết nội dung bình luận
3. Tích vào checkbox "Bình luận ẩn danh"
4. Bấm "Gửi bình luận"
5. Bình luận sẽ hiển thị tác giả là "Ẩn danh"

#### Database Structure:

**Post Model:**
```javascript
{
  user_id: ObjectId,
  title: String,
  post: String,
  category_id: ObjectId,
  is_anonymous: Boolean, // NEW FIELD
  status: Boolean,
  // ... other fields
}
```

**Comment Model:**
```javascript
{
  post_id: ObjectId,
  user_id: ObjectId,
  content: String,
  is_anonymous: Boolean, // NEW FIELD
  created_at: Date,
  // ... other fields
}
```

#### API Endpoints:

**POST /api/blogs (Tạo bài viết)**
```json
{
  "title": "Tiêu đề bài viết",
  "post": "Nội dung bài viết",
  "category_id": "64abc123...",
  "user_id": "64def456...",
  "is_anonymous": true,
  "status": true
}
```

**POST /api/comment (Tạo bình luận)**
```json
{
  "post_id": "64ghi789...",
  "user_id": "64def456...",
  "content": "Nội dung bình luận",
  "is_anonymous": true
}
```

---

### 2. Tính năng Quên mật khẩu

#### Cấu hình cần thiết:

**Tạo file .env trong thư mục backend:**

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blog_system
JWT_SECRET=your-secret-key-for-blog-project-2024
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:3000
```

**Cấu hình Gmail App Password:**
1. Vào Google Account Settings
2. Bật 2-Factor Authentication
3. Tạo App Password cho ứng dụng
4. Sử dụng App Password thay vì mật khẩu thường

#### Cách sử dụng:

1. **Quên mật khẩu**: Click "Quên mật khẩu?" trong form đăng nhập
2. **Nhập email**: Nhập email đã đăng ký
3. **Kiểm tra email**: Nhận link reset password qua email
4. **Đặt lại mật khẩu**: Click link và nhập mật khẩu mới
5. **Đăng nhập**: Sử dụng mật khẩu mới để đăng nhập

#### Tính năng bảo mật:

- ✅ Token reset có thời hạn 1 giờ
- ✅ Token được xóa sau khi sử dụng
- ✅ Mật khẩu được hash bằng bcrypt
- ✅ Validation đầy đủ cho mật khẩu mới
- ✅ Kiểm tra email tồn tại trong hệ thống

#### API Endpoints:

- `POST /api/auth/forgot-password` - Gửi email reset password
- `POST /api/auth/reset-password` - Đặt lại mật khẩu

---

### 3. Tính năng Like

#### Tính năng đã được cải thiện:

- ✅ Số like cập nhật ngay khi nhấn nút (không cần refresh trang)
- ✅ Hoạt động cả trong danh sách bài viết và trang chi tiết
- ✅ Xử lý toggle like (thích/bỏ thích)
- ✅ Nút like có hiệu ứng hover và animation
- ✅ Hiển thị trạng thái loading khi đang xử lý
- ✅ Thông báo toast khi thích/bỏ thích thành công
- ✅ Định dạng số like đẹp (1K, 1.5K, 1M)

#### API Endpoint:

**POST /api/interaction**
```json
{
  "postId": "post_id",
  "userId": "user_id",
  "type": "like"
}
```

---

### 4. Hệ thống Quyền Xóa Bài Viết

Hệ thống đảm bảo rằng chỉ những người dùng có quyền mới có thể xóa bài viết.

#### Quyền xóa bài viết:

**Admin (role = 'admin'):**
- Có thể xóa tất cả bài viết
- Hiển thị nút xóa trên tất cả bài viết
- Có thể chọn nhiều bài viết để xóa cùng lúc

**User thường (role = 'user'):**
- Chỉ có thể xóa bài viết của chính mình
- Hiển thị nút xóa chỉ trên bài viết của mình
- Không thể chọn nhiều bài viết để xóa

**Khách (chưa đăng nhập):**
- Không có quyền xóa bài viết nào
- Không hiển thị nút xóa nào

#### Bảo mật:

**Frontend:**
- Ẩn nút xóa cho người dùng không có quyền
- Kiểm tra quyền trước khi hiển thị chức năng

**Backend:**
- Middleware xác thực JWT token
- Kiểm tra quyền trước khi thực hiện xóa
- Trả về lỗi 403 nếu không có quyền

---

### 5. Tính năng Tìm kiếm

Hệ thống đã được thiết kế với **3 giao diện tìm kiếm khác biệt** cho từng trang:

#### Trang Chính (`/`) - Tìm Kiếm Công Khai

**Tính năng:**
- 🔍 Tìm kiếm theo từ khóa: Tiêu đề và nội dung bài viết
- 📱 Giao diện thân thiện: Thiết kế modern, dễ sử dụng
- 🔄 Kết hợp với filter danh mục: Tìm kiếm + phân loại
- ⚡ Tìm kiếm real-time: Kết quả hiển thị ngay lập tức

**Cách sử dụng:**
1. Nhập từ khóa vào ô tìm kiếm
2. Kết quả hiển thị ngay lập tức
3. Có thể kết hợp với filter danh mục
4. Nhấn nút "✕" để xóa tìm kiếm

#### Trang Admin Users (`/admin/users`) - Tìm Kiếm Quản Trị

**Tính năng:**
- 🔍 Tìm kiếm đa tiêu chí: Tên, email, vai trò, trạng thái
- 🎯 Filter nâng cao: Role (User/Admin/Moderator), Status (Active/Banned)
- 📊 Thống kê kết quả: Hiển thị số lượng người dùng
- 🗑️ Xóa bộ lọc: Reset tất cả filter một lần

**Cách sử dụng:**
1. Tìm kiếm cơ bản: Nhập tên hoặc email
2. Filter theo vai trò: Chọn role cụ thể
3. Filter theo trạng thái: Active hoặc Banned
4. Kết hợp nhiều filter: Có thể dùng đồng thời
5. Xóa bộ lọc: Nhấn nút "🗑️ Xóa bộ lọc"

#### Trang Admin Blog (`/admin/blog`) - Tìm Kiếm Quản Trị

**Tính năng:**
- 🔍 Tìm kiếm đa tiêu chí: Tiêu đề, nội dung, tác giả, danh mục
- 📅 Filter theo thời gian: Khoảng ngày đăng bài
- 🏷️ Filter theo danh mục: Chọn danh mục cụ thể
- 👤 Filter theo tác giả: Tìm theo tên hoặc email tác giả
- 📊 Thống kê chi tiết: Số lượng bài viết tìm được

**Cách sử dụng:**
1. Tìm kiếm cơ bản: Nhập từ khóa tiêu đề/nội dung
2. Filter theo danh mục: Chọn danh mục từ dropdown
3. Filter theo tác giả: Nhập tên hoặc email tác giả
4. Filter theo thời gian: Chọn khoảng ngày bắt đầu và kết thúc
5. Kết hợp nhiều filter: Có thể dùng đồng thời
6. Xóa bộ lọc: Nhấn nút "🗑️ Xóa bộ lọc"

---

### 6. Hệ thống Chống Spam

Hệ thống chống spam đã được triển khai với nhiều lớp bảo vệ để ngăn chặn spam bài viết và bình luận.

#### Các biện pháp bảo vệ:

**1. Authentication Required:**
- ✅ Tất cả endpoints tạo/sửa bài viết đều yêu cầu đăng nhập
- ✅ Không thể đăng bài ẩn danh từ bên ngoài

**2. Rate Limiting:**
- ✅ Bài viết: Tối đa 5 bài/giờ/user
- ✅ Bình luận: Tối đa 20 comment/15 phút/user
- ✅ Admin không bị giới hạn
- ✅ Tự động reset sau khoảng thời gian

**3. Content Validation:**
- ✅ Kiểm tra từ khóa spam (tiếng Việt + tiếng Anh)
- ✅ Phát hiện URL đáng ngờ
- ✅ Kiểm tra ký tự lặp lại bất thường
- ✅ Phát hiện CAPS LOCK abuse
- ✅ Kiểm tra tỷ lệ số/chữ
- ✅ Giới hạn độ dài nội dung

**4. Spam Score System:**
- ✅ Mỗi user có điểm spam tích lũy
- ✅ Tự động ban khi đạt ngưỡng (20 điểm)
- ✅ Tracking lịch sử đăng bài

**5. Auto-Moderation:**
- ✅ User có spam score ≥ 5 → bài viết cần duyệt
- ✅ Tự động chuyển trạng thái "chờ duyệt"
- ✅ Admin phê duyệt thủ công

**6. User Ban System:**
- ✅ Temporary ban (có thời hạn)
- ✅ Permanent ban
- ✅ Tự động unban khi hết hạn
- ✅ Reset spam score

#### API Endpoints cho Admin:

**User Management:**
```
GET    /api/admin/spam-users        # Danh sách user spam score cao
POST   /api/admin/ban/:userId       # Ban user
POST   /api/admin/unban/:userId     # Unban user
POST   /api/admin/reset-spam/:userId # Reset spam score
```

**Post Moderation:**
```
GET    /api/admin/pending-posts     # Danh sách bài chờ duyệt
POST   /api/admin/approve-post/:postId # Duyệt bài
DELETE /api/admin/reject-post/:postId  # Từ chối bài
```

**Statistics:**
```
GET    /api/admin/spam-stats        # Thống kê tổng quan
```

#### Spam Detection Rules:

**Spam Keywords (Tự động +2 điểm mỗi từ):**
- Quảng cáo, khuyến mãi, giảm giá, miễn phí
- Kiếm tiền, làm giàu, click here
- Casino, cờ bạc, poker, xxx, porn
- Thuốc lá, ma túy, heroin, cocaine

**Inappropriate Content (+3 điểm mỗi từ):**
- Chửi thề, từ ngữ không phù hợp
- Tự động từ chối nếu phát hiện

**Technical Patterns:**
- URL đáng ngờ (+5 điểm)
- Ký tự lặp lại (+3 điểm)
- Quá nhiều CAPS (+2 điểm)
- Tỷ lệ số/chữ cao (+2 điểm)
- Quá nhiều URLs (+1 điểm/URL)

#### Auto Actions:

**Khi Spam Score ≥ 5:**
- Bài viết tự động chuyển trạng thái "chờ duyệt"
- Hiển thị thông báo cho user

**Khi Spam Score ≥ 20:**
- Tự động ban user 24 giờ
- Block tất cả hoạt động
- Reset sau khi hết ban

#### Tùy chỉnh:

**Điều chỉnh ngưỡng spam score:**
1. File: `middleware/contentValidation.js`
2. Tìm dòng: `if (user.spamScore > 20)`
3. Thay đổi ngưỡng tùy ý

**Thêm từ khóa spam:**
1. File: `middleware/contentValidation.js`
2. Array: `SPAM_KEYWORDS` và `INAPPROPRIATE_KEYWORDS`
3. Thêm từ khóa mới

**Điều chỉnh rate limit:**
1. File: `middleware/rateLimitMiddleware.js`
2. Thay đổi `max` và `windowMs`

---

## 🤝 Đóng góp

Pull requests được hoan nghênh. Các bước đóng góp:

1. Fork repo
2. Tạo nhánh mới (`git checkout -b feature/ten-chuc-nang`)
3. Commit thay đổi (`git commit -m 'Thêm tính năng X'`)
4. Push lên nhánh (`git push origin feature/ten-chuc-nang`)
5. Tạo Pull Request

---

## 📜 Giấy phép

Dự án này được phân phối theo giấy phép **MIT**.
Xem chi tiết tại file [LICENSE](LICENSE).

---

## ⚠️ Lưu ý quan trọng

1. **Admin không bị rate limit**
2. **Spam score tích lũy theo thời gian**
3. **Ban tự động có thể được unban thủ công**
4. **Content validation chạy TRƯỚC rate limit**
5. **User bị ban không thể đăng bài/comment**
6. **Tính năng ẩn danh không ảnh hưởng đến quyền chỉnh sửa/xóa của tác giả**
7. **Admin vẫn có thể thấy được tác giả thực qua database**
8. **Đảm bảo MongoDB đang chạy trước khi khởi động backend**
9. **Cấu hình email đúng để gửi được email reset password**

---

## 🚀 Kích hoạt hệ thống

Hệ thống đã được tích hợp tự động. Chỉ cần:

1. Restart server
2. Đảm bảo có admin account
3. Test với user thường

**Hệ thống bảo vệ đã sẵn sàng! 🛡️**
