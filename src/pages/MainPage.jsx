import React, { useState, useEffect } from "react";
import {
    Container, Grid, Card, CardContent, CardMedia, Typography, IconButton, Button,
    Box, Chip, TextField, FormControl, InputLabel, Select, MenuItem,
    InputAdornment, Paper, Skeleton, Badge, Stack, Avatar
} from "@mui/material";
import {
    Favorite, ShoppingCart, Add, Remove, Search, Sort,
    FilterAlt, Inventory, Star, Close, Refresh, FavoriteBorder
} from "@mui/icons-material";
import { styled, alpha } from "@mui/material/styles";
import {
    getAllCategories, getAllProducts, productAddToCart,
    updateCartQuantity, updateFavorite
} from "../api/Api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Стилизованные компоненты
const GlassCard = styled(Card)(({ theme }) => ({
    height: "100%",
    display: "flex",
    flexDirection: "column",
    borderRadius: "24px",
    background: "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    transition: "all 0.3s ease",
    "&:hover": {
        transform: "translateY(-8px)",
        boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
    },
}));

const GradientButton = styled(Button)(({ theme }) => ({
    background: "linear-gradient(90deg, #3f51b5 0%, #2196f3 100%)",
    color: "white",
    borderRadius: "12px",
    padding: "10px 24px",
    fontWeight: 700,
    textTransform: "none",
    boxShadow: "none",
    "&:hover": {
        boxShadow: "0 4px 12px rgba(33, 150, 243, 0.3)",
    },
}));

