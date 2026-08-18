import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ALL_STATUSES = ["Placed", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];

const STATUS_COLORS = {
  Placed:           { bg: "#f1f5f9", text: "#64748b" },
  Confirmed:        { bg: "#dbeafe", text: "#1d4ed8" },
  Packed:           { bg: "#fed7aa", text: "#c2410c" },
  Shipped:          { bg: "#ccfbf1", text: "#0f766e" },
  "Out for Delivery": { bg: "#e9d5ff", text: "#7c3aed" },
  Delivered:        { bg: "#dcfce7", text: "#15803d" },
  Cancelled:        { bg: "#fee2e2", text: "#dc2626" },
};

export const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/orders");
      const orderList = res.data.orders || res.data || [];
      setOrders(orderList);
    } catch (err) {
      showNotification("Failed to load orders. Is the backend running?", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, {
        status: newStatus,
      });
      if (res.data.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
        showNotification(`Order status updated to "${newStatus}" successfully.`, "success");
      } else {
        showNotification(res.data.message || "Update failed.", "error");
      }
    } catch (err) {
      showNotification(err.response?.data?.message || "Failed to update status.", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const showNotification = (msg, type) => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === "All" || order.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      order._id.toLowerCase().includes(q) ||
      order.customerName?.toLowerCase().includes(q) ||
      order.customerEmail?.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  // Stats
  const totalRevenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pendingCount = orders.filter((o) => !["Delivered", "Cancelled"].includes(o.status)).length;
  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;
  const cancelledCount = orders.filter((o) => o.status === "Cancelled").length;

  return (
    <div className="admin-wrapper">
      {/* Notification Toast */}
      {notification && (
        <div className={`admin-toast ${notification.type}`}>
          <i className={`fa-solid ${notification.type === "success" ? "fa-circle-check" : "fa-circle-exclamation"}`}></i>
          {notification.msg}
        </div>
      )}

      {/* Page Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">
            <i className="fa-solid fa-gauge" style={{ marginRight: "12px" }}></i>
            Admin Dashboard
          </h1>
          <p className="admin-subtitle">Manage and update all customer orders</p>
        </div>
        <button className="admin-refresh-btn" onClick={loadOrders}>
          <i className="fa-solid fa-rotate-right" style={{ marginRight: "6px" }}></i>
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats-grid">
        <div className="stat-card stat-blue">
          <div className="stat-icon"><i className="fa-solid fa-bag-shopping"></i></div>
          <div>
            <div className="stat-value">{orders.length}</div>
            <div className="stat-label">Total Orders</div>
          </div>
        </div>
        <div className="stat-card stat-amber">
          <div className="stat-icon"><i className="fa-solid fa-clock"></i></div>
          <div>
            <div className="stat-value">{pendingCount}</div>
            <div className="stat-label">Pending Orders</div>
          </div>
        </div>
        <div className="stat-card stat-green">
          <div className="stat-icon"><i className="fa-solid fa-circle-check"></i></div>
          <div>
            <div className="stat-value">{deliveredCount}</div>
            <div className="stat-label">Delivered</div>
          </div>
        </div>
        <div className="stat-card stat-red">
          <div className="stat-icon"><i className="fa-solid fa-ban"></i></div>
          <div>
            <div className="stat-value">{cancelledCount}</div>
            <div className="stat-label">Cancelled</div>
          </div>
        </div>
        <div className="stat-card stat-purple">
          <div className="stat-icon"><i className="fa-solid fa-indian-rupee-sign"></i></div>
          <div>
            <div className="stat-value">₹{totalRevenue.toLocaleString()}</div>
            <div className="stat-label">Total Revenue</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-filters">
        <div className="admin-search-box">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Search by name, email, or order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="admin-status-filters">
          {["All", ...ALL_STATUSES].map((s) => (
            <button
              key={s}
              className={`filter-chip ${filterStatus === s ? "active" : ""}`}
              onClick={() => setFilterStatus(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="admin-loading">
          <i className="fa-solid fa-spinner fa-spin"></i> Loading orders...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="admin-empty">
          <i className="fa-solid fa-inbox"></i>
          <p>No orders found matching your criteria.</p>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Date</th>
                <th>Current Status</th>
                <th>Update Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const statusStyle = STATUS_COLORS[order.status] || STATUS_COLORS["Placed"];
                const isExpanded = expandedOrderId === order._id;
                return (
                  <React.Fragment key={order._id}>
                    <tr className="admin-table-row">
                      <td>
                        <span className="order-id-cell">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <div className="customer-cell">
                          <div className="customer-avatar">
                            {order.customerName?.charAt(0).toUpperCase() || "?"}
                          </div>
                          <div>
                            <div className="customer-name">{order.customerName}</div>
                            <div className="customer-email">{order.customerEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="items-count">
                          {order.products?.length || 0} item{order.products?.length !== 1 ? "s" : ""}
                        </span>
                      </td>
                      <td>
                        <span className="amount-cell">₹{order.totalAmount}</span>
                      </td>
                      <td>
                        <span className="date-cell">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit", month: "short", year: "numeric"
                          })}
                        </span>
                      </td>
                      <td>
                        <span
                          className="admin-status-badge"
                          style={{ background: statusStyle.bg, color: statusStyle.text }}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <select
                          className="status-select"
                          value={order.status}
                          disabled={updatingId === order._id}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        >
                          {ALL_STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        {updatingId === order._id && (
                          <span className="updating-indicator">
                            <i className="fa-solid fa-spinner fa-spin"></i>
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="action-btns">
                          <button
                            className="action-btn expand-btn"
                            title="View Products"
                            onClick={() => setExpandedOrderId(isExpanded ? null : order._id)}
                          >
                            <i className={`fa-solid fa-chevron-${isExpanded ? "up" : "down"}`}></i>
                          </button>
                          <button
                            className="action-btn track-action-btn"
                            title="Track Order"
                            onClick={() => navigate(`/track-order/${order._id}`)}
                          >
                            <i className="fa-solid fa-location-dot"></i>
                          </button>
                          <button
                            className="action-btn invoice-action-btn"
                            title="Download Invoice"
                            onClick={() => window.open(`http://localhost:5000/api/orders/${order._id}/invoice`, "_blank")}
                          >
                            <i className="fa-solid fa-file-pdf"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="expanded-row">
                        <td colSpan={8}>
                          <div className="expanded-details">
                            <div className="expanded-section">
                              <h4><i className="fa-solid fa-box"></i> Products Ordered</h4>
                              <div className="expanded-products">
                                {order.products?.map((item, i) => {
                                  const product = item.productId;
                                  const name = typeof product === "object" ? product?.name : "Product";
                                  const imgSrc = typeof product === "object" ? product?.image : null;
                                  return (
                                    <div key={i} className="expanded-product-item">
                                      {imgSrc && (
                                        <img
                                          src={imgSrc.startsWith("http") ? imgSrc : `http://localhost:5000/${imgSrc}`}
                                          alt={name}
                                        />
                                      )}
                                      <div>
                                        <div className="ep-name">{name}</div>
                                        <div className="ep-detail">
                                          Qty: {item.quantity} × ₹{item.price} = <strong>₹{item.quantity * item.price}</strong>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                            <div className="expanded-section">
                              <h4><i className="fa-solid fa-truck"></i> Delivery Info</h4>
                              <p><strong>Phone:</strong> {order.customerPhone || "N/A"}</p>
                              <p><strong>Address:</strong> {order.shippingAddress || "N/A"}</p>
                              <p><strong>Payment:</strong> {order.paymentMethod || "COD"}</p>
                              <p><strong>Invoice No:</strong> {order.invoiceNumber || "N/A"}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
