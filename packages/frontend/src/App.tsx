import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from './stores/auth';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';

// Shop pages
import HomePage from './pages/shop/HomePage';
import BooksPage from './pages/shop/BooksPage';
import BookDetailPage from './pages/shop/BookDetailPage';
import CategoryPage from './pages/shop/CategoryPage';
import CartPage from './pages/shop/CartPage';
import CheckoutPage from './pages/shop/CheckoutPage';
import WishlistPage from './pages/shop/WishlistPage';
import OrdersPage from './pages/shop/OrdersPage';
import OrderDetailPage from './pages/shop/OrderDetailPage';
import ProfilePage from './pages/shop/ProfilePage';
import LoginPage from './pages/shop/LoginPage';
import RegisterPage from './pages/shop/RegisterPage';

// Admin pages
import Dashboard from './pages/admin/Dashboard';
import Books from './pages/admin/Books';
import Categories from './pages/admin/Categories';
import Orders from './pages/admin/Orders';
import Users from './pages/admin/Users';
import Reviews from './pages/admin/Reviews';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const GuestRoute = () => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

const AdminRoute = () => {
  const { isAuthenticated, isAdmin } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
};

function App() {
  return (
    <Routes>
      {/* Shop routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/books/:slug" element={<BookDetailPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/cart" element={<CartPage />} />

        {/* Protected shop routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Auth routes */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Admin routes */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/books" element={<Books />} />
          <Route path="/admin/categories" element={<Categories />} />
          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/reviews" element={<Reviews />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
