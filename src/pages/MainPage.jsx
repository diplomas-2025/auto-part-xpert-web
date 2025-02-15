import React, { useState, useEffect } from "react";
import {
    Container,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    IconButton,
    Button,
    Box,
    Chip,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    FormControlLabel,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import {
    getAllCategories,
    getAllProducts,
    productAddToCart,
    updateCartQuantity,
    updateFavorite
} from "../api/Api";
import {useNavigate} from "react-router-dom";

const MainPage = () => {
    const navigate = useNavigate()
    // Состояние для продуктов
    const [productList, setProductList] = useState([]);

    // Состояние для категорий
    const [categoryList, setCategoryList] = useState([]);

    // Состояние для поиска
    const [searchQuery, setSearchQuery] = useState("");

    // Состояние для сортировки
    const [sortOrder, setSortOrder] = useState("none");

    // Состояние для фильтров
    const [showInStockOnly, setShowInStockOnly] = useState(false);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("all");

    useEffect(() => {
        getAllProducts().then(r => setProductList(r))
        getAllCategories().then(r => setCategoryList(r))
    }, [])

    // Добавление/удаление из избранного
    const toggleFavorite = (productId) => {
        updateFavorite(productId).then(() => {
            setProductList((prevProducts) =>
                prevProducts.map((product) =>
                    product.id === productId
                        ? { ...product, favorite: !product.favorite }
                        : product
                )
            );
        })
    };

    // Добавление в корзину
    const addToCart = (productId) => {
        productAddToCart(productId, 1).then(r => {
            setProductList((prevProducts) =>
                prevProducts.map((product) =>
                    product.id === productId
                        ? { ...product, countInCart: product.countInCart + 1 }
                        : product
                )
            );
        })
    };

    // Увеличение количества товара в корзине
    const updateQuantity = (productId, quantity) => {
        updateCartQuantity(productId, quantity).then(r => {
            setProductList((prevProducts) =>
                prevProducts.map((product) =>
                    product.id === productId
                        ? { ...product, countInCart: quantity }
                        : product
                )
            );
        })
    };

    // Фильтрация и сортировка продуктов
    const filteredProducts = productList
        .filter((product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter((product) => (showInStockOnly ? product.stock > 0 : true))
        .filter((product) => (showFavoritesOnly ? product.favorite : true))
        .filter((product) =>
            selectedCategory === "all" ? true : product.categoryId === selectedCategory
        )
        .sort((a, b) => {
            if (sortOrder === "price_asc") return a.price - b.price;
            if (sortOrder === "price_desc") return b.price - a.price;
            return a.id - b.id;
        });

    return (
        <Container>
            <div style={{height: "70px"}}/>
            {/* Поиск, сортировка и фильтры */}
            <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
                <TextField
                    label="Поиск"
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ flexGrow: 1 }}
                    InputProps={{
                        startAdornment: <SearchIcon sx={{ mr: 1 }} />,
                    }}
                />
                <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                    <InputLabel>Сортировка</InputLabel>
                    <Select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        label="Сортировка"
                        startAdornment={<SortIcon sx={{ mr: 1 }} />}
                    >
                        <MenuItem value="none">Нет</MenuItem>
                        <MenuItem value="price_asc">Цена (по возрастанию)</MenuItem>
                        <MenuItem value="price_desc">Цена (по убыванию)</MenuItem>
                    </Select>
                </FormControl>
                <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                    <InputLabel>Категория</InputLabel>
                    <Select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        label="Категория"
                    >
                        <MenuItem value="all">Все категории</MenuItem>
                        {categoryList.map((category) => (
                            <MenuItem key={category.id} value={category.id}>
                                {category.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={showInStockOnly}
                                onChange={(e) => setShowInStockOnly(e.target.checked)}
                            />
                        }
                        label="Только в наличии"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={showFavoritesOnly}
                                onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                            />
                        }
                        label="Только избранное"
                    />
                </Box>
            </Box>

            {/* Список продуктов */}
            <Grid container spacing={4}>
                {filteredProducts.map((product) => (
                    <Grid item key={product.id} xs={12} sm={6} md={4}>
                        <Card
                            sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                borderRadius: 3,
                                boxShadow: 3,
                                cursor: "pointer",
                                transition: "transform 0.3s, box-shadow 0.3s",
                                "&:hover": {
                                    transform: "scale(1.03)",
                                    boxShadow: 6,
                                },
                            }}
                            onClick={() => navigate('/products/' + product.id)}
                        >
                            <CardMedia
                                component="img"
                                image={product.image}
                                alt={product.name}
                                sx={{ height: 200, objectFit: "cover", borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography
                                    variant="h6"
                                    component="h2"
                                    gutterBottom
                                    sx={{ fontWeight: "bold" }}
                                >
                                    {product.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {product.description}
                                </Typography>
                                <Typography
                                    variant="h6"
                                    color="primary"
                                    sx={{ mt: 2, fontWeight: "bold" }}
                                >
                                    {product.price} ₽
                                </Typography>
                                <Chip
                                    label={product.stock > 0 ? `В наличии: ${product.stock}` : "Нет в наличии"}
                                    color={product.stock > 0 ? "success" : "error"}
                                    sx={{ mt: 1, borderRadius: 2 }}
                                />
                            </CardContent>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    p: 2,
                                    borderTop: "1px solid",
                                    borderColor: "divider",
                                }}
                            >
                                <IconButton
                                    onClick={(event) => {
                                        event.stopPropagation()
                                        toggleFavorite(product.id)
                                    }}
                                    color={product.favorite ? "error" : "default"}
                                    sx={{
                                        "&:hover": {
                                            backgroundColor: "rgba(255, 0, 0, 0.1)",
                                        },
                                    }}
                                >
                                    {product.favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                </IconButton>
                                {product.countInCart > 0 ? (
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <IconButton
                                            onClick={(event) => {
                                                event.stopPropagation()
                                                updateQuantity(product.id, product.countInCart - 1)
                                            }}
                                            disabled={product.countInCart === 0}
                                            sx={{
                                                backgroundColor: "primary.light",
                                                "&:hover": {
                                                    backgroundColor: "primary.main",
                                                    color: "white",
                                                },
                                            }}
                                        >
                                            <RemoveIcon />
                                        </IconButton>
                                        <Typography>{product.countInCart}</Typography>
                                        <IconButton
                                            onClick={(event) => {
                                                event.stopPropagation()
                                                updateQuantity(product.id, product.countInCart + 1)
                                            }}
                                            disabled={product.countInCart >= product.stock}
                                            sx={{
                                                backgroundColor: "primary.light",
                                                "&:hover": {
                                                    backgroundColor: "primary.main",
                                                    color: "white",
                                                },
                                            }}
                                        >
                                            <AddIcon />
                                        </IconButton>
                                    </Box>
                                ) : (
                                    <Button
                                        variant="contained"
                                        startIcon={<ShoppingCartIcon />}
                                        onClick={(event) => {
                                            event.stopPropagation()
                                            addToCart(product.id)
                                        }}
                                        disabled={product.stock === 0}
                                        sx={{
                                            borderRadius: 2,
                                            textTransform: "none",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        В корзину
                                    </Button>
                                )}
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default MainPage;