import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.json({ message: "Order placed successfully" });
  } catch (err) {
    console.error("Order error:", err);
    res.status(500).json({ error: "Could not place order" });
  }
});

export default router;
