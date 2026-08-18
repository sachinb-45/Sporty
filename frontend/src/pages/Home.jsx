import React from "react";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div class="home-page">
      {/* Hero Banner */}
      <section class="hero-header">
        <div class="hero-text">
          <h1>Gear up your victory!</h1>
          <p>With our elite & premium sports equipment</p>
          <button class="hero-button" onClick={() => navigate("/collection")}>
            Shop Now <i class="fa-solid fa-arrow-right" style={{ marginLeft: "8px" }}></i>
          </button>
        </div>

        <div class="hero-image-wrapper">
          <img
            src="https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=500&h=350&fit=crop"
            alt="Sports gear"
          />
        </div>
      </section>

      {/* Services Section */}
      <section class="service">
        <div class="service-container-1">
          <h2>Best Customer Experience</h2>
          <p>We ensure our customers enjoy the premier shopping experience</p>
        </div>

        <div class="service-container-2">
          <div class="service-card">
            <i class="fa-regular fa-face-smile"></i>
            <h4>Satisfaction Guarantee</h4>
            <p>High-grade durable gear tested by professional athletes around the world.</p>
          </div>

          <div class="service-card">
            <i class="fa-solid fa-gift"></i>
            <h4>New Arrivals Everyday</h4>
            <p>Fresh items, limited editions, and high-performance drops arriving daily.</p>
          </div>

          <div class="service-card">
            <i class="fa-solid fa-truck-fast"></i>
            <h4>Fast & Free Shipping</h4>
            <p>Rapid dispatch and order tracking right to your doorstep.</p>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section class="news">
        <h2>Join Our Newsletter</h2>
        <p>Signup for exclusive sports discounts, news, and gear updates</p>
        <form class="news-form" onSubmit={(e) => { e.preventDefault(); alert("Thank you for subscribing!"); }}>
          <input type="email" class="news-input" placeholder="Enter your email address" required />
          <button type="submit" class="news-button">Subscribe</button>
        </form>
      </section>
    </div>
  );
};
