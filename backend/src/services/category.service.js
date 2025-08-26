// services/category.service.js
import mongoose from "mongoose";
import Category from "../models/Category.js";

function oid(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const e = new Error("ID không hợp lệ"); e.status = 400; throw e;
    }
    return id;
}

export async function createCategory({ name, description, status }) {
    const doc = new Category({ name, description, status });
    return doc.save();
}

export async function listCategories() {
    return Category.find().lean();
}

export async function getCategory(id) {
    const doc = await Category.findById(oid(id)).lean();
    if (!doc) { const e = new Error("Không tìm thấy"); e.status = 404; throw e; }
    return doc;
}

export async function updateCategory(id, body) {
    const { name, description, status } = body;
    const doc = await Category.findByIdAndUpdate(
        oid(id),
        { $set: { ...(name!==undefined&&{name}), ...(description!==undefined&&{description}), ...(status!==undefined&&{status}) } },
        { new: true, runValidators: true }
    );
    if (!doc) { const e = new Error("Không tìm thấy"); e.status = 404; throw e; }
    return doc;
}

export async function deleteCategory(id) {
    const doc = await Category.findByIdAndDelete(oid(id));
    if (!doc) { const e = new Error("Không tìm thấy"); e.status = 404; throw e; }
    return { message: "Đã xóa thành công" };
}
