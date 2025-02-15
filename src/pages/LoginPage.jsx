import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Container, Paper, Grid, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { signIn } from "../api/Api";
import logoUrl from '../logo.svg';
import {useNavigate} from "react-router-dom";

const AuthPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate()

    const handleClickShowPassword = () => setShowPassword((prev) => !prev);

    const handleSignIn = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Email и пароль обязательны');
            return;
        }
        try {
            const credentials = { email, password };
            const data = await signIn(credentials);
            localStorage.setItem("token", data.accessToken)
            localStorage.setItem("username", data.username)
            localStorage.setItem("userId", data.userId)
            localStorage.setItem("is_admin", data.isAdmin)
            window.location.reload();
        } catch (err) {
            setError('Неверный email или пароль');
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#f4f6f9',  // Background color for the entire screen
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    padding: 4,
                    width: '100%',
                    maxWidth: '400px',
                    borderRadius: '12px', // Rounded corners
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', // Enhanced shadow
                }}
            >
                <Box sx={{ textAlign: 'center', marginBottom: 3 }}>
                    {/* Logo */}
                    <img
                        src={logoUrl}
                        alt="Logo"
                        style={{
                            width: '150px',
                            marginBottom: '20px',
                            transition: 'transform 0.3s ease-in-out',
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    />
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
                        Вход в систему
                    </Typography>
                </Box>

                {error && (
                    <Typography color="error" variant="body2" align="center" sx={{ marginBottom: 3 }}>
                        {error}
                    </Typography>
                )}

                <Box component="form" noValidate onSubmit={handleSignIn}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{
                            '& .MuiInputBase-root': {
                                borderRadius: '8px',  // Rounded input fields
                            },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#3f51b5',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#3f51b5',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#3f51b5',
                                },
                            },
                        }}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Пароль"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <IconButton onClick={handleClickShowPassword} edge="end">
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            ),
                        }}
                        sx={{
                            '& .MuiInputBase-root': {
                                borderRadius: '8px',  // Rounded input fields
                            },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#3f51b5',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#3f51b5',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#3f51b5',
                                },
                            },
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{
                            marginTop: 3,
                            padding: '10px',
                            fontWeight: 'bold',
                            borderRadius: '20px',
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Soft shadow
                            '&:hover': {
                                boxShadow: '0 6px 15px rgba(0, 0, 0, 0.15)',
                            },
                        }}
                    >
                        Войти
                    </Button>

                    <Grid container justifyContent="flex-end" sx={{ marginTop: 3 }}>
                        <Grid item>
                            <Typography variant="body2" color="text.secondary">
                                Нет аккаунта? <Button onClick={() => { navigate("/register") }}>Зарегистрироваться</Button>
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Box>
    );
};

export default AuthPage;
