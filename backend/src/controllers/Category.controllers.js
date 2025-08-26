import express from 'express';
import mongoose from 'mongoose';

import Category from '../models/Category.js';

const router = express.Router();

export const addCategory = async (req, res) => {
    const { name, description, status  } = req.body;

    const createCategory = new Category({
        name,
        description,
        status,
    });

    try{
        await createCategory.save();
        res.status(201).json({createCategory});
    }
    catch(err){
        res.status(500).json({error: err});
    }
}

export const getAllCategory = async (req, res) => {
    try {
        // Kiểm tra kết nối cơ sở dữ liệu (nếu cần, tùy vào cách bạn xử lý kết nối)
        const category = await Category.find();

        // Nếu không có dữ liệu
        if (!category || category.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy danh mục nào" });
        }

        // Trả về dữ liệu thành công
        res.status(200).json(category);

    } catch (err) {
        // Gửi thông báo lỗi chi tiết cho việc truy vấn
        console.error(err); // Log lỗi để dễ dàng debug

        // Kiểm tra lỗi cụ thể
        if (err.name === "MongoError") {
            return res.status(500).json({ error: "Lỗi cơ sở dữ liệu" });
        }

        // Trả về lỗi chung nếu không xác định được
        return res.status(500).json({ error: "Lỗi hệ thống, vui lòng thử lại sau" });
    }
};


export const getCategory = async (req, res) => {
    const {id} = req.params;
    try{
        const data = await Category.findById(id);
        res.status(200).json({data});
    }
    catch(err){
        res.status(500).json({error: err});
    }
}

export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send('Not a valid id for this category');
    }

    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { name, description, status }, // Chỉ cập nhật các trường này
            { new: true }  // Trả về document mới sau khi update
        );
        if (!updatedCategory) {
            return res.status(404).send('Category not found');
        }
        res.status(200).json(updatedCategory);
    } catch (err) {
        res.status(500).json({ message: "An error occurred while updating the category.", error: err.message });
    }
};


export const deleteCategory = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).send('Not a valid id for this category');
    try{
        const data = await Category.findByIdAndDelete(id);
        res.status(200).send("Đã xóa thành công");
    }catch(err){
        res.status(500).json({error: err});
    }
}