import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Button,
    IconButton,
    Chip,
    Rating,
    TextField,
    Avatar,
    Divider,
    Skeleton,
    Paper,
    Stack,
    useMediaQuery,
    useTheme
} from "@mui/material";
import {
    Favorite,
    ShoppingBag,
    Add,
    Remove,
    Star,
    ChatBubble,
    ArrowBack,
    Share
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import {
    createProductReview,
    getProductById, productAddToCart, updateCartQuantity, updateFavorite
} from "../api/Api";

// Glass morphism styled components
const GlassCard = styled(Paper)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(12px)',
    borderRadius: '24px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: theme.spacing(3),
    transition: 'all 0.3s ease',
    '&:hover': {
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)'
    }
}));

const FloatingActionButton = styled(Button)(({ theme }) => ({
    position: 'fixed',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
    borderRadius: '50%',
    width: '56px',
    height: '56px',
    minWidth: 'unset',
    padding: 0,
    boxShadow: theme.shadows[6],
    zIndex: 1000
}));

const ProductDetailsPage = () => {
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
    const [loading, setLoading] = useState(true);
    const [currentImage, setCurrentImage] = useState(0);
    const [expandedImage, setExpandedImage] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();

    const { id } = useParams();
    const [userId] = useState(+(localStorage.getItem("userId") || 0));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getProductById(id);
                setProduct(data.product);
                setReviews(data.reviews || []);
                // Simulate multiple images for demo
                if (data.product) {
                    setProduct({
                        ...data.product,
                        images: [
                            data.product.image,
                            data.product.image,
                            data.product.image // In real app these would be different images
                        ]
                    });
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const toggleFavorite = async () => {
        try {
            await updateFavorite(id);
            setProduct((prev) => ({
                ...prev,
                favorite: !prev.favorite,
            }));
        } catch (error) {
            console.error("Error updating favorite:", error);
        }
    };

    const addToCart = async () => {
        try {
            await productAddToCart(id, 1);
            setProduct((prev) => ({
                ...prev,
                countInCart: (prev.countInCart || 0) + 1,
            }));
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    const updateQuantity = async (quantity) => {
        try {
            await updateCartQuantity(id, quantity);
            setProduct((prev) => ({
                ...prev,
                countInCart: quantity,
            }));
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    const handleRatingChange = (event, newValue) => {
        setNewReview((prev) => ({
            ...prev,
            rating: newValue,
        }));
    };

    const handleCommentChange = (event) => {
        setNewReview((prev) => ({
            ...prev,
            comment: event.target.value,
        }));
    };

    const submitReview = async () => {
        if (newReview.rating === 0 || newReview.comment.trim() === "") {
            alert("Пожалуйста, поставьте оценку и напишите комментарий.");
            return;
        }

        try {
            await createProductReview(id, newReview.rating, newReview.comment);
            const review = {
                id: reviews.length + 1,
                user: {
                    id: userId,
                    username: localStorage.getItem("username") || "Аноним"
                },
                rating: newReview.rating,
                comment: newReview.comment,
                createdAt: new Date().toISOString(),
            };
            setReviews((prev) => [review, ...prev]);
            setNewReview({ rating: 0, comment: "" });
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    };


    if (loading || !product) {
        return (
            <Box sx={{ p: isMobile ? 2 : 4 }}>
                <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: 3, mb: 3 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Skeleton width="60%" height={40} />
                    <Skeleton width="20%" height={40} />
                </Box>
                <Skeleton width="100%" height={80} sx={{ my: 2 }} />
                <Skeleton width="40%" height={40} />
                <Skeleton width="100%" height={200} sx={{ mt: 3, borderRadius: 3 }} />
            </Box>
        );
    }

    return (
        <Box sx={{
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
            minHeight: '100vh',
            p: isMobile ? 2 : 4
        }}>
            {/* Product header */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
                position: 'relative',
                zIndex: 1
            }}>
                <Typography variant="h4" sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(90deg, #3f51b5 0%, #2196f3 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.5px'
                }}>
                    {product.name}
                </Typography>
                <Box>
                    <IconButton onClick={toggleFavorite}>
                        <Favorite sx={{
                            color: product.favorite ? '#ff4081' : 'rgba(0,0,0,0.23)',
                            fontSize: 28
                        }} />
                    </IconButton>
                </Box>
            </Box>

            {/* Main content */}
            <Box sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: 4
            }}>
                {/* Image gallery */}
                <Box sx={{
                    flex: 1,
                    position: 'relative',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    height: isMobile ? '60vh' : '70vh',
                    minHeight: isMobile ? '400px' : '600px',
                    bgcolor: 'background.paper',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
                }}>
                    <Box
                        component="img"
                        src={product.images[currentImage]}
                        alt={product.name}
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            cursor: 'zoom-in',
                            transition: 'transform 0.3s ease'
                        }}
                        onClick={() => setExpandedImage(true)}
                    />

                    {/* Image thumbnails */}
                    <Box sx={{
                        position: 'absolute',
                        bottom: 16,
                        left: 0,
                        right: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 1
                    }}>
                        {product.images.map((img, index) => (
                            <Box
                                key={index}
                                onClick={() => setCurrentImage(index)}
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    border: currentImage === index ? '2px solid #3f51b5' : '1px solid rgba(0,0,0,0.1)',
                                    opacity: currentImage === index ? 1 : 0.7,
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <Box
                                    component="img"
                                    src={img}
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* Product details */}
                <Box sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3
                }}>
                    <GlassCard>
                        <Typography variant="h5" sx={{
                            fontWeight: 700,
                            mb: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <Box sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '4px',
                                bgcolor: 'primary.main',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Star sx={{ color: 'white', fontSize: 16 }} />
                            </Box>
                            Подробная информация о продукте
                        </Typography>

                        <Typography variant="body1" sx={{
                            lineHeight: 1.8,
                            mb: 3,
                            color: 'text.secondary'
                        }}>
                            {product.description}
                        </Typography>

                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2
                        }}>
                            <Typography variant="h3" sx={{ fontWeight: 800 }}>
                                {product.price.toLocaleString()} ₽
                            </Typography>

                            <Chip
                                label={product.stock > 0 ? `${product.stock} на складе` : "Out of stock"}
                                color={product.stock > 0 ? "success" : "error"}
                                sx={{
                                    borderRadius: '12px',
                                    fontWeight: 600,
                                    px: 2
                                }}
                            />
                        </Box>

                        {product.countInCart > 0 ? (
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 2,
                                mt: 2
                            }}>
                                <IconButton
                                    onClick={() => updateQuantity(product.countInCart - 1)}
                                    disabled={product.countInCart === 0}
                                    sx={{
                                        bgcolor: 'primary.light',
                                        '&:hover': {
                                            bgcolor: 'primary.main',
                                            color: 'white'
                                        }
                                    }}
                                >
                                    <Remove />
                                </IconButton>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    {product.countInCart}
                                </Typography>
                                <IconButton
                                    onClick={() => updateQuantity(product.countInCart + 1)}
                                    disabled={product.countInCart >= product.stock}
                                    sx={{
                                        bgcolor: 'primary.light',
                                        '&:hover': {
                                            bgcolor: 'primary.main',
                                            color: 'white'
                                        }
                                    }}
                                >
                                    <Add />
                                </IconButton>
                            </Box>
                        ) : (
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<ShoppingBag />}
                                onClick={addToCart}
                                disabled={product.stock === 0}
                                sx={{
                                    width: '100%',
                                    borderRadius: '12px',
                                    py: 1.5,
                                    mt: 2,
                                    fontWeight: 700,
                                    fontSize: '1.1rem'
                                }}
                            >
                                Add to Bag
                            </Button>
                        )}
                    </GlassCard>

                    {/* Reviews section */}
                    <GlassCard>
                        <Typography variant="h5" sx={{
                            fontWeight: 700,
                            mb: 3,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <ChatBubble color="primary" /> Отзывы клиентов
                        </Typography>

                        {!reviews.some(rev => rev.user.id === userId) && (
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                    Share your thoughts
                                </Typography>
                                <Rating
                                    value={newReview.rating}
                                    onChange={handleRatingChange}
                                    size="large"
                                    sx={{ mb: 2 }}
                                    icon={<Star fontSize="inherit" color="primary" />}
                                    emptyIcon={<Star fontSize="inherit" />}
                                />
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                    placeholder="What do you think about this product?"
                                    value={newReview.comment}
                                    onChange={handleCommentChange}
                                    sx={{ mb: 2 }}
                                />
                                <Button
                                    variant="contained"
                                    onClick={submitReview}
                                    size="large"
                                    sx={{
                                        borderRadius: '12px',
                                        fontWeight: 600,
                                        px: 3
                                    }}
                                >
                                    Post Review
                                </Button>
                            </Box>
                        )}

                        {reviews.length > 0 ? (
                            <Stack spacing={3}>
                                {reviews.map((review) => (
                                    <Box key={review.id}>
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            mb: 1
                                        }}>
                                            <Avatar sx={{
                                                bgcolor: 'primary.main',
                                                width: 48,
                                                height: 48
                                            }}>
                                                {review.user.username[0].toUpperCase()}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle1" sx={{
                                                    fontWeight: 600
                                                }}>
                                                    {review.user.username}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                        month: 'long',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Rating
                                            value={review.rating}
                                            readOnly
                                            size="medium"
                                            sx={{ my: 1 }}
                                        />
                                        <Typography variant="body1" sx={{
                                            lineHeight: 1.6,
                                            whiteSpace: 'pre-line'
                                        }}>
                                            {review.comment}
                                        </Typography>
                                        <Divider sx={{ mt: 3 }} />
                                    </Box>
                                ))}
                            </Stack>
                        ) : (
                            <Box sx={{
                                textAlign: 'center',
                                py: 4,
                                color: 'text.secondary'
                            }}>
                                <ChatBubble sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
                                <Typography variant="h6">
                                    No reviews yet
                                </Typography>
                                <Typography>
                                    Be the first to share your thoughts!
                                </Typography>
                            </Box>
                        )}
                    </GlassCard>
                </Box>
            </Box>

            {/* Mobile floating cart button */}
            {isMobile && (
                <FloatingActionButton
                    color="primary"
                    variant="contained"
                    onClick={product.countInCart > 0 ? null : addToCart}
                    disabled={product.stock === 0}
                >
                    <ShoppingBag />
                </FloatingActionButton>
            )}
        </Box>
    );
};

export default ProductDetailsPage;