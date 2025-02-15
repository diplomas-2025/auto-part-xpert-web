import React, { useEffect, useState } from "react";
import {
    Container,
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Divider,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getAllOrders, updateOrderStatus } from "../api/Api"; // Предположим, что есть метод updateOrderStatus

// Функция для перевода статуса на русский
const translateStatus = (status) => {
    switch (status) {
        case "CREATED":
            return "Создан";
        case "DELIVERED":
            return "Доставлен";
        case "CANCELLED":
            return "Отменен";
        case "SHIPPED":
            return "Отправлен";
        default:
            return status;
    }
};

const calculateTotalPrice = (order) => {
    return order.orderItems.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);
};

const OrderHistoryPage = () => {
    const isAdmin = useState(localStorage.getItem("is_admin"))
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        getAllOrders().then((data) => setOrders(data));
    }, []);

    // Обработчик изменения статуса заказа
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus); // Вызов API для обновления статуса
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );
        } catch (error) {
            console.error("Ошибка при изменении статуса заказа:", error);
        }
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
                История заказов
            </Typography>
            {orders.length === 0 ? (
                <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                    У вас пока нет заказов.
                </Typography>
            ) : (
                orders.map((order) => (
                    <Card key={order.id} sx={{ mb: 4, borderRadius: 3, boxShadow: 3 }}>
                        <CardContent>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                    Заказ №{order.id}
                                </Typography>
                                <Chip
                                    label={translateStatus(order.status)}
                                    color={
                                        order.status === "CREATED"
                                            ? "primary"
                                            : order.status === "DELIVERED"
                                                ? "success"
                                                : order.status === "CANCELLED"
                                                    ? "error"
                                                    : "default"
                                    }
                                />
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Дата заказа: {new Date(order.createdAt).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 2 }}>
                                Адрес доставки: {order.address}
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 1 }}>
                                Телефон: {order.phone}
                            </Typography>
                            <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
                                Общая стоимость: ${calculateTotalPrice(order).toFixed(2)}
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            {/* Кнопка изменения статуса (видна только администратору) */}
                            {isAdmin && (
                                <FormControl fullWidth sx={{ mt: 2, marginBottom: "30px" }}>
                                    <InputLabel>Изменить статус</InputLabel>
                                    <Select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        label="Изменить статус"
                                    >
                                        <MenuItem value="CREATED">Создан</MenuItem>
                                        <MenuItem value="SHIPPED">Отправлен</MenuItem>
                                        <MenuItem value="DELIVERED">Доставлен</MenuItem>
                                        <MenuItem value="CANCELLED">Отменен</MenuItem>
                                    </Select>
                                </FormControl>
                            )}
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                                        Товары в заказе
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {order.orderItems.map((item) => (
                                        <Box key={item.id} sx={{ mb: 2 }}>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                                <img
                                                    src={item.product.image}
                                                    alt={item.product.name}
                                                    style={{ width: 50, height: 50, borderRadius: 8 }}
                                                />
                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                                                        {item.product.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Количество: {item.quantity}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Цена: ${item.price.toFixed(2)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Divider sx={{ my: 2 }} />
                                        </Box>
                                    ))}
                                </AccordionDetails>
                            </Accordion>
                        </CardContent>
                    </Card>
                ))
            )}
        </Container>
    );
};

export default OrderHistoryPage;