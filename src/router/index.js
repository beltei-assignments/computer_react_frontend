import { Routes, Route } from "react-router-dom";
import { ProtectedRoutes } from "./guards.js";

// Authentication
import LoginPage from "../common/auth/LoginPage.js";
import RegisterPage from "../common/auth/RegisterPage.js";
import ForgotPasswordPage from "../common/auth/ForgotPasswordPage.js";
import ResetPasswordPage from "../common/auth/ResetPasswordPage.js";
import SettingPage from "../common/auth/SettingPage.js";

// Admin
import AdminHomePage from "../pages/admin/AdminHomePage.js";
import AdminProductPage from "../pages/admin/product/AdminProductPage.js";
import ProductEditPage from "../pages/admin/product/ProductEditPage.js";
import AdminCategoryPage from "../pages/admin/category/AdminCategoryPage.js";
import CategoryEditPage from "../pages/admin/category/CategoryEditPage.js";

// User
import HomePage from "../pages/home/HomePage.js";
import ProductPage from "../pages/home/ProductPage.js";
import CartPage from "../pages/home/CartPage.js";
import CheckoutPage from "../pages/home/CheckoutPage.js";
import OrderPage from "../pages/home/OrderPage.js";
import NotificationPage from "../pages/home/NotificationPage.js";
import FavouritePage from "../pages/home/FavouritePage.js";

export default function InitRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<RegisterPage />} />
      <Route path="/auth/reset_password" element={<ResetPasswordPage />} />
      <Route path="/forgot_password" element={<ForgotPasswordPage />} />
      <Route
        path="/setting"
        element={
          <ProtectedRoutes>
            <SettingPage />
          </ProtectedRoutes>
        }
      />

      {/* USER ---------------------- */}
      <Route
        path="/"
        element={
          <ProtectedRoutes>
            <HomePage />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/item/:id"
        element={
          <ProtectedRoutes>
            <ProductPage />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedRoutes>
            <CartPage />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoutes>
            <CheckoutPage />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/order"
        element={
          <ProtectedRoutes>
            <OrderPage />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/notification"
        element={
          <ProtectedRoutes>
            <NotificationPage />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/favourite"
        element={
          <ProtectedRoutes>
            <FavouritePage />
          </ProtectedRoutes>
        }
      />

      {/* ADMIN ---------------------- */}
      <Route
        path="/admin"
        element={
          <ProtectedRoutes>
            <AdminHomePage />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/admin/product"
        element={
          <ProtectedRoutes>
            <AdminProductPage />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/admin/product/:id"
        element={
          <ProtectedRoutes>
            <ProductEditPage />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/admin/category"
        element={
          <ProtectedRoutes>
            <AdminCategoryPage />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/admin/category/create"
        element={
          <ProtectedRoutes>
            <CategoryEditPage />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/admin/category/:id"
        element={
          <ProtectedRoutes>
            <CategoryEditPage />
          </ProtectedRoutes>
        }
      />
    </Routes>
  );
}
