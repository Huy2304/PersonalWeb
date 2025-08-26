// services/posts.service.js
import mongoose from "mongoose";
import Post from "../models/Post.js";

function buildListCond(q) {
    const cond = {};
    if (q.status === "published") cond.status = true;
    if (q.category_id) cond.category_id = q.category_id;
    if (q.tag) cond.tags = q.tag;
    return cond;
}

export async function listPosts(q = {}) {
    const page = Math.max(1, Number(q.page) || 1);
    const limit = Math.min(50, Number(q.limit) || 10);
    const cond = buildListCond(q);

    return Post.find(cond)
        .select("title img_path date_published likes_count tags user_id category_id")
        .populate({ path: "user_id", select: "name avatar" })
        .populate({ path: "category_id", select: "name slug" })
        .sort({ date_published: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
}

export async function getPostById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const err = new Error("Invalid id");
        err.status = 400;
        throw err;
    }
    const doc = await Post.findById(id)
        .populate({ path: "user_id", select: "name avatar" })
        .populate({ path: "category_id", select: "name slug" });
    if (!doc) {
        const err = new Error("Post not found");
        err.status = 404;
        throw err;
    }
    return doc;
}

export async function createPost(body) {
    const { title, post, category_id, img_path, status, user_id } = body;
    const data = {
        title, post, category_id, img_path, status, user_id,
        date_updated: new Date(),
        date_published: status ? new Date() : null,
    };
    return Post.create(data);
}

export async function updatePost(id, body) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const err = new Error("Invalid id");
        err.status = 400;
        throw err;
    }
    const { title, post, category_id, img_path, status } = body;

    const $set = {
        date_updated: new Date(),
    };
    if (title !== undefined) $set.title = title;
    if (post !== undefined) $set.post = post;
    if (category_id !== undefined) $set.category_id = category_id;
    if (img_path !== undefined) $set.img_path = img_path;
    if (typeof status === "boolean") {
        $set.status = status;
        if (status === true) $set.date_published = new Date();
    }

    const doc = await Post.findByIdAndUpdate(id, { $set }, { new: true });
    if (!doc) {
        const err = new Error("Post not found");
        err.status = 404;
        throw err;
    }
    return doc;
}

export async function deletePost(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const err = new Error("Invalid id");
        err.status = 400;
        throw err;
    }
    const doc = await Post.findByIdAndDelete(id);
    if (!doc) {
        const err = new Error("Post not found");
        err.status = 404;
        throw err;
    }
    return { message: "Successfully deleted" };
}

