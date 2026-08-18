import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const CANCELLABLE_STATUSES = ["Placed", "Confirmed"];

export const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userId = user.id || user._id || "guest";
      const userEmail = user.email || "";
      const res = await axios.get(
        `http://localhost:5000/api/orders/user/${userId}?email=${encodeURIComponent(userEmail)}`
      );
      const orderList = res.data.orders || res.data || [];
      setOrders(orderList);
    } catch (err) {
      console.error("Unable to load user orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      setCancellingId(orderId);
      const res = await axios.put(`http://localhost:5000/api/orders/${orderId}/cancel`);
      if (res.data.success) {
        // Update order status locally without full reload
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: "Cancelled" } : order
          )
        );
      } else {
        alert(res.data.message || "Failed to cancel order.");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to cancel order. Please try again.";
      alert(msg);
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Confirmed":  return "status-badge confirmed";
      case "Packed":     return "status-badge packed";
      case "Shipped":    return "status-badge shipped";
      case "Out for Delivery": return "status-badge out";
      case "Delivered":  return "status-badge delivered";
      case "Cancelled":  return "status-badge cancelled";
      default:           return "status-badge placed";
    }
  };

  const downloadInvoice = (id) => {
    window.open(`http://localhost:5000/api/orders/${id}/invoice`, "_blank");
  };

  return (
    <div className="orders-container">
      <h2 className="page-title" style={{ marginBottom: "30px" }}>
        MY ORDERS
      </h2>

      {loading ? (
        <p style={{ textAlign: "center", fontSize: "1.2rem", color: "#64748b" }}>
          Loading orders...
        </p>
      ) : !user ? (
        <div style={{ background: "white", padding: "40px", borderRadius: "20px", textAlign: "center" }}>
          <i className="fa-solid fa-user-lock" style={{ fontSize: "3rem", color: "#94a3b8", marginBottom: "16px" }}></i>
          <p style={{ fontSize: "1.2rem", color: "#64748b", marginBottom: "20px" }}>
            Please log in to view your order history.
          </p>
          <Link to="/login" className="track-btn" style={{ textDecoration: "none", display: "inline-block" }}>
            LOG IN TO YOUR ACCOUNT
          </Link>
        </div>
      ) : orders.length === 0 ? (
        <div style={{ background: "white", padding: "40px", borderRadius: "20px", textAlign: "center" }}>
          <i className="fa-solid fa-box-open" style={{ fontSize: "3rem", color: "#94a3b8", marginBottom: "16px" }}></i>
          <p style={{ fontSize: "1.2rem", color: "#64748b" }}>No orders found for {user.name || user.email}.</p>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order._id} className="order-card">

              <div className="order-id">
                <strong>Order ID</strong>
                <br />
                {order._id}
              </div>

              <div className="order-info">
                <strong>Customer</strong>
                {order.customerName}
              </div>

              <div className="order-info">
                <strong>Email</strong>
                {order.customerEmail}
              </div>

              <div className="order-info">
                <strong>Total Amount</strong>
                ₹{order.totalAmount}
              </div>

              <div className="order-info">
                <strong>Ordered On</strong>
                {new Date(order.createdAt).toLocaleString()}
              </div>

              <span className={getStatusBadgeClass(order.status)}>
                {order.status || "Placed"}
              </span>

              {order.status !== "Cancelled" && (
                <button
                  className="track-btn"
                  onClick={() => navigate(`/track-order/${order._id}`)}
                >
                  <i className="fa-solid fa-location-dot" style={{ marginRight: "8px" }}></i>
                  TRACK ORDER
                </button>
              )}

              {order.status !== "Cancelled" && order.status !== "Delivered" && (
                <button
                  className="invoice-btn"
                  onClick={() => downloadInvoice(order._id)}
                >
                  📄 DOWNLOAD INVOICE
                </button>
              )}

              {CANCELLABLE_STATUSES.includes(order.status) && (
                <button
                  className="cancel-order-btn"
                  onClick={() => handleCancel(order._id)}
                  disabled={cancellingId === order._id}
                >
                  {cancellingId === order._id ? (
                    "Cancelling..."
                  ) : (
                    <>
                      <i className="fa-solid fa-ban" style={{ marginRight: "8px" }}></i>
                      CANCEL ORDER
                    </>
                  )}
                </button>
              )}

              {order.status === "Cancelled" && (
                <div className="cancelled-notice">
                  <i className="fa-solid fa-circle-xmark" style={{ marginRight: "6px" }}></i>
                  This order has been cancelled.
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
};
