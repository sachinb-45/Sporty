import mongoose from "mongoose";

const trackingSchema = new mongoose.Schema({
    status: {
        type: String,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const orderSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },

    customerName: {
        type: String,
        required: true
    },

  customerEmail: {
    type: String,
    required: true
},

customerPhone: {
    type: String,
    required: true
},

shippingAddress: {
    type: String,
    required: true
},

paymentMethod: {
    type: String,
    default: "Cash On Delivery"
},

invoiceNumber: {
    type: String,
    unique: true,
    sparse: true,
    default: () => `INV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`
},

    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],

    totalAmount: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: [
            "Placed",
            "Confirmed",
            "Packed",
            "Shipped",
            "Out for Delivery",
            "Delivered",
            "Cancelled"
        ],
        default: "Placed"
    },

    trackingHistory: {
        type: [trackingSchema],
        default: [
            {
                status: "Placed"
            }
        ]
    }

}, 
{ timestamps: true });

export default mongoose.model("Order", orderSchema);