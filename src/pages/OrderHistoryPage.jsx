import React, { useEffect, useState } from "react";
import {
    Container,
    Card,
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
    Skeleton,
    Stack,
    Avatar,
    Paper, CardContent
} from "@mui/material";
import {
    ExpandMore,
    LocalShipping,
    CheckCircle,
    Cancel,
    ShoppingBag,
    CalendarToday,
    Phone,
    LocationOn,
    MonetizationOn
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { getAllOrders, updateOrderStatus } from "../api/Api";

// Стилизованные компоненты
const OrderCard = styled(Card)(({ theme }) => ({
    borderRadius: '16px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
    transition: 'all 0.3s ease',
    marginBottom: theme.spacing(3),
    '&:hover': {
        boxShadow: '0 12px 28px rgba(0,0,0,0.1)',
        transform: 'translateY(-2px)'
    }
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
    fontWeight: 600,
    borderRadius: '12px',
    padding: theme.spacing(0.5),
    backgroundColor:
        status === 'DELIVERED' ? 'rgba(56, 142, 60, 0.1)' :
            status === 'SHIPPED' ? 'rgba(25, 118, 210, 0.1)' :
                status === 'CANCELLED' ? 'rgba(211, 47, 47, 0.1)' : 'rgba(158, 158, 158, 0.1)',
    color:
        status === 'DELIVERED' ? theme.palette.success.main :
            status === 'SHIPPED' ? theme.palette.primary.main :
                status === 'CANCELLED' ? theme.palette.error.main : theme.palette.text.secondary
}));

const OrderHistoryPage = () => {
    const isAdmin = localStorage.getItem("is_admin") === "true";
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllOrders()
            .then((data) => {
                setOrders(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const translateStatus = (status) => {
        const statusMap = {
            "CREATED": "Создан",
            "DELIVERED": "Доставлен",
            "CANCELLED": "Отменён",
            "SHIPPED": "Отправлен"
        };
        return statusMap[status] || status;
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case "DELIVERED": return <CheckCircle fontSize="small" />;
            case "SHIPPED": return <LocalShipping fontSize="small" />;
            case "CANCELLED": return <Cancel fontSize="small" />;
            default: return <ShoppingBag fontSize="small" />;
        }
    };

    const calculateTotalPrice = (order) => {
        return order.orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );
        } catch (error) {
            console.error("Ошибка при изменении статуса:", error);
        }
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 800, mb: 4 }}>
                    История заказов
                </Typography>
                {[...Array(3)].map((_, index) => (
                    <OrderCard key={index}>
                        <CardContent>
                            <Stack spacing={3}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Skeleton width="120px" height={32} />
                                    <Skeleton width="100px" height={32} />
                                </Box>
                                <Skeleton width="80%" height={24} />
                                <Skeleton width="60%" height={24} />
                                <Skeleton width="40%" height={32} />
                                {isAdmin && <Skeleton width="100%" height={56} />}
                                <Skeleton variant="rectangular" height={48} sx={{ borderRadius: 1 }} />
                            </Stack>
                        </CardContent>
                    </OrderCard>
                ))}
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{
                fontWeight: 800,
                mb: 4,
                display: 'flex',
                alignItems: 'center',
                gap: 2
            }}>
                <ShoppingBag sx={{ fontSize: '2rem' }} /> История заказов
            </Typography>

            {orders.length === 0 ? (
                <Paper elevation={0} sx={{
                    p: 4,
                    textAlign: 'center',
                    borderRadius: 3,
                    bgcolor: 'background.default'
                }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        У вас пока нет заказов
                    </Typography>
                    <Typography color="text.secondary">
                        Здесь будут отображаться все ваши предыдущие заказы
                    </Typography>
                </Paper>
            ) : (
                orders.map((order) => (
                    <OrderCard key={order.id}>
                        <CardContent>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mb: 3
                            }}>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    Заказ №{order.id}
                                </Typography>
                                <StatusChip
                                    status={order.status}
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {getStatusIcon(order.status)}
                                            {translateStatus(order.status)}
                                        </Box>
                                    }
                                />
                            </Box>

                            <Stack spacing={2} sx={{ mb: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <CalendarToday color="disabled" />
                                    <Typography>
                                        {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <LocationOn color="disabled" />
                                    <Typography>Адрес: {order.address}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Phone color="disabled" />
                                    <Typography>Телефон: {order.phone}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <MonetizationOn color="disabled" />
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                        Итого: {calculateTotalPrice(order).toLocaleString('ru-RU')} ₽
                                    </Typography>
                                </Box>
                            </Stack>

                            {isAdmin && (
                                <FormControl fullWidth sx={{ mb: 3 }}>
                                    <InputLabel>Изменить статус</InputLabel>
                                    <Select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        label="Изменить статус"
                                        sx={{ borderRadius: '12px' }}
                                    >
                                        <MenuItem value="CREATED">Создан</MenuItem>
                                        <MenuItem value="SHIPPED">Отправлен</MenuItem>
                                        <MenuItem value="DELIVERED">Доставлен</MenuItem>
                                        <MenuItem value="CANCELLED">Отменён</MenuItem>
                                    </Select>
                                </FormControl>
                            )}

                            <Accordion sx={{
                                boxShadow: 'none',
                                '&:before': { display: 'none' }
                            }}>
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                    <Typography sx={{ fontWeight: 600 }}>
                                        Состав заказа ({order.orderItems.length})
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Stack spacing={3}>
                                        {order.orderItems.map((item) => (
                                            <Box key={item.id}>
                                                <Box sx={{
                                                    display: 'flex',
                                                    gap: 3,
                                                    alignItems: 'center'
                                                }}>
                                                    <Avatar
                                                        src={item.product.image}
                                                        alt={item.product.name}
                                                        sx={{
                                                            width: 64,
                                                            height: 64,
                                                            borderRadius: '12px'
                                                        }}
                                                        variant="rounded"
                                                    />
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                            {item.product.name}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {item.quantity} × {item.price.toLocaleString('ru-RU')} ₽
                                                        </Typography>
                                                    </Box>
                                                    <Typography sx={{ fontWeight: 600 }}>
                                                        {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                                                    </Typography>
                                                </Box>
                                                <Divider sx={{ my: 2 }} />
                                            </Box>
                                        ))}
                                    </Stack>
                                </AccordionDetails>
                            </Accordion>
                        </CardContent>
                    </OrderCard>
                ))
            )}
        </Container>
    );
};

export default OrderHistoryPage;