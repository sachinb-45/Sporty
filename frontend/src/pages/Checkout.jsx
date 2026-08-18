import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export const Checkout = () => {
  const { cart, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState(user ? user.name : "");
  const [customerEmail, setCustomerEmail] = useState(user ? user.email : "");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [fieldErrors, setFieldErrors] = useState({});
  const [statusMsg, setStatusMsg] = useState({ text: "", type: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (cart.length === 0) {
      navigate("/cart");
    }
  }, [cart, navigate]);

  const validateForm = () => {
    const errs = {};

    if (!customerName || !customerName.trim()) {
      errs.customerName = "Full Name is required.";
    }

    if (!customerEmail || !customerEmail.trim()) {
      errs.customerEmail = "Email Address is required.";
    } else if (!/\S+@\S+\.\S+/.test(customerEmail)) {
      errs.customerEmail = "Please enter a valid email address.";
    }

    if (!customerPhone || !customerPhone.trim()) {
      errs.customerPhone = "Phone Number is required.";
    } else if (customerPhone.trim().length < 7) {
      errs.customerPhone = "Please enter a valid phone number.";
    }

    if (!address || !address.trim()) {
      errs.address = "Delivery Address is required.";
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg({ text: "", type: "" });

    // Client-side field validation
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    const products = cart.map((item) => ({
      productId: item._id,
      quantity: item.quantity,
      price: item.price,
    }));

    const orderPayload = {
      userId: user?.id || user?._id || null,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress: address,
      address,
      paymentMethod,
      products,
      totalAmount,
    };

    try {
      const res = await axios.post("http://localhost:5000/api/orders", orderPayload);

      if (res.data.success) {
        setStatusMsg({ text: "✅ Order Placed Successfully! Redirecting to orders...", type: "success" });
        clearCart();
        setTimeout(() => {
          navigate("/my-orders");
        }, 1800);
      } else {
        setStatusMsg({ text: res.data.message || "Failed to place order.", type: "error" });
      }
    } catch (err) {
      console.error("Order error:", err);

      const serverData = err.response?.data;
      if (serverData?.errors) {
        // Map backend errors (e.g. shippingAddress -> address) to corresponding field inputs
        const backendErrs = { ...serverData.errors };
        if (backendErrs.shippingAddress && !backendErrs.address) {
          backendErrs.address = backendErrs.shippingAddress;
        }
        setFieldErrors(backendErrs);
      } else if (typeof serverData?.message === "string") {
        const msgStr = serverData.message;
        const mapped = {};
        if (msgStr.includes("shippingAddress") || msgStr.includes("address")) {
          mapped.address = "Delivery Address is required.";
        }
        if (msgStr.includes("customerPhone")) {
          mapped.customerPhone = "Phone Number is required.";
        }
        if (msgStr.includes("customerName")) {
          mapped.customerName = "Full Name is required.";
        }
        if (msgStr.includes("customerEmail")) {
          mapped.customerEmail = "Email Address is required.";
        }
        setFieldErrors(mapped);
      } else {
        setStatusMsg({
          text: "Server error while placing order. Please try again.",
          type: "error",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const clearFieldError = (fieldName) => {
    if (fieldErrors[fieldName]) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[fieldName];
        return copy;
      });
    }
  };

  return (
    <div class="checkout-wrapper">
      <h1 class="page-title" style={{ marginBottom: "30px" }}>
        Checkout
      </h1>

      <div class="order-summary-container">
        <h2 class="summary-title">Order Summary</h2>
        {cart.map((item, i) => (
          <div key={i} class="summary-item">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
        <div class="summary-total">Total: ₹{totalAmount}</div>
      </div>

      <form class="checkout-form" onSubmit={handleSubmit} noValidate>
        <h2 style={{ fontSize: "1.3rem", fontWeight: "700" }}>Delivery Information</h2>

        {/* Full Name */}
        <div class="form-field-group">
          <input
            type="text"
            placeholder="Full Name"
            value={customerName}
            class={fieldErrors.customerName ? "input-error" : ""}
            onChange={(e) => {
              setCustomerName(e.target.value);
              clearFieldError("customerName");
            }}
          />
          {fieldErrors.customerName && (
            <span class="field-error-text">
              <i class="fa-solid fa-circle-exclamation"></i> {fieldErrors.customerName}
            </span>
          )}
        </div>

        {/* Email Address */}
        <div class="form-field-group">
          <input
            type="email"
            placeholder="Email Address"
            value={customerEmail}
            class={fieldErrors.customerEmail ? "input-error" : ""}
            onChange={(e) => {
              setCustomerEmail(e.target.value);
              clearFieldError("customerEmail");
            }}
          />
          {fieldErrors.customerEmail && (
            <span class="field-error-text">
              <i class="fa-solid fa-circle-exclamation"></i> {fieldErrors.customerEmail}
            </span>
          )}
        </div>

        {/* Phone Number */}
        <div class="form-field-group">
          <input
            type="tel"
            placeholder="Phone Number"
            value={customerPhone}
            class={fieldErrors.customerPhone ? "input-error" : ""}
            onChange={(e) => {
              setCustomerPhone(e.target.value);
              clearFieldError("customerPhone");
            }}
          />
          {fieldErrors.customerPhone && (
            <span class="field-error-text">
              <i class="fa-solid fa-circle-exclamation"></i> {fieldErrors.customerPhone}
            </span>
          )}
        </div>

        {/* Delivery Address */}
        <div class="form-field-group">
          <textarea
            placeholder="Delivery Address"
            rows={3}
            value={address}
            class={fieldErrors.address || fieldErrors.shippingAddress ? "input-error" : ""}
            onChange={(e) => {
              setAddress(e.target.value);
              clearFieldError("address");
              clearFieldError("shippingAddress");
            }}
          />
          {(fieldErrors.address || fieldErrors.shippingAddress) && (
            <span class="field-error-text">
              <i class="fa-solid fa-circle-exclamation"></i> {fieldErrors.address || fieldErrors.shippingAddress}
            </span>
          )}
        </div>

        {/* Payment Method */}
        <div class="form-field-group">
          <label style={{ fontWeight: "600" }}>Payment Method</label>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <option value="COD">Cash on Delivery</option>
            <option value="Online">Online Payment</option>
          </select>
        </div>

        <button type="submit" class="place-order-btn" disabled={submitting}>
          {submitting ? "Placing Order..." : "Place Your Order"}
        </button>

        {statusMsg.text && (
          <p
            style={{
              textAlign: "center",
              marginTop: "16px",
              fontWeight: "600",
              color: statusMsg.type === "success" ? "#16a34a" : "#dc2626",
            }}
          >
            {statusMsg.text}
          </p>
        )}
      </form>
    </div>
  );
};
