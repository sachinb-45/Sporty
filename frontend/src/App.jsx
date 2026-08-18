import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

import { Home } from "./pages/Home";
import { Products } from "./pages/Products";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { MyOrders } from "./pages/MyOrders";
import { TrackOrder } from "./pages/TrackOrder";
import { Login } from "./pages/Login";
import { Contact } from "./pages/Contact";
import { AdminDashboard } from "./pages/AdminDashboard";

export function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div class="app-container">
            <Navbar />
            <main class="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/collection" element={<Products />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/my-orders" element={<MyOrders />} />
                <Route path="/track-order/:id?" element={<TrackOrder />} />
                <Route path="/login" element={<Login />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
