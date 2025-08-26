//controllers/Posts.controllers.js
import express from "express";
import mongoose from "mongoose";

import Post from "../models/Post.js";

const router = express.Router();

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('user_id').populate('category_id');
    res.status(200).json(posts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const addPost = async (req, res) => {
  const { title, post, category_id, img_path, status, user_id } = req.body;

  const createNewPost = new Post({
    title,
    post,
    category_id,
    img_path,
    status,
    user_id,
    date_updated: new Date(),
    date_published: status ? new Date() : null,
  });

  try {
    await createNewPost.save();
    res.status(201).json(createNewPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getSinglePost = async (req, res) => {
  const { id } = req.params;

  try {
    const singlePost = await Post.findById(id).populate('user_id').populate('category_id');

    if (!singlePost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(singlePost);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateSinglePost = async (req, res) => {
  const { id } = req.params;
  const { title, post, category_id, img_path, status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`Post with id: ${id} not found`);

  const updatedPost = {
    title,
    post,
    category_id,
    img_path,
    status,
    date_updated: new Date(),
    date_published: status ? new Date() : null,
  };

  try {
    const result = await Post.findByIdAndUpdate(id, updatedPost, { new: true });
    if (!result) {
      return res.status(404).send("Post not found");
    }
    res.json(result);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const likePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  try {
    const post = await Post.findById(id);

    const updatedPost = await Post.findByIdAndUpdate(
        id,
        { likes_count: post.likes_count + 1 },
        { new: true }
    );

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeSinglePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`Post with id: ${id} not found`);

  try {
    await Post.findByIdAndRemove(id);
    res.json({ message: "Successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default router;