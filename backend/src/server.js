import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import blogPosts from "./routes/blogPosts.routes.js";
import authRoutes from "./routes/auth.routes.js";
import Category from "./routes/category.routes.js";
import Comment from "./routes/comment.routes.js";
import Share from "./routes/share.routes.js";
import Notification from "./routes/notification.routes.js";
import Interaction from "./routes/interaction.routers.js";
import Follow from "./routes/follow.routes.js";
import Profile from "./routes/profile.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import connectDB from "./config/db.js";

// Import middleware auth (bạn cần đảm bảo file này tồn tại và export đúng)
import { authMiddleware } from "./middleware/authMiddleware.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    "https://personal-web-wheat-xi.vercel.app",
    "http://localhost:3000",
    "http://localhost:3001"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// ────────────────────────────────────────────────
// API Versioning + Public / Protected groups
// ────────────────────────────────────────────────

const apiV1 = express.Router();  // Tương đương /api/v1

// ── PUBLIC ROUTES ── (không cần đăng nhập)
const publicRouter = express.Router();

publicRouter.use("/auth", authRoutes);              // register, login, forgot-password, reset-password,...
publicRouter.use("/blogs", blogPosts);              // tạm thời mount toàn bộ blogPosts ở public (GET list/detail có thể public)
publicRouter.use("/category", Category);            // list category, get single category

// Bạn có thể thêm các route public khác ở đây nếu cần
// Ví dụ health check:
// publicRouter.get("/health", (req, res) => {
//   res.status(200).json({ status: "healthy", message: "Server is running" });
// });

apiV1.use("/", publicRouter);

// ── PROTECTED ROUTES ── (bắt buộc đăng nhập)
const protectedRouter = express.Router();
protectedRouter.use(authMiddleware);  // Áp dụng auth cho toàn bộ group này

protectedRouter.use("/profile", Profile);
protectedRouter.use("/comment", Comment);
protectedRouter.use("/share", Share);
protectedRouter.use("/interaction", Interaction);
protectedRouter.use("/follow", Follow);
protectedRouter.use("/notification", Notification);
protectedRouter.use("/admin", adminRoutes);

// Nếu bạn muốn tách POST/PUT/DELETE của blog sang protected (khuyến nghị)
// → Tạo file mới routes/blogPosts.protected.routes.js và mount ở đây
// protectedRouter.use("/blogs", blogPostsProtected);

// Mount toàn bộ /api/v1
app.use("/api/v1", apiV1);

// ────────────────────────────────────────────────
// 404 Handler
// ────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: "Không tìm thấy endpoint" 
  });
});

// Error handler cơ bản (có thể mở rộng sau)
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === "production" ? "Lỗi server" : err.message,
  });
});

// Connect DB & Start server
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}/api/v1`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});