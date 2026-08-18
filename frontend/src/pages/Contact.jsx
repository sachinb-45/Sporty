import React, { useState } from "react";
import axios from "axios";

export const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const errs = {};
    if (!name.trim()) errs.name = "Full Name is required.";
    if (!email.trim()) {
      errs.email = "Email Address is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = "Please enter a valid email address.";
    }
    if (!password) errs.password = "Password is required.";
    if (!confirmPassword) {
      errs.confirmPassword = "Confirm Password is required.";
    } else if (password !== confirmPassword) {
      errs.confirmPassword = "Passwords do not match!";
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setStatusMessage({ text: "", type: "" });

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      await axios.post("http://localhost:5000/api/users/register", {
        name,
        email,
        password,
      });

      setStatusMessage({ text: "Registration successful! ✔ You can now log in.", type: "success" });
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setFieldErrors({});
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || "Registration failed.";
      if (errMsg.toLowerCase().includes("email") || errMsg.toLowerCase().includes("exist")) {
        setFieldErrors({ email: errMsg });
      } else {
        setStatusMessage({ text: errMsg, type: "error" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div class="contact-registration">
      <div class="contact-box">
        <h2 style={{ fontSize: "2rem", marginBottom: "16px" }}>Contact Us</h2>
        <p style={{ margin: "10px 0" }}>
          <i class="fa-solid fa-envelope" style={{ marginRight: "10px" }}></i>
          Email: support@sporty.com
        </p>
        <p style={{ margin: "10px 0" }}>
          <i class="fa-solid fa-phone" style={{ marginRight: "10px" }}></i>
          Phone: +91 98765 43210
        </p>
        <p style={{ margin: "10px 0" }}>
          <i class="fa-solid fa-location-dot" style={{ marginRight: "10px" }}></i>
          Address: 123, Sports Street, Chennai, India
        </p>
      </div>

      <div class="registration-box">
        <h2 style={{ fontSize: "2rem" }}>User Registration</h2>

        <form onSubmit={handleRegister} noValidate>
          <div class="form-field-group">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              class={fieldErrors.name ? "input-error" : ""}
              onChange={(e) => {
                setName(e.target.value);
                if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: "" });
              }}
            />
            {fieldErrors.name && (
              <span class="field-error-text" style={{ color: "#f87171" }}>
                <i class="fa-solid fa-circle-exclamation"></i> {fieldErrors.name}
              </span>
            )}
          </div>

          <div class="form-field-group">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              class={fieldErrors.email ? "input-error" : ""}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: "" });
              }}
            />
            {fieldErrors.email && (
              <span class="field-error-text" style={{ color: "#f87171" }}>
                <i class="fa-solid fa-circle-exclamation"></i> {fieldErrors.email}
              </span>
            )}
          </div>

          <div class="form-field-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              class={fieldErrors.password ? "input-error" : ""}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: "" });
              }}
            />
            {fieldErrors.password && (
              <span class="field-error-text" style={{ color: "#f87171" }}>
                <i class="fa-solid fa-circle-exclamation"></i> {fieldErrors.password}
              </span>
            )}
          </div>

          <div class="form-field-group">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              class={fieldErrors.confirmPassword ? "input-error" : ""}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (fieldErrors.confirmPassword) setFieldErrors({ ...fieldErrors, confirmPassword: "" });
              }}
            />
            {fieldErrors.confirmPassword && (
              <span class="field-error-text" style={{ color: "#f87171" }}>
                <i class="fa-solid fa-circle-exclamation"></i> {fieldErrors.confirmPassword}
              </span>
            )}
          </div>

          <button type="submit" disabled={submitting}>
            {submitting ? "Registering..." : "Register"}
          </button>

          {statusMessage.text && (
            <p
              style={{
                marginTop: "14px",
                fontWeight: "600",
                color: statusMessage.type === "success" ? "#4ade80" : "#f87171",
              }}
            >
              {statusMessage.text}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
