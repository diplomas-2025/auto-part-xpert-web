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
    Divider,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import {createOrder, getAllCarts, updateCartQuantity} from "../api/Api";

const CartPage = () => {
    const [items, setItems] = useState([]);
    const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [errors, setErrors] = useState({ address: false, phone: false });

    useEffect(() => {
        getAllCarts().then(data => {
            setItems(data)
        })
    })

    const updateQuantity = (productId, quantity) => {
        updateCartQuantity(productId, quantity).then(r => {
            setItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === productId
                        ? { ...item, quantity: quantity}
                        : item
                )
            );
        })
    };

    // Удаление товара из корзины
    const removeItem = (itemId) => {
        updateCartQuantity(itemId, 0).then(r => {
            setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
        })
    };

    // Расчет общей стоимости
    const totalPrice = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    // Открытие диалога оформления заказа
    const handleCheckoutClick = () => {
        setIsCheckoutDialogOpen(true);
    };

    // Закрытие диалога оформления заказа
    const handleCheckoutClose = () => {
        setIsCheckoutDialogOpen(false);
        setAddress("");
        setPhone("");
        setErrors({ address: false, phone: false });
    };

    // Валидация и оформление заказа
    const handleCheckoutSubmit = () => {
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

        createOrder(address, phone).then(() => {
            setIsCheckoutDialogOpen(false);
            setItems([]);
        })
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
                Корзина
            </Typography>
            <Grid container spacing={4}>
                {/* Список товаров */}
                <Grid item xs={12} md={8}>
                    {items.length === 0 ? (
                        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                            Ваша корзина пуста.
                        </Typography>
                    ) : (
                        items.map((item) => (
                            <Card key={item.id} sx={{ mb: 2, borderRadius: 3, boxShadow: 3 }}>
                                <Box sx={{ display: "flex" }}>
                                    <CardMedia
                                        component="img"
                                        image={item.product.image}
                                        alt={item.product.name}
                                        sx={{ width: 150, height: 150, objectFit: "cover" }}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" component="h2" sx={{ fontWeight: "bold" }}>
                                            {item.product.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                            {item.product.description}
                                        </Typography>
                                        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                                            {item.product.price} ₽
                                        </Typography>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
                                            <IconButton
                                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                disabled={item.quantity === 1}
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
                                            <Typography>{item.quantity}</Typography>
                                            <IconButton
                                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                disabled={item.quantity >= item.product.stock}
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
                                    </CardContent>
                                    <Box sx={{ display: "flex", alignItems: "center", pr: 2 }}>
                                        <IconButton
                                            onClick={() => removeItem(item.product.id)}
                                            color="error"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </Card>
                        ))
                    )}
                </Grid>

                {/* Общая стоимость и оформление заказа */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: 3, boxShadow: 3, p: 2 }}>
                        <Typography variant="h6" component="h2" sx={{ fontWeight: "bold" }}>
                            Итого
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="body1">Товары:</Typography>
                            <Typography variant="body1">
                                {items.reduce((sum, item) => sum + item.quantity, 0)} шт.
                            </Typography>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                            <Typography variant="body1">Общая стоимость:</Typography>
                            <Typography variant="h6" color="primary" sx={{ fontWeight: "bold" }}>
                                {totalPrice.toFixed(2)} ₽
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            fullWidth
                            startIcon={<ShoppingCartCheckoutIcon />}
                            onClick={handleCheckoutClick}
                            disabled={items.length === 0}
                            sx={{ mt: 2, borderRadius: 2, textTransform: "none", fontWeight: "bold" }}
                        >
                            Оформить заказ
                        </Button>
                    </Card>
                </Grid>
            </Grid>

            {/* Диалог оформления заказа */}
            <Dialog open={isCheckoutDialogOpen} onClose={handleCheckoutClose}>
                <DialogTitle>Оформление заказа</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Адрес доставки"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        error={errors.address}
                        helperText={errors.address ? "Поле обязательно для заполнения" : ""}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Телефон"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        error={errors.phone}
                        helperText={errors.phone ? "Поле обязательно для заполнения" : ""}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCheckoutClose}>Отмена</Button>
                    <Button onClick={handleCheckoutSubmit} variant="contained">
                        Подтвердить
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default CartPage;