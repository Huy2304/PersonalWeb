import { search } from '../services/search.service.js';

export async function searchPosts(req, res) {
    try {
        const { key } = req.body;  // Lấy từ khóa tìm kiếm từ query params
        if (!key) {
            return res.status(400).json({ message: 'Search key is required' });
        }

        const results = await search(key);  // Gọi dịch vụ tìm kiếm
        res.status(200).json(results);  // Trả về kết quả tìm kiếm
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
