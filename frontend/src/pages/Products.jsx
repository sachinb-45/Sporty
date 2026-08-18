import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ paddingBottom: "60px" }}>
      <h2 class="page-title">OUR COLLECTIONS</h2>

      <input
        type="text"
        class="search-input"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <p style={{ textAlign: "center", marginTop: "40px", fontSize: "1.2rem", color: "#64748b" }}>
          Loading products...
        </p>
      ) : filteredProducts.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "40px", fontSize: "1.1rem", color: "#64748b" }}>
          No products found matching your search.
        </p>
      ) : (
        <div class="product-grid">
          {filteredProducts.map((p) => {
            // Support relative upload paths from backend
            const imageUrl = p.image.startsWith("http")
              ? p.image
              : `http://localhost:5000/${p.image.replace(/^\/+/, "")}`;

            return (
              <div key={p._id || p.name} class="product-card">
                <img src={imageUrl} alt={p.name} />
                <h3>{p.name}</h3>
                <div class="product-price">₹{p.price}</div>
                <div class="product-actions">
                  <button
                    class="btn btn-cart"
                    onClick={() => {
                      addToCart({ ...p, image: imageUrl });
                      alert(`Added ${p.name} to Cart!`);
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
