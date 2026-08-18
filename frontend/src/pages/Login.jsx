import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = "Email Address is required.";
    }
    if (!password) {
      errs.password = "Password is required.";
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage({ text: "", type: "" });

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const response = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });

      setStatusMessage({ text: "Login Successful ✔", type: "success" });
      login(response.data.user);

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || "Invalid credentials.";
      if (errMsg.toLowerCase().includes("user") || errMsg.toLowerCase().includes("email")) {
        setFieldErrors({ email: errMsg });
      } else if (errMsg.toLowerCase().includes("password")) {
        setFieldErrors({ password: errMsg });
      } else {
        setStatusMessage({ text: errMsg, type: "error" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div class="login-container">
      <form class="login-box" onSubmit={handleSubmit} noValidate>
        <h2>Login</h2>

        <div class="form-field-group">
          <div class={`input-group ${fieldErrors.email ? "input-error" : ""}`}>
            <i class="fa-solid fa-envelope"></i>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: "" });
              }}
            />
          </div>
          {fieldErrors.email && (
            <span class="field-error-text">
              <i class="fa-solid fa-circle-exclamation"></i> {fieldErrors.email}
            </span>
          )}
        </div>

        <div class="form-field-group">
          <div class={`input-group ${fieldErrors.password ? "input-error" : ""}`}>
            <i class="fa-solid fa-lock"></i>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: "" });
              }}
            />
          </div>
          {fieldErrors.password && (
            <span class="field-error-text">
              <i class="fa-solid fa-circle-exclamation"></i> {fieldErrors.password}
            </span>
          )}
        </div>

        <button type="submit" class="login-btn" disabled={submitting}>
          {submitting ? "Logging in..." : "Login"}
        </button>

        {statusMessage.text && (
          <p
            style={{
              marginTop: "16px",
              fontWeight: "600",
              color: statusMessage.type === "success" ? "#16a34a" : "#dc2626",
            }}
          >
            {statusMessage.text}
          </p>
        )}

        <p class="login-footer" style={{ marginTop: "20px" }}>
          Don’t have an account? <Link to="/contact" style={{ color: "#2563eb", fontWeight: "600" }}>Sign Up</Link>
        </p>
      </form>
    </div>
  );
};
