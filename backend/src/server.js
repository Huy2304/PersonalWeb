import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import blogPosts from "./routes/blogPosts.routes.js";
import authRoutes from "./routes/auth.routes.js"
import Category from "./routes/category.routes.js"
import Comment from "./routes/comment.routes.js"
import Share from "./routes/share.routes.js";
import Notification from "./routes/notification.routes.js"
import Interaction from "./routes/interaction.routers.js"
import Follow from "./routes/follow.routes.js"
import Profile from "./routes/profile.routes.js"
import connectDB from "./config/db.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/blogs", blogPosts);
app.use("/api/auth", authRoutes);
app.use("/api/category", Category);
app.use("/api/comment", Comment);
app.use("/api/share", Share);
app.use("/api/notification", Notification);
app.use("/api/interaction", Interaction);
app.use("/api/follow", Follow);
app.use("/api/profile", Profile);

// Connect DB & Start server
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
