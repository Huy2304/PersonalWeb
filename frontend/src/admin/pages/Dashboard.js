import React, { useEffect, useState } from "react";
import { Grid, Paper, Typography } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { getAllPost } from "../../Services/BlogService.js";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD", "#E74C3C"];

const Dashboard = () => {
    const [posts, setPosts] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [timeData, setTimeData] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await getAllPost();
                const allPosts = data.posts || data || [];
                setPosts(allPosts);

                // Gom nhóm theo category
                const categoryCount = {};
                allPosts.forEach(p => {
                    const cat = p.category_id?.name || "Khác";
                    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
                });
                setCategoryData(Object.entries(categoryCount).map(([name, value]) => ({ name, value })).filter(item => item.value > 0));

                // Gom nhóm theo ngày (dd/MM/yyyy)
                const timeCount = {};
                allPosts.forEach(p => {
                    const date = new Date(p.date_published).toLocaleDateString("vi-VN");
                    timeCount[date] = (timeCount[date] || 0) + 1;
                });
                setTimeData(Object.entries(timeCount).map(([date, count]) => ({ date, count })).sort((a, b) => new Date(a.date) - new Date(b.date)));
            } catch (err) {
                console.error("Lỗi khi lấy dữ liệu Dashboard:", err);
            }
        };
        fetchPosts();
    }, []);

    return (
        <div style={{ display: "flex", width: "100%", padding: "20px" }}>
            <Grid container spacing={3}>
                {/* Biểu đồ tròn - Posts theo Category */}
                <Grid item xs={12} md={6}>
                    <Paper style={{ padding: "20px" }}>
                        <Typography variant="h6" gutterBottom>
                            Bài viết theo danh mục
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categoryData.length ? categoryData : [{ name: "Không có dữ liệu", value: 1 }]}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={120}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, value }) => `${name} (${value})`}
                                >
                                    {categoryData.length ? categoryData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    )) : <Cell fill="#CCCCCC" />}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
                {/* Biểu đồ đường - Số bài theo thời gian */}
                <Grid item xs={12} md={6}>
                    <Paper style={{ padding: "20px" }}>
                        <Typography variant="h6" gutterBottom>
                            Xu hướng đăng bài
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={timeData.length ? timeData : [{ date: "01/01/2025", count: 0 }]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="count" stroke="#8884d8" name="Số bài" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
};

export default Dashboard;