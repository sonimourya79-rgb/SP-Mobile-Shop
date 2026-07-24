import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Secondhand from './pages/Secondhand';
import SecondhandDetail from './pages/SecondhandDetail';
import Repair from './pages/Repair';
import SellPhone from './pages/SellPhone';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

import MyOrders from './pages/account/MyOrders';
import MyRepairs from './pages/account/MyRepairs';
import MySellRequests from './pages/account/MySellRequests';
import Profile from './pages/account/Profile';

import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import CustomersAdmin from './admin/CustomersAdmin';
import ProductsAdmin from './admin/ProductsAdmin';
import SecondhandAdmin from './admin/SecondhandAdmin';
import RepairsAdmin from './admin/RepairsAdmin';
import SellRequestsAdmin from './admin/SellRequestsAdmin';
import OrdersAdmin from './admin/OrdersAdmin';
import ContactMessagesAdmin from './admin/ContactMessagesAdmin';
import SendOfferAdmin from './admin/SendOfferAdmin';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-center" toastOptions={{ duration: 2500 }} />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/secondhand" element={<Secondhand />} />
              <Route path="/secondhand/:id" element={<SecondhandDetail />} />
              <Route path="/repair" element={<Repair />} />
              <Route path="/sell-phone" element={<SellPhone />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account/orders"
                element={
                  <ProtectedRoute>
                    <MyOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account/repairs"
                element={
                  <ProtectedRoute>
                    <MyRepairs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account/sell-requests"
                element={
                  <ProtectedRoute>
                    <MySellRequests />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Route>

            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="customers" element={<CustomersAdmin />} />
              <Route path="products" element={<ProductsAdmin />} />
              <Route path="secondhand" element={<SecondhandAdmin />} />
              <Route path="repairs" element={<RepairsAdmin />} />
              <Route path="sell-requests" element={<SellRequestsAdmin />} />
              <Route path="orders" element={<OrdersAdmin />} />
              <Route path="messages" element={<ContactMessagesAdmin />} />
              <Route path="send-offer" element={<SendOfferAdmin />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
