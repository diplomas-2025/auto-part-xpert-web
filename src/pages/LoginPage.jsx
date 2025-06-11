import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Container,
    Paper,
    Avatar,
    Tabs,
    Tab,
    Snackbar,
    Alert,
    InputAdornment,
    IconButton,
    Divider,
    styled
} from '@mui/material';
import {
    LockOutlined,
    PersonOutline,
    EmailOutlined,
    Visibility,
    VisibilityOff,
    Fingerprint,
    Login,
    HowToReg
} from '@mui/icons-material';
import { signIn, signUp } from "../api/Api";
import { motion } from "framer-motion";

// Стилизованные компоненты
const GlassPaper = styled(Paper)(({ theme }) => ({
    borderRadius: '24px',
    backdropFilter: 'blur(16px)',
    background: 'rgba(255, 255, 255, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    position: 'relative',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #3f51b5 0%, #2196f3 100%)',
    }
}));

const AuthButton = styled(Button)(({ theme }) => ({
    borderRadius: '12px',
    padding: '12px 24px',
    fontWeight: 700,
    textTransform: 'none',
    fontSize: '1rem',
    boxShadow: 'none',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
    }
}));

const AuthPage = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const [formData, setFormData] = useState({ username: '', password: '', email: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const data = tabIndex === 0
                ? await signIn({ email: formData.username, password: formData.password })
                : await signUp(formData);

            localStorage.setItem("token", data.accessToken);
            localStorage.setItem("username", data.username);
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("is_admin", data.isAdmin);

            setSnackbar({
                open: true,
                message: tabIndex === 0 ? 'Вход выполнен успешно!' : 'Регистрация завершена!',
                severity: 'success'
            });

            setTimeout(() => window.location.reload(), 1500);

        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Ошибка: ' + (error.response?.data?.message || 'Не удалось выполнить операцию'),
                severity: 'error'
            });
        }
    };

    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
        <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <GlassPaper elevation={10}>
                    <Box sx={{ p: 4 }}>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Avatar sx={{
                                bgcolor: 'primary.main',
                                width: 64,
                                height: 64,
                                mb: 3
                            }}>
                                <LockOutlined sx={{ fontSize: 32 }} />
                            </Avatar>

                            <Typography variant="h4" sx={{
                                fontWeight: 800,
                                mb: 2,
                                background: 'linear-gradient(90deg, #3f51b5 0%, #2196f3 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                {tabIndex === 0 ? 'Вход в систему' : 'Регистрация'}
                            </Typography>

                            <Tabs
                                value={tabIndex}
                                onChange={(_, newValue) => setTabIndex(newValue)}
                                centered
                                sx={{ mb: 3 }}
                                TabIndicatorProps={{
                                    style: {
                                        backgroundColor: '#2196f3',
                                        height: '3px'
                                    }
                                }}
                            >
                                <Tab label="Вход" icon={<Login />} iconPosition="start" sx={{ minWidth: 120 }} />
                                <Tab label="Регистрация" icon={<HowToReg />} iconPosition="start" sx={{ minWidth: 120 }} />
                            </Tabs>

                            <Box width="100%" mb={3}>
                                <TextField
                                    fullWidth
                                    label="Имя пользователя"
                                    name="username"
                                    variant="outlined"
                                    value={formData.username}
                                    onChange={handleChange}
                                    sx={{ mb: 2 }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonOutline color="primary" />
                                            </InputAdornment>
                                        ),
                                        sx: { borderRadius: '12px' }
                                    }}
                                />

                                {tabIndex === 1 && (
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        variant="outlined"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        sx={{ mb: 2 }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <EmailOutlined color="primary" />
                                                </InputAdornment>
                                            ),
                                            sx: { borderRadius: '12px' }
                                        }}
                                    />
                                )}

                                <TextField
                                    fullWidth
                                    label="Пароль"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    variant="outlined"
                                    value={formData.password}
                                    onChange={handleChange}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Fingerprint color="primary" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={togglePasswordVisibility}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                        sx: { borderRadius: '12px' }
                                    }}
                                />
                            </Box>

                            <AuthButton
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={handleSubmit}
                                size="large"
                                sx={{ mb: 2 }}
                            >
                                {tabIndex === 0 ? 'Войти' : 'Зарегистрироваться'}
                            </AuthButton>
                        </Box>
                    </Box>
                </GlassPaper>
            </motion.div>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{
                        width: '100%',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default AuthPage;