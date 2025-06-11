import axios from 'axios';

// Function to get the token from localStorage
const getToken = () => {
    return localStorage.getItem('token'); // Assuming the token is stored in localStorage under the key 'token'
};

// 1. **Sign Up** - Register a new user
const signUp = async (userData) => {
    try {
        const response = await axios.post('https://spotdiff.ru/auto-part-xpert-api/users/security/sign-up', userData);
        return response.data;
    } catch (error) {
        console.error('Error signing up:', error);
        throw error;
    }
};

// 2. **Sign In** - User login
const signIn = async (credentials) => {
    try {
        const response = await axios.post('https://spotdiff.ru/auto-part-xpert-api/users/security/sign-in', credentials);
        return response.data;
    } catch (error) {
        console.error('Error signing in:', error);
        throw error;
    }
};

// 3. **Add to Cart** - Add product to cart
const productAddToCart = async (productId, quantity) => {
    const token = getToken();
    try {
        const response = await axios.post(
            `https://spotdiff.ru/auto-part-xpert-api/base/products/${productId}/cart?quantity=${quantity}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
    }
};

// 4. **Update Cart Quantity** - Update the quantity of a product in the cart
const updateCartQuantity = async (productId, quantity) => {
    const token = getToken();
    try {
        const response = await axios.put(
            `https://spotdiff.ru/auto-part-xpert-api/base/products/${productId}/cart?quantity=${quantity}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating cart quantity:', error);
        throw error;
    }
};

const updateFavorite = async (productId) => {
    const token = getToken();
    try {
        const response = await axios.post(
            `https://spotdiff.ru/auto-part-xpert-api/base/products/${productId}/favorite`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating cart quantity:', error);
        throw error;
    }
}

// 5. **Create Product Review** - Add a review for a product
const createProductReview = async (productId, rating, comment) => {
    const token = getToken();
    try {
        const response = await axios.post(
            `https://spotdiff.ru/auto-part-xpert-api/base/products/${productId}/review?rating=${rating}&comment=${comment}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error creating product review:', error);
        throw error;
    }
};

// 6. **Get All Products** - Get a list of all products
const getAllProducts = async () => {
    const token = getToken();
    try {
        const response = await axios.get('https://spotdiff.ru/auto-part-xpert-api/base/products', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error getting products:', error);
        throw error;
    }
};

// 7. **Get Product By ID** - Get product details by ID
const getProductById = async (productId) => {
    const token = getToken();
    try {
        const response = await axios.get(`https://spotdiff.ru/auto-part-xpert-api/base/products/${productId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error getting product by ID:', error);
        throw error;
    }
};

// 8. **Get All Orders** - Get a list of all orders
const getAllOrders = async () => {
    const token = getToken();
    try {
        const response = await axios.get('https://spotdiff.ru/auto-part-xpert-api/base/orders', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error getting all orders:', error);
        throw error;
    }
};

// 9. **Create Order** - Create a new order
const createOrder = async (address, phone) => {
    const token = getToken();
    try {
        const response = await axios.post(
            'https://spotdiff.ru/auto-part-xpert-api/base/orders',
            {},
            {
                params: {
                    address: address,
                    phone: phone,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

// 10. **Update Order Status** - Update the status of an order
const updateOrderStatus = async (orderId, status) => {
    const token = getToken();
    try {
        const response = await axios.patch(
            `https://spotdiff.ru/auto-part-xpert-api/base/orders/${orderId}`,
            {},
            {
                params: {
                    status: status,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
    }
};

// 11. **Get All Categories** - Get all product categories
const getAllCategories = async () => {
    const token = getToken();
    try {
        const response = await axios.get('https://spotdiff.ru/auto-part-xpert-api/base/categories', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error getting categories:', error);
        throw error;
    }
};

// 12. **Get All Carts** - Get all carts
const getAllCarts = async () => {
    const token = getToken();
    try {
        const response = await axios.get('https://spotdiff.ru/auto-part-xpert-api/base/carts', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error getting carts:', error);
        throw error;
    }
};

export {
    signUp,
    signIn,
    productAddToCart,
    updateCartQuantity,
    createProductReview,
    getAllProducts,
    getProductById,
    getAllOrders,
    createOrder,
    updateOrderStatus,
    getAllCategories,
    getAllCarts,
    updateFavorite
};
