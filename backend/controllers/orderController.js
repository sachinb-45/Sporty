import Order from "../models/Order.js";
import generateInvoice from "../utils/generateInvoice.js";

export const createOrder = async (req, res) => {
    try {
        const {
            customerName,
            customerEmail,
            customerPhone,
            shippingAddress,
            address,
            paymentMethod,
            products,
            totalAmount
        } = req.body;

        const finalAddress = shippingAddress || address;

        const errors = {};
        if (!customerName || !customerName.trim()) errors.customerName = "Full Name is required.";
        if (!customerEmail || !customerEmail.trim()) errors.customerEmail = "Email Address is required.";
        if (!customerPhone || !customerPhone.trim()) errors.customerPhone = "Phone Number is required.";
        if (!finalAddress || !finalAddress.trim()) errors.shippingAddress = "Delivery Address is required.";
        if (!products || !Array.isArray(products) || products.length === 0) errors.products = "Cart cannot be empty.";

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors
            });
        }

        const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

        const newOrder = new Order({
            customerName,
            customerEmail,
            customerPhone,
            shippingAddress: finalAddress,
            paymentMethod: paymentMethod || "COD",
            invoiceNumber,
            products,
            totalAmount
        });

        await newOrder.save();

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order: newOrder
        });

    } catch (error) {
        console.error("❌ Order Controller Error:", error);

        if (error.name === "ValidationError") {
            const fieldErrors = {};
            for (let field in error.errors) {
                fieldErrors[field] = error.errors[field].message;
            }
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: fieldErrors
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found."
            });
        }

        const cancellableStatuses = ["Placed", "Confirmed"];
        if (!cancellableStatuses.includes(order.status)) {
            return res.status(400).json({
                success: false,
                message: `Order cannot be cancelled once it is "${order.status}".`
            });
        }

        order.status = "Cancelled";
        order.trackingHistory.push({ status: "Cancelled" });
        await order.save();

        const io = req.app.get("io");
        if (io) io.emit("orderUpdated", order);

        res.status(200).json({
            success: true,
            message: "Order cancelled successfully.",
            order
        });

    } catch (error) {
        console.error("❌ Cancel Order Error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const updateOrderStatus = async (req, res) => {

    try {

        const { id } = req.params;
        const { status } = req.body;

        const validStatus = [
            "Placed",
            "Confirmed",
            "Packed",
            "Shipped",
            "Out for Delivery",
            "Delivered"
        ];

        if (!validStatus.includes(status)) {

            return res.status(400).json({
                success: false,
                message: "Invalid Status"
            });

        }

        const order = await Order.findById(id);

        if (!order) {

            return res.status(404).json({
                success: false,
                message: "Order Not Found"
            });

        }

        order.status = status;

        order.trackingHistory.push({
            status
        });

        await order.save();

        const io = req.app.get("io");

        io.emit("orderUpdated", order);

        res.status(200).json({
            success: true,
            message: "Order Updated Successfully",
            order
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export const getLatestOrder = async (req, res) => {
    try {

        const order = await Order.findOne().sort({ createdAt: -1 });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "No orders found"
            });
        }

        res.json({
            success: true,
            order
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const getAllOrders = async (req, res) => {
    try {

        const orders = await Order.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            orders
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const downloadInvoice = async (req, res) => {

    try {

        const order = await Order.findById(req.params.id)
            .populate("products.productId");

        console.log("ORDER:");
        console.log(JSON.stringify(order, null, 2));

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        generateInvoice(order, res);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message
        });

    }

};

export const getOrderById = async (req, res) => {
    try {

        const { id } = req.params;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order Not Found"
            });
        }

        res.status(200).json({
            success: true,
            order
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const getSingleOrder = async (req, res) => {

    try {

        const order = await Order.findById(req.params.id);

        if (!order) {

            return res.status(404).json({
                success: false,
                message: "Order Not Found"
            });

        }

        res.status(200).json({
            success: true,
            order
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export const getOrdersByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const orders = await Order.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            orders
        });

    } catch (error) {
        console.error("❌ Get Orders By User Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};