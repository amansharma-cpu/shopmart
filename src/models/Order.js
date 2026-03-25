const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: Number,
  priceAtPurchase: Number,
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [orderItemSchema],

    totalAmount: Number,

    orderStatus: {
      type: String,
      enum: ["placed", "confirmed", "packed", "shipped", "delivered"],
      default: "placed",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },

    address: String,

    orderNumber: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);