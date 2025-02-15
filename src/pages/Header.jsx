import React, {useEffect, useState} from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Avatar,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HistoryIcon from "@mui/icons-material/History";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import {useNavigate} from "react-router-dom";

const Header = () => {

    const [username, setUsername] = useState("");
    const navigate = useNavigate()

    useEffect(() => {
        setUsername(localStorage.getItem("username"))
    }, [])

    const handleCartClick = () => {
        navigate("/cart")
    };

    const handleHistoryClick = () => {
        navigate("/orders")
    };

    const handleLogout = () => {
        localStorage.removeItem("token")
        window.location.reload();
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: "primary.main" }}>
            <Toolbar>
                {/* Логотип или название приложения */}
                <Typography variant="h6" component="div" onClick={() => navigate("/")} sx={{ flexGrow: 1, cursor: "pointer" }}>
                    Алюмторг
                </Typography>

                {/* Имя пользователя и аватар */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 2 }}>
                    <Avatar sx={{ bgcolor: "secondary.main" }}>
                        {username ? username[0] : "U"}
                    </Avatar>
                    <Typography variant="body1">{username || "Гость"}</Typography>
                </Box>

                {/* Кнопка корзины */}
                <IconButton color="inherit" onClick={handleCartClick}>
                    <ShoppingCartIcon />
                </IconButton>

                {/* Кнопка истории заказов */}
                <IconButton color="inherit" onClick={handleHistoryClick}>
                    <HistoryIcon />
                </IconButton>

                {/* Кнопка выхода */}
                <IconButton color="inherit" onClick={handleLogout}>
                    <ExitToAppIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default Header;