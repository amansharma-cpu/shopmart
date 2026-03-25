const Order = require("../models/Order");
const Product = require("../models/Product");
const StockLog = require("../models/StockLog");

// 🔥 Place Order (Customer)
exports.placeOrder = async (req, res) => {
  try {
    const { items, address } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    let totalAmount = 0;
    const orderItems = [];

    // ✅ Validate products & stock
    for (let item of items) {
      const product = await Product.findById(item.productId);

      if (!product || product.status !== "active") {
        return res.status(400).json({ message: "Invalid product" });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.productName}`,
        });
      }

      const price = product.discountPrice || product.price;

      totalAmount += price * item.quantity;

      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        priceAtPurchase: price,
        vendorId: product.vendorId,
      });
    }

    // ✅ Deduct stock + log
    for (let item of orderItems) {
      const product = await Product.findById(item.productId);

      const prevStock = product.stock;
      product.stock -= item.quantity;
      await product.save();

      await StockLog.create({
        productId: product._id,
        previousStock: prevStock,
        newStock: product.stock,
        changeType: "order_placed",
        changedBy: req.user._id,
      });
    }

    // ✅ Create order
    const order = await Order.create({
      customerId: req.user._id,
      items: orderItems,
      totalAmount,
      address,
      orderNumber: "ORD-" + Date.now(),
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔥 Get Customer Orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔥 Get Vendor Orders
exports.getVendorOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      "items.vendorId": req.user._id,
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔥 Get All Orders (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔥 Update Order Status (Vendor/Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const validFlow = [
      "placed",
      "confirmed",
      "packed",
      "shipped",
      "delivered",
    ];

    const currentIndex = validFlow.indexOf(order.orderStatus);
    const newIndex = validFlow.indexOf(status);

    // ❌ Prevent invalid transitions
    if (newIndex !== currentIndex + 1) {
      return res
        .status(400)
        .json({ message: "Invalid status transition" });
    }

    order.orderStatus = status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔥 Cancel Order (Customer)
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order || order.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (order.orderStatus !== "placed") {
      return res.status(400).json({
        message: "Cannot cancel after processing",
      });
    }

    order.orderStatus = "cancelled";
    await order.save();

    res.json({ message: "Order cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};