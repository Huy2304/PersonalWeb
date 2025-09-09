import React, { useEffect, useState } from "react";
import { Grid, Paper, Typography, Box, CircularProgress, Alert } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";
import { getAllPost } from "../../Services/BlogService.js";
import { useAdminAuth } from "../context/AdminAuthContext";
import { useTheme } from "../context/ThemeContext";

// Màu sắc đẹp hơn cho biểu đồ (tránh đen trắng)
const COLORS = [
    "#667eea", "#764ba2", "#f093fb", "#f5576c", 
    "#4facfe", "#00f2fe", "#43e97b", "#38f9d7",
    "#fa709a", "#fee140", "#a8edea", "#fed6e3",
    "#ff6b6b", "#feca57", "#48dbfb", "#ff9ff3", 
    "#54a0ff", "#5f27cd", "#00d2d3", "#ff3838"
];

const Dashboard = () => {
    const [posts, setPosts] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [timeData, setTimeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { adminUser, adminToken } = useAdminAuth();
    const { darkMode } = useTheme();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const data = await getAllPost();
                const allPosts = data.posts || data || [];
                setPosts(allPosts);

                // Gom nhóm theo category với xử lý tốt hơn
                const categoryCount = {};
                allPosts.forEach(p => {
                    if (p.category_id) {
                        const catName = p.category_id.name || "Khác";
                        categoryCount[catName] = (categoryCount[catName] || 0) + 1;
                    } else {
                        categoryCount["Khác"] = (categoryCount["Khác"] || 0) + 1;
                    }
                });

                // Sắp xếp theo số lượng giảm dần và giới hạn hiển thị
                const sortedCategories = Object.entries(categoryCount)
                    .map(([name, value]) => ({ name, value }))
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 8); // Chỉ hiển thị top 8 danh mục

                setCategoryData(sortedCategories);

                // Gom nhóm theo tháng để biểu đồ đẹp hơn
                const monthlyCount = {};
                allPosts.forEach(p => {
                    if (p.date_published) {
                        const date = new Date(p.date_published);
                        const monthKey = `${date.getMonth() + 1}/${date.getFullYear()}`;
                        monthlyCount[monthKey] = (monthlyCount[monthKey] || 0) + 1;
                    }
                });

                // Sắp xếp theo thời gian và giới hạn 12 tháng gần nhất
                const sortedTimeData = Object.entries(monthlyCount)
                    .map(([month, count]) => ({ month, count }))
                    .sort((a, b) => {
                        const [aMonth, aYear] = a.month.split('/');
                        const [bMonth, bYear] = b.month.split('/');
                        return new Date(aYear, aMonth - 1) - new Date(bYear, bMonth - 1);
                    })
                    .slice(-12);

                setTimeData(sortedTimeData);
                
            } catch (err) {
                console.error("Lỗi khi lấy dữ liệu Dashboard:", err);
                setError("Không thể tải dữ liệu dashboard. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };
        
        fetchPosts();
    }, []);

    // Custom tooltip cho biểu đồ tròn
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <Box
                    sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        padding: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                >
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                        {payload[0].name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                        Số bài: {payload[0].value}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#888' }}>
                        Tỷ lệ: {((payload[0].value / posts.length) * 100).toFixed(1)}%
                    </Typography>
                </Box>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ ml: 2 }}>Đang tải dữ liệu...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error" sx={{ fontSize: '16px' }}>
                    {error}
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ 
            p: 3, 
            backgroundColor: darkMode ? 'var(--bg-primary)' : '#f8f9fa', 
            minHeight: '100vh' 
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ 
                    color: darkMode ? 'var(--text-primary)' : '#2c3e50', 
                    fontWeight: 'bold' 
                }}>
                    Dashboard
                </Typography>
            </Box>
            
            <Grid container spacing={3}>
                {/* Biểu đồ tròn - Posts theo Category */}
                <Grid item xs={12} lg={6}>
                    <Paper 
                        elevation={3}
                        sx={{ 
                            p: 3, 
                            borderRadius: '16px',
                            background: darkMode 
                                ? 'var(--bg-secondary)' 
                                : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                            border: `1px solid ${darkMode ? 'var(--border-color)' : '#e1e5e9'}`,
                            height: '500px'
                        }}
                    >
                        <Typography variant="h6" sx={{ 
                            mb: 2, 
                            color: darkMode ? 'var(--text-primary)' : '#2c3e50', 
                            fontWeight: '600' 
                        }}>
                            📊 Bài viết theo danh mục
                        </Typography>
                        
                        {categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={400}>
                                <PieChart margin={{ top: 20, right: 20, bottom: 80, left: 20 }}>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="45%"
                                        labelLine={false}
                                        outerRadius={120}
                                        innerRadius={60}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={false}
                                        paddingAngle={2}
                                    >
                                         {categoryData.map((entry, index) => (
                                             <Cell 
                                                 key={`cell-${index}`} 
                                                 fill={COLORS[index % COLORS.length]}
                                                 stroke="#fff"
                                                 strokeWidth={2}
                                             />
                                         ))}
                                     </Pie>
                                     <Tooltip content={<CustomTooltip />} />
                                     <Legend 
                                         verticalAlign="bottom" 
                                         height={80}
                                         wrapperStyle={{ 
                                             fontSize: '12px',
                                             paddingTop: '20px'
                                         }}
                                         layout="horizontal"
                                         align="center"
                                     />
                                 </PieChart>
                             </ResponsiveContainer>
                        ) : (
                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                height: 200,
                                color: darkMode ? 'var(--text-secondary)' : '#999'
                            }}>
                                <Typography variant="body1">Không có dữ liệu để hiển thị</Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* Biểu đồ cột - Số bài theo thời gian */}
                <Grid item xs={12} lg={4}>
                    <Paper 
                        elevation={3}
                        sx={{ 
                            p: 3, 
                            borderRadius: '16px',
                            background: darkMode 
                                ? 'var(--bg-secondary)' 
                                : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                            border: `1px solid ${darkMode ? 'var(--border-color)' : '#e1e5e9'}`,
                            height: '500px'
                        }}
                    >
                        <Typography variant="h6" sx={{ 
                            mb: 2, 
                            color: darkMode ? 'var(--text-primary)' : '#2c3e50', 
                            fontWeight: '600' 
                        }}>
                            📈 Xu hướng đăng bài theo tháng
                        </Typography>
                        
                        {timeData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={timeData}>
                                    <CartesianGrid 
                                        strokeDasharray="3 3" 
                                        stroke={darkMode ? '#374151' : '#e1e5e9'} 
                                    />
                                    <XAxis 
                                        dataKey="month" 
                                        tick={{ 
                                            fontSize: 12,
                                            fill: darkMode ? '#d1d5db' : '#000'
                                        }}
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                    />
                                    <YAxis tick={{ 
                                        fontSize: 12,
                                        fill: darkMode ? '#d1d5db' : '#000'
                                    }} />
                                    <Tooltip 
                                        contentStyle={{
                                            backgroundColor: darkMode 
                                                ? 'rgba(31, 41, 55, 0.95)' 
                                                : 'rgba(255, 255, 255, 0.95)',
                                            border: `1px solid ${darkMode ? '#374151' : '#ccc'}`,
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                            color: darkMode ? '#f9fafb' : '#000'
                                        }}
                                    />
                                    <Bar 
                                        dataKey="count" 
                                        fill="#4facfe"
                                        radius={[4, 4, 0, 0]}
                                        name="Số bài viết"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                height: 200,
                                color: darkMode ? 'var(--text-secondary)' : '#999'
                            }}>
                                <Typography variant="body1">Không có dữ liệu để hiển thị</Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* Thống kê tổng quan */}
                <Grid item xs={12} lg={2}>
                    <Paper 
                        elevation={2}
                        sx={{ 
                            p: 3, 
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            height: '500px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: '600', textAlign: 'center' }}>
                            📈 Thống kê
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Box sx={{ textAlign: 'center', mb: 3 }}>
                                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        {posts.length}
                                    </Typography>
                                    <Typography variant="body2">Tổng số bài viết</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ textAlign: 'center', mb: 3 }}>
                                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        {categoryData.length}
                                    </Typography>
                                    <Typography variant="body2">Danh mục</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ textAlign: 'center', mb: 3 }}>
                                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        {posts.filter(p => p.status).length}
                                    </Typography>
                                    <Typography variant="body2">Bài đã xuất bản</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        {posts.filter(p => !p.status).length}
                                    </Typography>
                                    <Typography variant="body2">Bài chờ duyệt</Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;