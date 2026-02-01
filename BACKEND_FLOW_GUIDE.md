# 🔄 Hướng Dẫn Flow Xử Lý Request: Frontend → Backend

## 📋 Mục lục

* [Tổng quan kiến trúc](#tổng-quan-kiến-trúc)
* [Flow tổng quát](#flow-tổng-quát)
* [Chi tiết từng tầng](#chi-tiết-từng-tầng)
* [Ví dụ cụ thể](#ví-dụ-cụ-thể)
* [Sơ đồ minh họa](#sơ-đồ-minh-họa)
* [Lưu ý quan trọng](#lưu-ý-quan-trọng)

---

## 🏗️ Tổng quan kiến trúc

Backend được xây dựng theo kiến trúc **Layered Architecture** (Kiến trúc phân tầng) với các tầng xử lý rõ ràng:

```
┌─────────────────────────────────────────────────┐
│              FRONTEND (React)                    │
│  - Gửi HTTP Request (GET/POST/PATCH/DELETE)      │
│  - Gửi kèm Headers (Authorization, Content-Type)│
└──────────────────┬──────────────────────────────┘
                   │ HTTP Request
                   ▼
┌─────────────────────────────────────────────────┐
│         TẦNG 1: SERVER (Entry Point)            │
│  - Express Server                               │
│  - Global Middleware (CORS, JSON Parser)        │
│  - Route Registration                           │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│         TẦNG 2: ROUTES (Định tuyến)             │
│  - Định nghĩa endpoints                         │
│  - Áp dụng Middleware theo route                │
│  - Gọi Controllers                              │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│      TẦNG 3: MIDDLEWARE (Xử lý trung gian)      │
│  - Authentication (JWT)                         │
│  - Rate Limiting                                │
│  - Content Validation                           │
│  - User Ban Check                               │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│      TẦNG 4: CONTROLLERS (Xử lý logic)          │
│  - Nhận request từ Routes                      │
│  - Validate input                               │
│  - Gọi Services                                 │
│  - Trả về Response                              │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│      TẦNG 5: SERVICES (Business Logic)            │
│  - Xử lý logic nghiệp vụ                        │
│  - Tương tác với Models                         │
│  - Xử lý dữ liệu phức tạp                       │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│      TẦNG 6: MODELS (Database Layer)            │
│  - Mongoose Schema                              │
│  - Database Operations (CRUD)                    │
│  - MongoDB                                      │
└─────────────────────────────────────────────────┘
```

---

## 🔄 Flow tổng quát

### 1. **Frontend gửi Request**

```javascript
// Frontend (React)
const response = await axios.post(
  'http://localhost:5000/api/blogs',
  {
    title: 'Tiêu đề bài viết',
    post: 'Nội dung bài viết',
    category_id: '64abc123...',
    is_anonymous: false
  },
  {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }
);
```

### 2. **Request đi qua các tầng Backend**

```
Frontend Request
    ↓
Server (Express) - Global Middleware
    ↓
Routes - Định tuyến endpoint
    ↓
Middleware Chain - Xử lý tuần tự
    ↓
Controller - Xử lý logic
    ↓
Service (Optional) - Business logic
    ↓
Model - Database operations
    ↓
Response trả về Frontend
```

---

## 📚 Chi tiết từng tầng

### TẦNG 1: SERVER (Entry Point)

**File:** `backend/src/server.js`

**Chức năng:**
- Khởi tạo Express server
- Cấu hình global middleware
- Đăng ký routes
- Kết nối database

**Xử lý:**
```javascript
// 1. Khởi tạo Express app
const app = express();

// 2. Global Middleware
app.use(express.json());              // Parse JSON body
app.use(cors({ ... }));               // CORS configuration
app.use((req, res, next) => { ... }); // Request logging

// 3. Đăng ký Routes
app.use("/api/blogs", blogPosts);
app.use("/api/auth", authRoutes);
// ... các routes khác

// 4. Kết nối Database
connectDB();

// 5. Start server
app.listen(PORT, () => { ... });
```

**Lưu ý:**
- Tất cả requests đều đi qua đây trước
- Global middleware áp dụng cho mọi route
- Routes được đăng ký theo prefix path

---

### TẦNG 2: ROUTES (Định tuyến)

**File:** `backend/src/routes/blogPosts.routes.js`

**Chức năng:**
- Định nghĩa các endpoints (URL paths)
- Áp dụng middleware cho từng route
- Gọi controller tương ứng

**Cấu trúc:**
```javascript
import express from "express";
import { addPost } from "../controllers/Posts.controllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { postRateLimit } from "../middleware/rateLimitMiddleware.js";
import { validatePostContent } from "../middleware/contentValidation.js";

const router = express.Router();

// Route: POST /api/blogs
router.post(
  "/",
  authMiddleware,           // Middleware 1: Xác thực user
  checkUserBanStatus,       // Middleware 2: Kiểm tra ban
  validatePostContent,      // Middleware 3: Validate nội dung
  postRateLimit,            // Middleware 4: Rate limiting
  addPost                   // Controller: Xử lý logic
);
```

**Các loại routes:**
- `GET /api/blogs` - Lấy tất cả bài viết (không cần auth)
- `POST /api/blogs` - Tạo bài viết (cần auth + middleware)
- `GET /api/blogs/:id` - Lấy bài viết theo ID
- `PATCH /api/blogs/:id` - Cập nhật bài viết (cần auth)
- `DELETE /api/blogs/:id` - Xóa bài viết (cần auth)

**Lưu ý:**
- Middleware được thực thi **theo thứ tự** từ trái sang phải
- Nếu middleware nào trả về response, các middleware sau sẽ không chạy
- Controller là middleware cuối cùng

---

### TẦNG 3: MIDDLEWARE (Xử lý trung gian)

**Chức năng:**
- Xử lý các tác vụ chung trước khi đến controller
- Có thể chặn request nếu không hợp lệ
- Thêm thông tin vào `req` object

#### 3.1. Authentication Middleware

**File:** `backend/src/middleware/authMiddleware.js`

**Chức năng:**
- Xác thực JWT token
- Lấy thông tin user từ token
- Gắn user vào `req.user`

**Flow:**
```javascript
export const authMiddleware = async (req, res, next) => {
  // 1. Lấy token từ header
  const authHeader = req.header('Authorization');
  const token = authHeader.replace('Bearer ', '');

  // 2. Verify token
  const decoded = jwt.verify(token, JWT_SECRET);

  // 3. Tìm user trong database
  const user = await User.findById(decoded.id);

  // 4. Gắn user vào request
  req.user = user;

  // 5. Chuyển sang middleware/controller tiếp theo
  next();
};
```

**Kết quả:**
- Nếu thành công: `req.user` chứa thông tin user
- Nếu thất bại: Trả về 401 Unauthorized

---

#### 3.2. Rate Limiting Middleware

**File:** `backend/src/middleware/rateLimitMiddleware.js`

**Chức năng:**
- Giới hạn số lượng requests trong khoảng thời gian
- Bảo vệ server khỏi spam/abuse

**Ví dụ:**
```javascript
export const postRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 giờ
  max: 5,                    // Tối đa 5 requests
  message: 'Bạn đã đăng quá nhiều bài viết...',
  skip: async (req) => {
    // Admin không bị giới hạn
    return req.user?.role === 'admin';
  }
});
```

**Kết quả:**
- Nếu vượt quá giới hạn: Trả về 429 Too Many Requests
- Nếu trong giới hạn: Chuyển sang middleware tiếp theo

---

#### 3.3. Content Validation Middleware

**File:** `backend/src/middleware/contentValidation.js`

**Chức năng:**
- Validate nội dung bài viết
- Phát hiện spam
- Tính spam score
- Cập nhật spam score cho user

**Flow:**
```javascript
export const validatePostContent = async (req, res, next) => {
  // 1. Validate độ dài
  if (title.length < 5) { ... }

  // 2. Kiểm tra spam keywords
  SPAM_KEYWORDS.forEach(keyword => {
    if (content.includes(keyword)) {
      spamScore += 2;
    }
  });

  // 3. Kiểm tra URLs đáng ngờ
  // 4. Kiểm tra ký tự lặp lại
  // 5. Kiểm tra CAPS LOCK abuse

  // 6. Cập nhật spam score cho user
  await User.findByIdAndUpdate(userId, {
    $inc: { spamScore: calculatedScore }
  });

  // 7. Nếu spam score cao → từ chối
  if (spamScore >= 20) {
    return res.status(400).json({ message: 'Nội dung spam' });
  }

  // 8. Chuyển sang controller
  next();
};
```

**Kết quả:**
- Nếu hợp lệ: Chuyển sang controller
- Nếu không hợp lệ: Trả về 400 Bad Request

---

#### 3.4. User Ban Check Middleware

**File:** `backend/src/middleware/rateLimitMiddleware.js`

**Chức năng:**
- Kiểm tra user có bị ban không
- Kiểm tra thời gian ban đã hết chưa
- Tự động unban nếu hết hạn

**Flow:**
```javascript
export const checkUserBanStatus = async (req, res, next) => {
  // 1. Lấy user từ database
  const user = await User.findById(req.user.id);

  // 2. Kiểm tra ban
  if (user.isBanned) {
    // 3. Kiểm tra thời gian ban
    if (user.banUntil && new Date() > user.banUntil) {
      // Hết hạn → tự động unban
      await User.findByIdAndUpdate(userId, {
        isBanned: false,
        banUntil: null
      });
      return next();
    }

    // Vẫn còn ban → từ chối
    return res.status(403).json({
      message: 'Tài khoản đã bị cấm'
    });
  }

  // 4. Không bị ban → tiếp tục
  next();
};
```

---

### TẦNG 4: CONTROLLERS (Xử lý logic)

**File:** `backend/src/controllers/Posts.controllers.js`

**Chức năng:**
- Nhận request từ routes (sau khi qua middleware)
- Validate và xử lý input
- Gọi services (nếu có) hoặc tương tác trực tiếp với models
- Trả về response cho client

**Cấu trúc:**
```javascript
export const addPost = async (req, res) => {
  try {
    // 1. Lấy dữ liệu từ request body
    const { title, post, category_id, is_anonymous } = req.body;

    // 2. Lấy user từ middleware (đã được gắn vào req.user)
    const userId = req.user.id;

    // 3. Xử lý logic nghiệp vụ
    // - Auto-moderation: Kiểm tra spam score
    // - Xác định trạng thái bài viết
    let postStatus = status;
    if (req.user.spamScore >= 5) {
      postStatus = false; // Cần duyệt
    }

    // 4. Chuẩn bị dữ liệu
    const postData = {
      title,
      post,
      category_id,
      user_id: userId,
      is_anonymous: is_anonymous || false,
      status: postStatus,
      date_updated: new Date(),
      date_published: postStatus ? new Date() : null
    };

    // 5. Tạo bài viết (tương tác với Model)
    const newPost = new Post(postData);
    await newPost.save();

    // 6. Trả về response
    res.status(201).json({
      ...newPost.toObject(),
      message: 'Bài viết đã được tạo thành công!'
    });

  } catch (error) {
    // 7. Xử lý lỗi
    res.status(409).json({ message: error.message });
  }
};
```

**Lưu ý:**
- Controller có thể gọi Service hoặc tương tác trực tiếp với Model
- Luôn xử lý try-catch để bắt lỗi
- Trả về status code phù hợp (200, 201, 400, 404, 500...)

---

### TẦNG 5: SERVICES (Business Logic) - Optional

**File:** `backend/src/services/posts.service.js`

**Chức năng:**
- Tách biệt business logic khỏi controllers
- Tái sử dụng logic cho nhiều controllers
- Xử lý các tác vụ phức tạp

**Ví dụ:**
```javascript
// Service: Xử lý logic phức tạp
export async function createPost(body) {
  const { title, post, category_id, user_id } = body;
  
  // Business logic
  const data = {
    title,
    post,
    category_id,
    user_id,
    date_updated: new Date(),
    date_published: status ? new Date() : null,
  };

  // Tương tác với Model
  return Post.create(data);
}

// Controller sử dụng Service
export const addPost = async (req, res) => {
  try {
    const post = await createPost(req.body);
    res.status(201).json(post);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
```

**Lưu ý:**
- Không phải tất cả controllers đều cần services
- Sử dụng khi logic phức tạp hoặc cần tái sử dụng

---

### TẦNG 6: MODELS (Database Layer)

**File:** `backend/src/models/Post.js`

**Chức năng:**
- Định nghĩa schema cho database
- Tương tác trực tiếp với MongoDB
- Thực hiện CRUD operations

**Cấu trúc:**
```javascript
import mongoose from "mongoose";

// 1. Định nghĩa Schema
const postSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true, maxlength: 255 },
  post: { type: String, required: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  status: { type: Boolean, default: false },
  is_anonymous: { type: Boolean, default: false },
  date_updated: { type: Date },
  date_published: { type: Date }
});

// 2. Tạo Model
export default mongoose.model("Post", postSchema);
```

**Các operations:**
```javascript
// CREATE
const newPost = new Post(data);
await newPost.save();

// READ
const posts = await Post.find();
const post = await Post.findById(id);
const post = await Post.findOne({ title: '...' });

// UPDATE
await Post.findByIdAndUpdate(id, { title: 'New title' });

// DELETE
await Post.findByIdAndDelete(id);
```

**Populate (Join):**
```javascript
// Lấy bài viết kèm thông tin user và category
const post = await Post.findById(id)
  .populate('user_id')      // Join với User
  .populate('category_id');  // Join với Category
```

---

## 📝 Ví dụ cụ thể

### Flow tạo bài viết (POST /api/blogs)

#### Bước 1: Frontend gửi Request
```javascript
// Frontend
const response = await axios.post(
  'http://localhost:5000/api/blogs',
  {
    title: 'Bài viết mới',
    post: 'Nội dung bài viết...',
    category_id: '64abc123...',
    is_anonymous: false
  },
  {
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    }
  }
);
```

#### Bước 2: Server nhận Request
```javascript
// server.js
app.use(express.json());  // Parse JSON body
app.use(cors());          // CORS
// Request được forward đến route /api/blogs
```

#### Bước 3: Route định tuyến
```javascript
// routes/blogPosts.routes.js
router.post(
  "/",
  authMiddleware,           // ← Bước 4
  checkUserBanStatus,       // ← Bước 5
  validatePostContent,      // ← Bước 6
  postRateLimit,            // ← Bước 7
  addPost                   // ← Bước 8
);
```

#### Bước 4: Authentication Middleware
```javascript
// middleware/authMiddleware.js
// ✅ Verify token thành công
// ✅ Tìm user trong database
// ✅ Gắn user vào req.user
req.user = {
  id: '64def456...',
  email: 'user@example.com',
  role: 'user',
  spamScore: 3
};
next(); // Chuyển sang middleware tiếp theo
```

#### Bước 5: Check User Ban Status
```javascript
// middleware/rateLimitMiddleware.js
// ✅ Kiểm tra user không bị ban
// ✅ Cho phép tiếp tục
next(); // Chuyển sang middleware tiếp theo
```

#### Bước 6: Content Validation
```javascript
// middleware/contentValidation.js
// ✅ Validate độ dài title, post
// ✅ Kiểm tra spam keywords → không phát hiện
// ✅ Tính spam score = 0
// ✅ Cho phép tiếp tục
next(); // Chuyển sang controller
```

#### Bước 7: Rate Limiting
```javascript
// middleware/rateLimitMiddleware.js
// ✅ Kiểm tra số lượng requests trong 1 giờ
// ✅ User chưa vượt quá 5 bài/giờ
// ✅ Cho phép tiếp tục
next(); // Chuyển sang controller
```

#### Bước 8: Controller xử lý
```javascript
// controllers/Posts.controllers.js
export const addPost = async (req, res) => {
  // 1. Lấy dữ liệu
  const { title, post, category_id } = req.body;
  const userId = req.user.id; // Từ middleware

  // 2. Xử lý logic
  const postData = {
    title,
    post,
    category_id,
    user_id: userId,
    status: true,
    date_updated: new Date(),
    date_published: new Date()
  };

  // 3. Tạo bài viết (tương tác với Model)
  const newPost = new Post(postData);
  await newPost.save();

  // 4. Trả về response
  res.status(201).json({
    ...newPost.toObject(),
    message: 'Bài viết đã được tạo thành công!'
  });
};
```

#### Bước 9: Model lưu vào Database
```javascript
// models/Post.js
// Mongoose tự động:
// 1. Validate schema
// 2. Lưu vào MongoDB
// 3. Trả về document đã lưu
```

#### Bước 10: Response trả về Frontend
```json
{
  "_id": "64ghi789...",
  "title": "Bài viết mới",
  "post": "Nội dung bài viết...",
  "user_id": "64def456...",
  "category_id": "64abc123...",
  "status": true,
  "date_published": "2024-01-15T10:30:00.000Z",
  "message": "Bài viết đã được tạo thành công!"
}
```

---

## 🎨 Sơ đồ minh họa

### Flow hoàn chỉnh

```
┌─────────────┐
│  FRONTEND   │
│   React     │
└──────┬──────┘
       │ POST /api/blogs
       │ Headers: Authorization: Bearer token
       │ Body: { title, post, category_id }
       ▼
┌─────────────────────────────────────┐
│  SERVER (server.js)                  │
│  - express.json()                    │
│  - cors()                            │
│  - Request logging                   │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  ROUTES (blogPosts.routes.js)        │
│  router.post("/", ...)               │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  MIDDLEWARE CHAIN                    │
│  ┌──────────────────────────────┐   │
│  │ 1. authMiddleware            │   │
│  │    → Verify JWT token        │   │
│  │    → req.user = user         │   │
│  └──────────────┬───────────────┘   │
│                 │                    │
│  ┌──────────────▼───────────────┐   │
│  │ 2. checkUserBanStatus        │   │
│  │    → Check isBanned           │   │
│  └──────────────┬───────────────┘   │
│                 │                    │
│  ┌──────────────▼───────────────┐   │
│  │ 3. validatePostContent        │   │
│  │    → Check spam               │   │
│  │    → Calculate spam score     │   │
│  └──────────────┬───────────────┘   │
│                 │                    │
│  ┌──────────────▼───────────────┐   │
│  │ 4. postRateLimit              │   │
│  │    → Check rate limit         │   │
│  └──────────────┬───────────────┘   │
└─────────────────┼───────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│  CONTROLLER (Posts.controllers.js)   │
│  addPost()                           │
│  - Lấy data từ req.body              │
│  - Xử lý logic                       │
│  - Gọi Model                         │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  MODEL (Post.js)                     │
│  - new Post(data)                    │
│  - await post.save()                 │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  MONGODB                             │
│  - Lưu document                      │
│  - Trả về saved document             │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  RESPONSE                            │
│  Status: 201 Created                 │
│  Body: { ...post, message: "..." }   │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────┐
│  FRONTEND   │
│  Nhận data  │
└─────────────┘
```

### Flow khi có lỗi

```
┌─────────────┐
│  FRONTEND    │
└──────┬───────┘
       │ Request
       ▼
┌─────────────────┐
│  MIDDLEWARE 1   │
│  authMiddleware │
└──────┬──────────┘
       │ ❌ Token không hợp lệ
       ▼
┌─────────────────┐
│  RESPONSE       │
│  Status: 401    │
│  { message:    │
│    "Token..." } │
└─────────────────┘
       │
       ▼
┌─────────────┐
│  FRONTEND    │
│  Hiển thị lỗi│
└─────────────┘
```

---

## ⚠️ Lưu ý quan trọng

### 1. Thứ tự Middleware

**QUAN TRỌNG:** Middleware được thực thi **theo thứ tự** từ trái sang phải:

```javascript
router.post(
  "/",
  authMiddleware,        // 1. Phải chạy đầu tiên (cần req.user)
  checkUserBanStatus,    // 2. Cần req.user từ middleware 1
  validatePostContent,   // 3. Cần req.user để cập nhật spam score
  postRateLimit,         // 4. Cần req.user để check admin
  addPost                // 5. Controller cuối cùng
);
```

**Sai thứ tự sẽ gây lỗi:**
```javascript
// ❌ SAI: postRateLimit chạy trước authMiddleware
router.post("/", postRateLimit, authMiddleware, addPost);
// → req.user chưa có → lỗi
```

### 2. Middleware có thể chặn Request

Nếu middleware trả về response, các middleware sau sẽ **KHÔNG** chạy:

```javascript
// middleware/authMiddleware.js
if (!token) {
  return res.status(401).json({ message: 'No token' });
  // ← Dừng ở đây, không chạy middleware/controller sau
}
next(); // Chỉ chạy nếu không có lỗi
```

### 3. req Object được truyền qua các tầng

```javascript
// Middleware 1: Gắn user vào req
req.user = user;

// Middleware 2: Sử dụng req.user
if (req.user.isBanned) { ... }

// Controller: Sử dụng req.user
const userId = req.user.id;
```

### 4. Error Handling

**Trong Controller:**
```javascript
export const addPost = async (req, res) => {
  try {
    // Logic xử lý
    const post = await Post.create(data);
    res.status(201).json(post);
  } catch (error) {
    // Xử lý lỗi
    res.status(409).json({ message: error.message });
  }
};
```

**Trong Middleware:**
```javascript
export const authMiddleware = async (req, res, next) => {
  try {
    // Logic xử lý
    next();
  } catch (error) {
    // Trả về lỗi, không gọi next()
    res.status(401).json({ message: error.message });
  }
};
```

### 5. Async/Await

Tất cả middleware và controllers đều phải là **async functions** vì:
- Database operations là async
- JWT verification có thể là async
- Rate limiting có thể cần async

```javascript
// ✅ ĐÚNG
export const addPost = async (req, res) => {
  const post = await Post.create(data);
  res.json(post);
};

// ❌ SAI
export const addPost = (req, res) => {
  const post = Post.create(data); // Thiếu await
  res.json(post);
};
```

### 6. Response chỉ được gửi một lần

```javascript
// ❌ SAI: Gửi response 2 lần
res.status(200).json({ message: 'Success' });
res.status(201).json({ message: 'Created' }); // Lỗi!

// ✅ ĐÚNG: Chỉ gửi một lần
res.status(201).json({ message: 'Created' });
```

---

## 📊 Tóm tắt

### Flow xử lý Request:

1. **Frontend** → Gửi HTTP Request với headers và body
2. **Server** → Nhận request, áp dụng global middleware
3. **Routes** → Định tuyến đến endpoint phù hợp
4. **Middleware Chain** → Xử lý tuần tự:
   - Authentication
   - Authorization
   - Validation
   - Rate Limiting
5. **Controller** → Xử lý logic nghiệp vụ
6. **Service** (Optional) → Business logic phức tạp
7. **Model** → Tương tác với database
8. **MongoDB** → Lưu/đọc dữ liệu
9. **Response** → Trả về kết quả cho Frontend

### Các điểm quan trọng:

- ✅ Middleware chạy theo thứ tự từ trái sang phải
- ✅ Middleware có thể chặn request bằng cách trả về response
- ✅ `req` object được truyền qua tất cả các tầng
- ✅ Luôn xử lý error với try-catch
- ✅ Response chỉ được gửi một lần
- ✅ Sử dụng async/await cho tất cả operations

---

**Tài liệu này giúp bạn hiểu rõ cách Backend xử lý request từ Frontend qua từng tầng! 🚀**

