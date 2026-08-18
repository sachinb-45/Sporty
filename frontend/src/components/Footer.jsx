import React from "react";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div>
          <h2>Sporty</h2>
          <p>© 2025 Sports Hub. All rights reserved. Bringing you the latest equipment & highlights.</p>
          <div className="footer-icon-container">
            <i className="fa-brands fa-instagram"></i>
            <i className="fa-brands fa-twitter"></i>
            <i className="fa-brands fa-facebook"></i>
          </div>
        </div>
      </div>
      <p style={{ textAlign: "center", marginTop: "20px", fontSize: "0.9rem", opacity: 0.8 }}>
        @Sporty.com
      </p>
    </footer>
  );
};
