import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-top">
        <Link to="/" className="navbar-brand">
          Sporty
        </Link>

        <div className="navbar-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            Home
          </NavLink>
          <NavLink to="/collection" className={({ isActive }) => (isActive ? "active" : "")}>
            Products
          </NavLink>
          <NavLink to="/cart" className={({ isActive }) => (isActive ? "active" : "")}>
            Cart <span className="cart-badge">{cartCount}</span>
          </NavLink>
          <NavLink to="/my-orders" className={({ isActive }) => (isActive ? "active" : "")}>
            My Orders
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? "active" : "")}>
            Contact
          </NavLink>
          <NavLink to="/admin" className={({ isActive }) => (isActive ? "active admin-nav-link" : "admin-nav-link")}>
            <i className="fa-solid fa-gauge" style={{ marginRight: "5px" }}></i> Admin
          </NavLink>
          {!user && (
            <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}>
              Login
            </NavLink>
          )}
        </div>

        <div className="navbar-menu-toggle" onClick={() => setMobileMenuOpen(true)}>
          <i className="fa-solid fa-bars"></i>
        </div>
      </div>

      {user && (
        <div className="navbar-user-row">
          <div className="user-avatar">{user.name ? user.name.charAt(0).toUpperCase() : "U"}</div>
          <span>{user.name}</span>
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </button>
        </div>
      )}

      {/* Mobile Drawer */}
      <div
        className={`side-navbar-overlay ${mobileMenuOpen ? "active" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div className="side-navbar" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={() => setMobileMenuOpen(false)}>
            <i className="fa-solid fa-xmark"></i>
          </button>
          <div className="side-navbar-links">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link to="/collection" onClick={() => setMobileMenuOpen(false)}>
              Products
            </Link>
            <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>
              Cart ({cartCount})
            </Link>
            <Link to="/my-orders" onClick={() => setMobileMenuOpen(false)}>
              My Orders
            </Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
              Contact
            </Link>
            <Link to="/admin" className="admin-mobile-link" onClick={() => setMobileMenuOpen(false)}>
              <i className="fa-solid fa-gauge" style={{ marginRight: "6px" }}></i> Admin
            </Link>
            {!user ? (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                Login
              </Link>
            ) : (
              <button className="logout-btn" onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
