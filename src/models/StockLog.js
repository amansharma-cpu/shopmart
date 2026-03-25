const mongoose = require("mongoose");

const stockLogSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },

  previousStock: Number,
  newStock: Number,

  changeType: {
    type: String,
    enum: ["order_placed", "manual_update", "admin_adjustment"],
  },

  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("StockLog", stockLogSchema);