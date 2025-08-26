import Post from '../models/Post.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Tag from '../models/Tag.js';

// Tìm kiếm bài viết, người dùng, và các đối tượng khác
export async function search(key) {
    try {
        const searchResults = {
            posts: [],
            users: [],
            categories: [],
            tags: []
        };

        // Tìm kiếm trong bài viết (Post)
        const postResults = await Post.find({
            $or: [
                { title: { $regex: key, $options: 'i' } },  // Tìm kiếm theo title (không phân biệt chữ hoa/thường)
                { content: { $regex: key, $options: 'i' } },  // Tìm kiếm theo nội dung
                { description: { $regex: key, $options: 'i' } }  // Tìm kiếm theo mô tả
            ]
        });
        searchResults.posts = postResults;

        // Tìm kiếm người dùng (User)
        const userResults = await User.find({
            $or: [
                { username: { $regex: key, $options: 'i' } },  // Tìm kiếm theo tên người dùng
                { email: { $regex: key, $options: 'i' } }     // Tìm kiếm theo email
            ]
        });
        searchResults.users = userResults;

        // Tìm kiếm danh mục (Category)
        const categoryResults = await Category.find({
            name: { $regex: key, $options: 'i' }  // Tìm kiếm theo tên danh mục
        });
        searchResults.categories = categoryResults;

        // Tìm kiếm thẻ (Tag)
        const tagResults = await Tag.find({
            name: { $regex: key, $options: 'i' }  // Tìm kiếm theo tên thẻ
        });
        searchResults.tags = tagResults;

        // Trả về kết quả tìm kiếm
        return searchResults;
    } catch (error) {
        console.error('Error searching:', error);
        throw new Error('Failed to perform search');
    }
}
