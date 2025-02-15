import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import Header from "./pages/Header";
import CartPage from "./pages/CartPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";

function App() {
    return (
        <BrowserRouter>
            { localStorage.getItem("token") &&
                <Header/>
            }
            <Routes>
                { localStorage.getItem('token') ?
                    <>
                        <Route path="/" element={<MainPage/>}/>
                        <Route path="/products/:id" element={<ProductDetailsPage/>}/>
                        <Route path="/cart" element={<CartPage/>}/>
                        <Route path="/orders" element={<OrderHistoryPage/>}/>

                        <Route path="*" element={<Navigate to="/" />} />
                    </> :
                    <>
                        <Route path="/login" element={<AuthPage/>}/>
                        <Route path="/register" element={<RegisterPage/>}/>

                        <Route path="*" element={<Navigate to="/login" />} />
                    </>
                }
            </Routes>
        </BrowserRouter>
    );
}

export default App;
