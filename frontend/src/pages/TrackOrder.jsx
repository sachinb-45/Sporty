import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";

const statusList = ["Placed", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered"];

const statusDescriptions = {
  Placed: "Order placed successfully",
  Confirmed: "Seller confirmed your order",
  Packed: "Items packed securely",
  Shipped: "Package left warehouse",
  "Out for Delivery": "Delivery partner is on the way",
  Delivered: "Package delivered successfully",
};

export const TrackOrder = () => {
  const { id: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const orderId = paramId || searchParams.get("id");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) {
      setError("No Order ID provided.");
      setLoading(false);
      return;
    }

    fetchOrderDetails();

    // Socket.io real-time status update listener
    const socket = io("http://localhost:5000");
    socket.on("orderStatusUpdate", (data) => {
      if (data.orderId === orderId) {
        setOrder((prev) => (prev ? { ...prev, status: data.status } : prev));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/orders/${orderId}`);
      const data = res.data.order || res.data;
      setOrder(data);
    } catch (err) {
      console.error(err);
      setError("Order not found or error loading details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="track-wrapper" style={{ textAlign: "center", marginTop: "60px" }}>
        <p style={{ fontSize: "1.2rem", color: "#64748b" }}>Loading order tracking details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="track-wrapper" style={{ textAlign: "center", marginTop: "60px" }}>
        <div style={{ background: "white", padding: "40px", borderRadius: "20px" }}>
          <h2>Track Order</h2>
          <p style={{ color: "#ef4444", marginTop: "10px" }}>{error || "Order not found"}</p>
        </div>
      </div>
    );
  }

  if (order.status === "Cancelled") {
    return (
      <div className="track-wrapper">
        <div className="track-card" style={{ textAlign: "center", padding: "48px 36px" }}>
          <i className="fa-solid fa-circle-xmark" style={{ fontSize: "3.5rem", color: "#dc2626", marginBottom: "16px" }}></i>
          <h2 style={{ fontSize: "1.8rem", fontWeight: "700", color: "#dc2626", marginBottom: "10px" }}>Order Cancelled</h2>
          <p style={{ color: "#64748b", marginBottom: "6px" }}>Order ID: <strong>{order._id}</strong></p>
          <p style={{ color: "#64748b" }}>This order was cancelled and will not be processed.</p>
        </div>
      </div>
    );
  }

  const currentIndex = statusList.indexOf(order.status);
  const deliveryDate = new Date(order.createdAt);
  deliveryDate.setDate(deliveryDate.getDate() + 3);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Placed":
        return "fa-box";
      case "Confirmed":
        return "fa-circle-check";
      case "Packed":
        return "fa-box-open";
      case "Shipped":
        return "fa-truck-fast";
      case "Out for Delivery":
        return "fa-location-dot";
      case "Delivered":
        return "fa-house";
      default:
        return "fa-circle";
    }
  };

  return (
    <div class="track-wrapper">
      <div class="track-card">
        <div class="track-header">
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "700" }}>Track Order</h2>
            <p style={{ color: "#64748b", fontSize: "0.9rem" }}>Order ID: {order._id}</p>
          </div>
          <span
            class="status-badge"
            style={{
              background: order.status === "Delivered" ? "#16a34a" : "#2563eb",
            }}
          >
            {order.status === "Delivered" ? "Delivered" : "In Progress"}
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
          <div>
            <p style={{ fontSize: "0.85rem", color: "#64748b" }}>Customer</p>
            <strong style={{ fontSize: "1rem" }}>{order.customerName}</strong>
          </div>
          <div>
            <p style={{ fontSize: "0.85rem", color: "#64748b" }}>Email</p>
            <strong style={{ fontSize: "1rem" }}>{order.customerEmail}</strong>
          </div>
          <div>
            <p style={{ fontSize: "0.85rem", color: "#64748b" }}>Total Amount</p>
            <strong style={{ fontSize: "1.1rem", color: "#1d4661" }}>₹{order.totalAmount}</strong>
          </div>
          <div>
            <p style={{ fontSize: "0.85rem", color: "#64748b" }}>Estimated Delivery</p>
            <strong style={{ fontSize: "1rem", color: "#059669" }}>
              {deliveryDate.toDateString()}
            </strong>
          </div>
        </div>

        <div class="timeline">
          {statusList.map((status, index) => {
            let circleBg = "#e2e8f0";
            let iconClass = "fa-circle";

            if (index < currentIndex) {
              circleBg = "#16a34a"; // completed step
              iconClass = "fa-circle-check";
            } else if (index === currentIndex) {
              circleBg = "#2563eb"; // current step
              iconClass = getStatusIcon(status);
            }

            return (
              <div key={status} class="timeline-item">
                <div class="timeline-left">
                  <div class="timeline-circle" style={{ background: circleBg }}>
                    <i class={`fa-solid ${iconClass}`}></i>
                  </div>
                  {index !== statusList.length - 1 && <div class="timeline-line"></div>}
                </div>

                <div class="timeline-content">
                  <h3>{status}</h3>
                  <p>{statusDescriptions[status]}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
