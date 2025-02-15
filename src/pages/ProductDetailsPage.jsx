import React, {useEffect, useState} from "react";
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
    Rating,
    TextField,
    Avatar,
    Divider,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import StarIcon from "@mui/icons-material/Star";
import {useParams} from "react-router-dom";
import {createProductReview, getProductById, productAddToCart, updateCartQuantity, updateFavorite} from "../api/Api";

// Пример данных о продукте и отзывах (замените на реальные данные из API)
const productData = {
    product: {
        id: 1,
        name: "",
        description: "",
        price: 0,
        stock: 1,
        image: "",
        countInCart: 0,
        favorite: false,
    },
    reviews: [],
};

const ProductDetailsPage = () => {
    const [product, setProduct] = useState(productData.product);
    const [reviews, setReviews] = useState(productData.reviews);
    const [newReview, setNewReview] = useState({ rating: 0, comment: "" });

    const { id } = useParams()
    const [userId, setUserId] = useState(0)

    useEffect(() => {
        setUserId(+ localStorage.getItem("userId"))
        getProductById(id).then(data => {
            setProduct(data.product)
            setReviews(data.reviews)
        })
    }, [id])

    // Добавление/удаление из избранного
    const toggleFavorite = () => {
        updateFavorite(id).then(() => {
            setProduct((prevProduct) => ({
                ...prevProduct,
                favorite: !prevProduct.favorite,
            }));
        })
    };

    // Добавление в корзину
    const addToCart = () => {
        productAddToCart(id, 1).then(r => {
            setProduct((prevProduct) => ({
                ...prevProduct,
                countInCart: prevProduct.countInCart + 1,
            }));
        })
    };

    const updateQuantity = (quantity) => {
        updateCartQuantity(id, quantity).then(r => {
            setProduct((prevProduct) => ({
                ...prevProduct,
                countInCart: quantity,
            }));
        })
    };

    // Обработка изменения рейтинга
    const handleRatingChange = (event, newValue) => {
        setNewReview((prevReview) => ({
            ...prevReview,
            rating: newValue,
        }));
    };

    // Обработка изменения комментария
    const handleCommentChange = (event) => {
        setNewReview((prevReview) => ({
            ...prevReview,
            comment: event.target.value,
        }));
    };

    // Отправка отзыва
    const submitReview = () => {
        if (newReview.rating === 0 || newReview.comment.trim() === "") {
            alert("Пожалуйста, поставьте оценку и напишите комментарий.");
            return;
        }

        createProductReview(id, newReview.rating, newReview.comment).then(data => {
            const review = {
                id: reviews.length + 1,
                user: {
                    id: 0,
                    username: localStorage.getItem("username")
                },
                rating: newReview.rating,
                comment: newReview.comment,
                createdAt: new Date().toISOString(),
            };

            setReviews((prevReviews) => [review, ...prevReviews]);
            setNewReview({ rating: 0, comment: "" });
        })
    };

    // Расчет среднего рейтинга
    const averageRating =
        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    return (
        <Container sx={{ mt: 4 }}>
            <Grid container spacing={4}>
                {/* Левая часть: изображение и управление */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                        <CardMedia
                            component="img"
                            image={'http://localhost:3000/' + product.image}
                            alt={product.name}
                            sx={{ height: 400, objectFit: "cover" }}
                        />
                        <CardContent>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
                                    {product.name}
                                </Typography>
                                <IconButton
                                    onClick={toggleFavorite}
                                    color={product.favorite ? "error" : "default"}
                                >
                                    {product.favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                </IconButton>
                            </Box>
                            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                                {product.description}
                            </Typography>
                            <Typography variant="h5" color="primary" sx={{ mt: 2, fontWeight: "bold" }}>
                                {product.price} ₽
                            </Typography>
                            <Chip
                                label={product.stock > 0 ? `В наличии: ${product.stock}` : "Нет в наличии"}
                                color={product.stock > 0 ? "success" : "error"}
                                sx={{ mt: 2, borderRadius: 2 }}
                            />
                            <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 2 }}>
                                {product.countInCart > 0 ? (
                                    <>
                                        <IconButton
                                            onClick={() => updateQuantity(product.countInCart - 1)}
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
                                            onClick={() => updateQuantity(product.countInCart + 1)}
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
                                    </>
                                ) : (
                                    <Button
                                        variant="contained"
                                        startIcon={<ShoppingCartIcon />}
                                        onClick={addToCart}
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
                        </CardContent>
                    </Card>
                </Grid>

                {/* Правая часть: отзывы и форма для отзыва */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ borderRadius: 3, boxShadow: 3, p: 2 }}>
                        <Typography variant="h5" component="h2" sx={{ fontWeight: "bold" }}>
                            Отзывы
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                            <Rating
                                value={averageRating}
                                precision={0.1}
                                readOnly
                                emptyIcon={<StarIcon sx={{ opacity: 0.5 }} />}
                            />
                            <Typography variant="body1" sx={{ ml: 1 }}>
                                ({reviews.length} отзывов)
                            </Typography>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        {/* Форма для отзыва */}
                        { !reviews.some(rev => rev.user.id === userId) && (
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    Оставить отзыв
                                </Typography>
                                <Rating
                                    value={newReview.rating}
                                    onChange={handleRatingChange}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                    placeholder="Напишите ваш отзыв..."
                                    value={newReview.comment}
                                    onChange={handleCommentChange}
                                    sx={{ mb: 2 }}
                                />
                                <Button
                                    variant="contained"
                                    onClick={submitReview}
                                    sx={{ borderRadius: 2, textTransform: "none", fontWeight: "bold" }}
                                >
                                    Отправить отзыв
                                </Button>
                            </Box>
                        )}
                        {/* Список отзывов */}
                        {reviews.map((review) => (
                            <Box key={review.id} sx={{ mb: 2 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Avatar sx={{ bgcolor: "primary.main" }}>
                                        {review.user.username[0]}
                                    </Avatar>
                                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                                        {review.user.username}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </Typography>
                                </Box>
                                <Rating value={review.rating} readOnly sx={{ mt: 1 }} />
                                <Typography variant="body1" sx={{ mt: 1 }}>
                                    {review.comment}
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                            </Box>
                        ))}
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ProductDetailsPage;