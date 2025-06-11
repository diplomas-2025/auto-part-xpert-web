import React, { useEffect, useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Avatar,
    Badge,
    Menu,
    MenuItem,
    Divider,
    ListItemIcon,
    ListItemText,
    Slide,
    useScrollTrigger
} from "@mui/material";
import {
    ShoppingBag,
    History,
    Logout,
    Person,
    Menu as MenuIcon,
    Search
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { styled, alpha } from "@mui/material/styles";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
    color: theme.palette.text.primary,
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    transition: 'all 0.3s ease',
}));

const FloatingLogo = styled(Typography)(({ theme }) => ({
    fontWeight: 800,
    letterSpacing: '-0.5px',
    background: 'linear-gradient(90deg, #3f51b5 0%, #2196f3 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    cursor: 'pointer',
    '&:hover': {
        opacity: 0.9
    }
}));

const Header = () => {
    const [username, setUsername] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [cartItemsCount, setCartItemsCount] = useState(0);
    const navigate = useNavigate();
    const open = Boolean(anchorEl);
    const scrolled = useScrollTrigger({
        threshold: 10
    });

    useEffect(() => {
        setUsername(localStorage.getItem("username"));
        // In a real app, you would fetch cart items count from your state/API
    }, []);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleCartClick = () => {
        navigate("/cart");
    };

    const handleHistoryClick = () => {
        navigate("/orders");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    const handleSearchClick = () => {
        navigate("/search");
    };

    return (
        <Slide appear={false} direction="down" in={!scrolled}>
            <StyledAppBar position="fixed" elevation={0}>
                <Toolbar sx={{
                    justifyContent: 'space-between',
                    px: { xs: 2, md: 4 },
                    py: 1
                }}>
                    {/* Left side - Logo */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <FloatingLogo
                            variant="h6"
                            onClick={() => navigate("/")}
                            sx={{
                                fontSize: { xs: '1.25rem', md: '1.5rem' }
                            }}
                        >
                            AlumTrade
                        </FloatingLogo>

                    </Box>

                    {/* Right side - Navigation */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {/* Desktop icons */}
                        <IconButton
                            onClick={handleCartClick}
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                color: 'text.primary',
                                position: 'relative'
                            }}
                        >
                            <Badge
                                badgeContent={cartItemsCount}
                                color="primary"
                                overlap="circular"
                                sx={{
                                    '& .MuiBadge-badge': {
                                        right: 5,
                                        top: 5,
                                        border: `2px solid ${alpha('#ffffff', 0.9)}`,
                                        padding: '0 4px',
                                        fontWeight: 600
                                    }
                                }}
                            >
                                <ShoppingBag />
                            </Badge>
                        </IconButton>

                        <IconButton
                            onClick={handleHistoryClick}
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                color: 'text.primary'
                            }}
                        >
                            <History />
                        </IconButton>

                        {/* Mobile menu button */}
                        <IconButton
                            onClick={handleMenuOpen}
                            sx={{
                                display: { xs: 'flex', md: 'none' },
                                color: 'text.primary'
                            }}
                        >
                            <MenuIcon />
                        </IconButton>

                        {/* User avatar - desktop */}
                        <Box
                            onClick={handleMenuOpen}
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                alignItems: 'center',
                                gap: 1,
                                ml: 2,
                                cursor: 'pointer',
                                '&:hover': {
                                    opacity: 0.8
                                }
                            }}
                        >
                            <Avatar
                                sx={{
                                    bgcolor: 'primary.main',
                                    width: 36,
                                    height: 36,
                                    fontSize: '1rem',
                                    fontWeight: 600
                                }}
                            >
                                {username ? username[0].toUpperCase() : "U"}
                            </Avatar>
                        </Box>
                    </Box>

                    {/* Mobile menu */}
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleMenuClose}
                        PaperProps={{
                            elevation: 0,
                            sx: {
                                width: 280,
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.1))',
                                mt: 1.5,
                                '& .MuiAvatar-root': {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1,
                                },
                                '&:before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                },
                            },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <MenuItem onClick={handleCartClick}>
                            <ListItemIcon>
                                <Badge badgeContent={cartItemsCount} color="primary" size="small">
                                    <ShoppingBag fontSize="small" />
                                </Badge>
                            </ListItemIcon>
                            <ListItemText>Корзина</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={handleHistoryClick}>
                            <ListItemIcon>
                                <History fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>История</ListItemText>
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon>
                                <Logout fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Выйти</ListItemText>
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </StyledAppBar>
        </Slide>
    );
};

export default Header;