const MainPage = () => {
    const navigate = useNavigate();
    const [productList, setProductList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState("none");
    const [showInStockOnly, setShowInStockOnly] = useState(false);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [products, categories] = await Promise.all([
                    getAllProducts(),
                    getAllCategories()
                ]);
                setProductList(products);
                setCategoryList(categories);
            } catch (error) {
                console.error("Ошибка загрузки данных:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const toggleFavorite = async (productId) => {
        try {
            await updateFavorite(productId);
            setProductList((prev) =>
                prev.map((p) =>
                    p.id === productId ? { ...p, favorite: !p.favorite } : p
                )
            );
        } catch (error) {
            console.error("Ошибка обновления избранного:", error);
        }
    };

    const addToCart = async (productId) => {
        try {
            await productAddToCart(productId, 1);
            setProductList((prev) =>
                prev.map((p) =>
                    p.id === productId ? { ...p, countInCart: (p.countInCart || 0) + 1 } : p
                )
            );
        } catch (error) {
            console.error("Ошибка добавления в корзину:", error);
        }
    };

    const updateQuantity = async (productId, quantity) => {
        try {
            await updateCartQuantity(productId, quantity);
            setProductList((prev) =>
                prev.map((p) =>
                    p.id === productId ? { ...p, countInCart: quantity } : p
                )
            );
        } catch (error) {
            console.error("Ошибка обновления количества:", error);
        }
    };

    const filteredProducts = productList
        .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter((p) => (showInStockOnly ? p.stock > 0 : true))
        .filter((p) => (showFavoritesOnly ? p.favorite : true))
        .filter((p) => selectedCategory === "all" || p.categoryId === selectedCategory)
        .sort((a, b) => {
            if (sortOrder === "price_asc") return a.price - b.price;
            if (sortOrder === "price_desc") return b.price - a.price;
            return a.id - b.id;
        });

    const resetFilters = () => {
        setSearchQuery("");
        setSelectedCategory("all");
        setShowInStockOnly(false);
        setShowFavoritesOnly(false);
        setSortOrder("none");
    };

    return (
        <Container maxWidth="xl" sx={{ pt: 2, pb: 6 }}>
            {/* Hero Section */}
            <Box sx={{
                borderRadius: 4,
                p: 6,
                mb: 4,
                background: "linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)",
                color: "white",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 0%, transparent 60%)",
                }
            }}>
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800, position: "relative" }}>
                    Добро пожаловать в AutoPart
                </Typography>
                <Typography variant="h6" sx={{ maxWidth: 800, mx: "auto", opacity: 0.9, position: "relative" }}>
                    Откройте для себя лучшие товары по выгодным ценам с бесплатной доставкой от 5000 ₽
                </Typography>
            </Box>

            {/* Filters Section */}
            <Paper elevation={0} sx={{
                p: 3,
                mb: 4,
                borderRadius: 3,
                background: "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(0, 0, 0, 0.1)"
            }}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">
                    <TextField
                        fullWidth
                        label="Поиск товаров"
                        variant="outlined"
                        size="small"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{ flex: 1 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search color="primary" />
                                </InputAdornment>
                            ),
                            endAdornment: searchQuery && (
                                <InputAdornment position="end">
                                    <IconButton size="small" onClick={() => setSearchQuery("")}>
                                        <Close fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: { borderRadius: 3 }
                        }}
                    />

                    <Stack direction="row" spacing={2} sx={{ width: { xs: "100%", md: "auto" } }}>
                        <FormControl size="small" sx={{ minWidth: 180 }}>
                            <InputLabel>Категория</InputLabel>
                            <Select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                label="Категория"
                                sx={{ borderRadius: 3 }}
                                startAdornment={<FilterAlt sx={{ mr: 1, color: "action.active" }} />}
                            >
                                <MenuItem value="all">Все категории</MenuItem>
                                {categoryList.map((cat) => (
                                    <MenuItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl size="small" sx={{ minWidth: 180 }}>
                            <InputLabel>Сортировка</InputLabel>
                            <Select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                label="Сортировка"
                                sx={{ borderRadius: 3 }}
                                startAdornment={<Sort sx={{ mr: 1, color: "action.active" }} />}
                            >
                                <MenuItem value="none">По умолчанию</MenuItem>
                                <MenuItem value="price_asc">Цена: по возрастанию</MenuItem>
                                <MenuItem value="price_desc">Цена: по убыванию</MenuItem>
                            </Select>
                        </FormControl>

                        <Button
                            variant={showInStockOnly ? "contained" : "outlined"}
                            startIcon={<Inventory />}
                            onClick={() => setShowInStockOnly(!showInStockOnly)}
                            sx={{ borderRadius: 3 }}
                        >
                            В наличии
                        </Button>

                        <Button
                            variant={showFavoritesOnly ? "contained" : "outlined"}
                            startIcon={<Star color={showFavoritesOnly ? "warning" : "inherit"} />}
                            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                            sx={{ borderRadius: 3 }}
                        >
                            Избранное
                        </Button>

                        {(searchQuery || selectedCategory !== "all" || showInStockOnly || showFavoritesOnly || sortOrder !== "none") && (
                            <Button
                                variant="text"
                                startIcon={<Refresh />}
                                onClick={resetFilters}
                                sx={{ borderRadius: 3 }}
                            >
                                Сбросить
                            </Button>
                        )}
                    </Stack>
                </Stack>
            </Paper>

            {/* Products Grid */}
            {loading ? (
                <Grid container spacing={4}>
                    {[...Array(8)].map((_, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                            <Skeleton variant="rounded" height={360} sx={{ borderRadius: 3 }} />
                        </Grid>
                    ))}
                </Grid>
            ) : filteredProducts.length > 0 ? (
                <Grid container spacing={4}>
                    {filteredProducts.map((product) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                            <motion.div
                                whileHover={{ y: -5 }}
                                transition={{ duration: 0.2 }}
                            >
                                <GlassCard>
                                    <Box sx={{ position: "relative" }}>
                                        <Badge
                                            badgeContent={product.discount > 0 ? `-${product.discount}%` : null}
                                            color="error"
                                            overlap="rectangular"
                                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                            sx={{
                                                '& .MuiBadge-badge': {
                                                    fontSize: '0.8rem',
                                                    fontWeight: 700,
                                                    padding: '4px 8px',
                                                    borderRadius: '12px'
                                                }
                                            }}
                                        >
                                            <CardMedia
                                                component="img"
                                                image={product.image || "/placeholder-product.jpg"}
                                                alt={product.name}
                                                sx={{
                                                    height: 200,
                                                    objectFit: "cover",
                                                    cursor: "pointer",
                                                    borderTopLeftRadius: "24px",
                                                    borderTopRightRadius: "24px"
                                                }}
                                                onClick={() => navigate(`/products/${product.id}`)}
                                            />
                                        </Badge>
                                        <IconButton
                                            sx={{
                                                position: "absolute",
                                                top: 12,
                                                right: 12,
                                                bgcolor: "background.paper",
                                                "&:hover": {
                                                    bgcolor: "background.default"
                                                }
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleFavorite(product.id);
                                            }}
                                        >
                                            {product.favorite ? (
                                                <Favorite color="error" />
                                            ) : (
                                                <FavoriteBorder />
                                            )}
                                        </IconButton>
                                        {product.stock <= 0 && (
                                            <Box sx={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                bgcolor: "rgba(255,255,255,0.7)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                borderTopLeftRadius: "24px",
                                                borderTopRightRadius: "24px"
                                            }}>
                                                <Chip
                                                    label="Нет в наличии"
                                                    color="error"
                                                    size="medium"
                                                    sx={{ fontWeight: 600 }}
                                                />
                                            </Box>
                                        )}
                                    </Box>
                                    <CardContent
                                        sx={{
                                            flexGrow: 1,
                                            cursor: "pointer",
                                            p: 3
                                        }}
                                        onClick={() => navigate(`/products/${product.id}`)}
                                    >
                                        <Typography variant="h6" fontWeight={700} gutterBottom sx={{
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                            minHeight: 64
                                        }}>
                                            {product.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{
                                            mb: 2,
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                            minHeight: 40
                                        }}>
                                            {product.description}
                                        </Typography>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <Typography
                                                variant="h6"
                                                color="primary"
                                                fontWeight="bold"
                                            >
                                                {product.price.toLocaleString('ru-RU')} ₽
                                            </Typography>
                                            {product.stock > 0 && (
                                                <Chip
                                                    label={`${product.stock} шт.`}
                                                    color="success"
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ fontWeight: 600 }}
                                                />
                                            )}
                                        </Box>
                                    </CardContent>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            px: 3,
                                            py: 2,
                                            bgcolor: "background.default",
                                            borderTop: "1px solid",
                                            borderColor: "divider",
                                            borderBottomLeftRadius: "24px",
                                            borderBottomRightRadius: "24px"
                                        }}
                                    >
                                        {product.countInCart > 0 ? (
                                            <Box sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                bgcolor: "primary.light",
                                                borderRadius: 3,
                                                px: 1,
                                                py: 0.5
                                            }}>
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        updateQuantity(product.id, product.countInCart - 1);
                                                    }}
                                                    disabled={product.stock === 0}
                                                >
                                                    <Remove fontSize="small" />
                                                </IconButton>
                                                <Typography mx={1} fontWeight={600}>
                                                    {product.countInCart}
                                                </Typography>
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        updateQuantity(product.id, product.countInCart + 1);
                                                    }}
                                                    disabled={product.stock === product.countInCart}
                                                >
                                                    <Add fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        ) : (
                                            <GradientButton
                                                startIcon={<ShoppingCart />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addToCart(product.id);
                                                }}
                                                disabled={product.stock === 0}
                                                size="small"
                                                sx={{ flex: 1 }}
                                            >
                                                В корзину
                                            </GradientButton>
                                        )}
                                    </Box>
                                </GlassCard>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Paper elevation={0} sx={{
                    p: 6,
                    textAlign: "center",
                    borderRadius: 3,
                    background: "rgba(255, 255, 255, 0.85)",
                    backdropFilter: "blur(10px)"
                }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                        Ничего не найдено
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                        Попробуйте изменить параметры поиска или сбросить фильтры
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<Refresh />}
                        onClick={resetFilters}
                        sx={{ borderRadius: 3 }}
                    >
                        Сбросить фильтры
                    </Button>
                </Paper>
            )}
        </Container>
    );
};

export default MainPage;