import express from "express";

import {
    createOrder,
    cancelOrder,
    updateOrderStatus,
    getOrderById,
    getLatestOrder,
    getAllOrders,
    getOrdersByUser,
    downloadInvoice
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createOrder);

router.get("/", getAllOrders);

router.get("/user/:userId", getOrdersByUser);

router.get("/:id", getOrderById);

router.put("/:id/status", updateOrderStatus);

router.put("/:id/cancel", cancelOrder);

router.get("/:id/invoice", downloadInvoice);

export default router;