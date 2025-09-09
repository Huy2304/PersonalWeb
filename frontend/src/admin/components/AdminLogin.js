import React, { useState } from 'react';
import { 
    Box, 
    Paper, 
    TextField, 
    Button, 
    Typography, 
    Alert,
    CircularProgress,
    Container
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';

const AdminLogin = ({ onLoginSuccess }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('https://personalweb-5cn1.onrender.com/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                // Kiểm tra xem user có role admin không
                if (data.result && data.result.role === 'admin') {
                    // Lưu token và thông tin admin
                    localStorage.setItem('adminToken', data.token);
                    localStorage.setItem('adminUser', JSON.stringify(data.result));
                    onLoginSuccess(data.result, data.token);
                } else {
                    setError('Tài khoản này không có quyền truy cập admin!');
                }
            } else {
                setError(data.message || 'Đăng nhập thất bại');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="sm">
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
            >
                <Paper
                    elevation={24}
                    sx={{
                        padding: 4,
                        borderRadius: '20px',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        width: '100%',
                        maxWidth: 400
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        {/* Header */}
                        <Box
                            sx={{
                                width: 60,
                                height: 60,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 2,
                                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
                            }}
                        >
                            <LockOutlined sx={{ color: 'white', fontSize: 30 }} />
                        </Box>

                        <Typography 
                            component="h1" 
                            variant="h4" 
                            sx={{ 
                                fontWeight: 'bold',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 1
                            }}
                        >
                            Admin Login
                        </Typography>
                        
                        <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ mb: 3, textAlign: 'center' }}
                        >
                            Vui lòng đăng nhập với tài khoản admin để tiếp tục
                        </Typography>

                        {/* Error Alert */}
                        {error && (
                            <Alert 
                                severity="error" 
                                sx={{ 
                                    width: '100%', 
                                    mb: 2,
                                    borderRadius: '12px'
                                }}
                            >
                                {error}
                            </Alert>
                        )}

                        {/* Login Form */}
                        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Admin"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={formData.email}
                                onChange={handleChange}
                                disabled={loading}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        '&:hover fieldset': {
                                            borderColor: '#667eea',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#667eea',
                                        },
                                    },
                                }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Mật khẩu"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={loading}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        '&:hover fieldset': {
                                            borderColor: '#667eea',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#667eea',
                                        },
                                    },
                                }}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                                sx={{
                                    mt: 3,
                                    mb: 2,
                                    py: 1.5,
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                                        boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
                                    },
                                    '&:disabled': {
                                        background: '#ccc',
                                    }
                                }}
                            >
                                {loading ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    'Đăng nhập Admin'
                                )}
                            </Button>
                        </Box>

                        <Typography 
                            variant="caption" 
                            color="text.secondary" 
                            sx={{ mt: 2, textAlign: 'center' }}
                        >
                            Chỉ những tài khoản có quyền admin mới có thể truy cập
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default AdminLogin;

