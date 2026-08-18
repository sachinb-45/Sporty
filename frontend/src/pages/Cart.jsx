import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, totalAmount } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div class="cart-wrapper">
      <h2 class="page-title" style={{ textAlign: "left", marginBottom: "24px" }}>
        Your Cart
      </h2>

      {cart.length === 0 ? (
        <div style={{ background: "white", padding: "40px", borderRadius: "18px", textAlign: "center" }}>
          <i class="fa-solid fa-cart-shopping" style={{ fontSize: "3rem", color: "#94a3b8", marginBottom: "16px" }}></i>
          <p style={{ fontSize: "1.2rem", color: "#64748b" }}>Your cart is currently empty.</p>
          <button
            class="btn-primary"
            style={{ marginTop: "20px" }}
            onClick={() => navigate("/collection")}
          >
            Explore Collections
          </button>
        </div>
      ) : (
        <>
          <div class="cart-list">
            {cart.map((item, index) => (
              <div key={item._id || index} class="cart-item">
                <img src={item.image} alt={item.name} class="cart-img" />
                <div class="cart-item-info">
                  <h3>{item.name}</h3>
                  <p>₹{item.price}</p>
                  <label style={{ fontSize: "0.85rem", marginRight: "8px", fontWeight: "600" }}>Qty:</label>
                  <input
                    type="number"
                    min="1"
                    class="qty-input"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(index, e.target.value)}
                  />
                </div>
                <button class="remove-btn" onClick={() => removeFromCart(index)}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div class="cart-summary">
            <div>
              <p style={{ color: "#64748b", fontWeight: "600" }}>Total Items: {cart.length}</p>
              <h3>Total: ₹{totalAmount}</h3>
            </div>
            <div class="cart-actions" style={{ marginTop: 0 }}>
              <button class="btn-secondary" onClick={clearCart}>
                Clear Cart
              </button>
              <button class="btn-primary" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
