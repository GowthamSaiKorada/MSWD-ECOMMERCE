// frontend/src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Dashboard from "./pages/Admin/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Orders from "./pages/Orders";
import AdminProductList from "./pages/Admin/AdminProductList";
import AdminProductForm from "./pages/Admin/AdminProductForm";
import AdminProductEdit from "./pages/Admin/AdminProductEdit";

export default function App() {
  return (
    <>
      <Navbar />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin','manager']}><Dashboard/></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders/></ProtectedRoute>} />

          <Route path="/admin/products" element={<ProtectedRoute roles={['admin','manager']}><AdminProductList/></ProtectedRoute>} />
          <Route path="/admin/products/new" element={<ProtectedRoute roles={['admin','manager']}><AdminProductForm/></ProtectedRoute>} />
          <Route path="/admin/products/:id/edit" element={<ProtectedRoute roles={['admin','manager']}><AdminProductEdit/></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}
