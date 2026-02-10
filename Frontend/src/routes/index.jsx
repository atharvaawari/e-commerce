import { BrowserRouter, Route, Routes } from "react-router";
import Register from "../page/auth/Register.jsx";
import Home from "../page/dashboard/Home.jsx";
import AuthRoute from "./auth.route.jsx";
import ProtectedRoute from "./protected.route.jsx";
import BaseLayout from "../layout/base.layout.jsx";
import Login from "../page/auth/Login.jsx";
import AdminDashboard from "../page/admin/Dashboard.jsx";
import AdminRoute from "./admin.route.jsx";
import ProductDetails from "../page/dashboard/ProductDetails.jsx";
import Cart from "../page/dashboard/Cart.jsx";
import Wishlist from "../page/dashboard/Wishlist.jsx";
import Checkout from "../page/dashboard/Checkout.jsx";
import Contact from "../page/contact/Contact.jsx";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        //public routes
        <Route element={<AuthRoute />}>
          <Route element={<BaseLayout />}>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Route>
        </Route>

        {/* ADMIN ROUTES */}
        <Route element={<AdminRoute />}>
          <Route element={<BaseLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>
        </Route>

        {/* 2. PROTECTED ROUTES */}
        {/* If user is NOT logged in, these redirect to "/login" */}
        <Route path="/" element={<ProtectedRoute />}>
          <Route element={<BaseLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
