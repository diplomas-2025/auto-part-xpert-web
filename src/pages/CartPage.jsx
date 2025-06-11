import React, { useEffect, useState } from "react";
import {
    Container,
    Box,
    Typography,
    Button,
    Divider,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Paper,
    Stack,
    IconButton,
    Badge,
    Avatar,
    Chip,
    useMediaQuery,
    useTheme, Skeleton
} from "@mui/material";
import {
    Add,
    Remove,
    Delete,
    ShoppingCartCheckout,
    ArrowBack,
    LocalShipping,
    Phone,
    Home,
    Receipt
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { createOrder, getAllCarts, updateCartQuantity } from "../api/Api";

// Стилизованные компоненты
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

const CartPage = () => {
    const [items, setItems] = useState([]);
    const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [errors, setErrors] = useState({ address: false, phone: false });
    const [loading, setLoading] = useState(true);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const data = await getAllCarts();
                setItems(data);
            } catch (error) {
                console.error("Error fetching cart:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, []);

    const updateQuantity = async (productId, quantity) => {
        try {
            await updateCartQuantity(productId, quantity);
            setItems(prevItems =>
                prevItems.map(item =>
                    item.product.id === productId ? { ...item, quantity } : item
                )
            );
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    const removeItem = async (itemId) => {
        try {
            await updateCartQuantity(itemId, 0);
            setItems(prevItems => prevItems.filter(item => item.product.id !== itemId));
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    const totalPrice = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    const handleCheckoutClick = () => {
        setIsCheckoutDialogOpen(true);
    };

    const handleCheckoutClose = () => {
        setIsCheckoutDialogOpen(false);
        setAddress("");
        setPhone("");
        setErrors({ address: false, phone: false });
    };

    const handleCheckoutSubmit = async () => {
        let hasErrors = false;
        const newErrors = { address: false, phone: false };

        if (address.trim() === "") {
            newErrors.address = true;
            hasErrors = true;
        }

        if (phone.trim() === "") {
            newErrors.phone = true;
            hasErrors = true;
        }

        if (hasErrors) {
            setErrors(newErrors);
            return;
        }

        try {
            await createOrder(address, phone);
            setIsCheckoutDialogOpen(false);
            setItems([]);
        } catch (error) {
            console.error("Error creating order:", error);
        }
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 800, mb: 4 }}>
                    Корзина
                </Typography>
                <Stack spacing={3}>
                    {[...Array(3)].map((_, index) => (
                        <GlassCard key={index}>
                            <Stack direction="row" spacing={3} alignItems="center">
                                <Skeleton variant="rectangular" width={100} height={100} sx={{ borderRadius: 2 }} />
                                <Box sx={{ flex: 1 }}>
                                    <Skeleton width="60%" height={32} />
                                    <Skeleton width="40%" height={24} sx={{ mt: 1 }} />
                                    <Skeleton width="30%" height={32} sx={{ mt: 2 }} />
                                </Box>
                                <Skeleton width={40} height={40} />
                            </Stack>
                        </GlassCard>
                    ))}
                    <GlassCard>
                        <Skeleton width="100%" height={56} sx={{ borderRadius: 3 }} />
                    </GlassCard>
                </Stack>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <IconButton onClick={() => window.history.back()} sx={{ mr: 2 }}>
                    <ArrowBack />
                </IconButton>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
                    Моя корзина
                </Typography>
                <Chip
                    label={`${items.length} товаров`}
                    color="primary"
                    variant="outlined"
                    sx={{ ml: 2, fontWeight: 600 }}
                />
            </Box>

            {items.length === 0 ? (
                <Paper elevation={0} sx={{
                    p: 4,
                    textAlign: 'center',
                    borderRadius: 3,
                    bgcolor: 'background.default'
                }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Ваша корзина пуста
                    </Typography>
                    <Typography color="text.secondary">
                        Добавьте товары, чтобы продолжить покупки
                    </Typography>
                </Paper>
            ) : (
                <Stack spacing={3}>
                    {/* Список товаров */}
                    {items.map((item) => (
                        <GlassCard key={item.id}>
                            <Stack
                                direction={isMobile ? 'column' : 'row'}
                                spacing={3}
                                alignItems={isMobile ? 'flex-start' : 'center'}
                            >
                                <Avatar
                                    src={item.product.image}
                                    alt={item.product.name}
                                    variant="rounded"
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        borderRadius: 2
                                    }}
                                />
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                        {item.product.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        {item.product.description}
                                    </Typography>
                                    <Typography variant="h6" sx={{ mt: 2, fontWeight: 700 }}>
                                        {item.product.price.toLocaleString('ru-RU')} ₽
                                    </Typography>
                                </Box>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}>
                                    <IconButton
                                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                        disabled={item.quantity === 1}
                                        size="small"
                                        sx={{
                                            border: '1px solid',
                                            borderColor: 'divider'
                                        }}
                                    >
                                        <Remove />
                                    </IconButton>
                                    <Typography sx={{
                                        fontWeight: 600,
                                        minWidth: '24px',
                                        textAlign: 'center'
                                    }}>
                                        {item.quantity}
                                    </Typography>
                                    <IconButton
                                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                        disabled={item.quantity >= item.product.stock}
                                        size="small"
                                        sx={{
                                            border: '1px solid',
                                            borderColor: 'divider'
                                        }}
                                    >
                                        <Add />
                                    </IconButton>
                                </Box>
                                <IconButton
                                    onClick={() => removeItem(item.product.id)}
                                    color="error"
                                    size="small"
                                >
                                    <Delete />
                                </IconButton>
                            </Stack>
                        </GlassCard>
                    ))}

                    {/* Итоговая сумма */}
                    <GlassCard>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                            Детали заказа
                        </Typography>
                        <Stack spacing={2} sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography color="text.secondary">Товары:</Typography>
                                <Typography>
                                    {items.reduce((sum, item) => sum + item.quantity, 0)} шт.
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography color="text.secondary">Сумма:</Typography>
                                <Typography>
                                    {totalPrice.toLocaleString('ru-RU')} ₽
                                </Typography>
                            </Box>
                            <Divider sx={{ my: 1 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>Итого:</Typography>
                                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                                    {totalPrice.toLocaleString('ru-RU')} ₽
                                </Typography>
                            </Box>
                        </Stack>
                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            startIcon={<ShoppingCartCheckout />}
                            onClick={handleCheckoutClick}
                            sx={{
                                borderRadius: '12px',
                                py: 1.5,
                                fontWeight: 700,
                                fontSize: '1.1rem'
                            }}
                        >
                            Оформить заказ
                        </Button>
                    </GlassCard>
                </Stack>
            )}

            {/* Диалог оформления заказа */}
            <Dialog
                open={isCheckoutDialogOpen}
                onClose={handleCheckoutClose}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        width: isMobile ? '90%' : '500px'
                    }
                }}
            >
                <DialogTitle sx={{
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    <Receipt sx={{ color: 'primary.main' }} /> Оформление заказа
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Адрес доставки"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            error={errors.address}
                            helperText={errors.address ? "Поле обязательно для заполнения" : ""}
                            InputProps={{
                                startAdornment: (
                                    <Home color="action" sx={{ mr: 1 }} />
                                )
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Телефон"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            error={errors.phone}
                            helperText={errors.phone ? "Поле обязательно для заполнения" : ""}
                            InputProps={{
                                startAdornment: (
                                    <Phone color="action" sx={{ mr: 1 }} />
                                )
                            }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={handleCheckoutClose}
                        sx={{
                            borderRadius: '12px',
                            px: 3,
                            fontWeight: 600
                        }}
                    >
                        Отмена
                    </Button>
                    <Button
                        onClick={handleCheckoutSubmit}
                        variant="contained"
                        sx={{
                            borderRadius: '12px',
                            px: 3,
                            fontWeight: 600
                        }}
                    >
                        Подтвердить
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Mobile floating button */}
            {isMobile && items.length > 0 && (
                <FloatingActionButton
                    color="primary"
                    variant="contained"
                    onClick={handleCheckoutClick}
                >
                    <ShoppingCartCheckout />
                </FloatingActionButton>
            )}
        </Container>
    );
};

export default CartPage;