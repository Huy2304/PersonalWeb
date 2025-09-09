# 🛡️ Hệ thống Chống Spam - Hướng dẫn sử dụng

## Tổng quan
Hệ thống chống spam đã được triển khai với nhiều lớp bảo vệ để ngăn chặn spam bài viết và bình luận.

## 🔒 Các biện pháp bảo vệ đã triển khai

### 1. **Authentication Required**
- ✅ Tất cả endpoints tạo/sửa bài viết đều yêu cầu đăng nhập
- ✅ Không thể đăng bài ẩn danh từ bên ngoài

### 2. **Rate Limiting**
- ✅ **Bài viết**: Tối đa 5 bài/giờ/user
- ✅ **Bình luận**: Tối đa 20 comment/15 phút/user
- ✅ Admin không bị giới hạn
- ✅ Tự động reset sau khoảng thời gian

### 3. **Content Validation**
- ✅ Kiểm tra từ khóa spam (tiếng Việt + tiếng Anh)
- ✅ Phát hiện URL đáng ngờ
- ✅ Kiểm tra ký tự lặp lại bất thường
- ✅ Phát hiện CAPS LOCK abuse
- ✅ Kiểm tra tỷ lệ số/chữ
- ✅ Giới hạn độ dài nội dung

### 4. **Spam Score System**
- ✅ Mỗi user có điểm spam tích lũy
- ✅ Tự động ban khi đạt ngưỡng (20 điểm)
- ✅ Tracking lịch sử đăng bài

### 5. **Auto-Moderation**
- ✅ User có spam score ≥ 5 → bài viết cần duyệt
- ✅ Tự động chuyển trạng thái "chờ duyệt"
- ✅ Admin phê duyệt thủ công

### 6. **User Ban System**
- ✅ Temporary ban (có thời hạn)
- ✅ Permanent ban
- ✅ Tự động unban khi hết hạn
- ✅ Reset spam score

## 📊 API Endpoints cho Admin

### User Management
```
GET    /api/admin/spam-users        # Danh sách user spam score cao
POST   /api/admin/ban/:userId       # Ban user
POST   /api/admin/unban/:userId     # Unban user
POST   /api/admin/reset-spam/:userId # Reset spam score
```

### Post Moderation
```
GET    /api/admin/pending-posts     # Danh sách bài chờ duyệt
POST   /api/admin/approve-post/:postId # Duyệt bài
DELETE /api/admin/reject-post/:postId  # Từ chối bài
```

### Statistics
```
GET    /api/admin/spam-stats        # Thống kê tổng quan
```

## 🚨 Spam Detection Rules

### Spam Keywords (Tự động +2 điểm mỗi từ)
- Quảng cáo, khuyến mãi, giảm giá, miễn phí
- Kiếm tiền, làm giàu, click here
- Casino, cờ bạc, poker, xxx, porn
- Thuốc lá, ma túy, heroin, cocaine

### Inappropriate Content (+3 điểm mỗi từ)
- Chửi thề, từ ngữ không phù hợp
- Tự động từ chối nếu phát hiện

### Technical Patterns
- URL đáng ngờ (+5 điểm)
- Ký tự lặp lại (+3 điểm)  
- Quá nhiều CAPS (+2 điểm)
- Tỷ lệ số/chữ cao (+2 điểm)
- Quá nhiều URLs (+1 điểm/URL)

## ⚡ Auto Actions

### Khi Spam Score ≥ 5:
- Bài viết tự động chuyển trạng thái "chờ duyệt"
- Hiển thị thông báo cho user

### Khi Spam Score ≥ 20:
- **Tự động ban user 24 giờ**
- Block tất cả hoạt động
- Reset sau khi hết ban

## 🛠️ Cách sử dụng Admin Panel

### 1. Xem thống kê spam:
```bash
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
     https://personalweb-5cn1.onrender.com/api/admin/spam-stats
```

### 2. Ban user spam:
```bash
curl -X POST \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"reason": "Spam nhiều lần", "duration": 48}' \
     https://personalweb-5cn1.onrender.com/api/admin/ban/USER_ID
```

### 3. Duyệt bài viết:
```bash
curl -X POST \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
     https://personalweb-5cn1.onrender.com/api/admin/approve-post/POST_ID
```

## 📈 Monitoring

### Cần theo dõi:
1. **Số lượng user bị ban hàng ngày**
2. **Số bài viết chờ duyệt**
3. **Top users có spam score cao**
4. **Tỷ lệ spam/tổng số bài viết**

### Log files quan trọng:
- Console log: Auto-moderation messages
- Rate limiting: User hit limits
- Content validation: Detected spam patterns

## 🔧 Tùy chỉnh

### Điều chỉnh ngưỡng spam score:
1. File: `middleware/contentValidation.js`
2. Tìm dòng: `if (user.spamScore > 20)`
3. Thay đổi ngưỡng tùy ý

### Thêm từ khóa spam:
1. File: `middleware/contentValidation.js`
2. Array: `SPAM_KEYWORDS` và `INAPPROPRIATE_KEYWORDS`
3. Thêm từ khóa mới

### Điều chỉnh rate limit:
1. File: `middleware/rateLimitMiddleware.js`
2. Thay đổi `max` và `windowMs`

## ⚠️ Lưu ý quan trọng

1. **Admin không bị rate limit**
2. **Spam score tích lũy theo thời gian**
3. **Ban tự động có thể được unban thủ công**
4. **Content validation chạy TRƯỚC rate limit**
5. **User bị ban không thể đăng bài/comment**

## 🚀 Kích hoạt hệ thống

Hệ thống đã được tích hợp tự động. Chỉ cần:
1. Restart server
2. Đảm bảo có admin account
3. Test với user thường

**Hệ thống bảo vệ đã sẵn sàng! 🛡️**

