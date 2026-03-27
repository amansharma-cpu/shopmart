const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getMyOrders,
  getVendorOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/orderController");

const {
  protect,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

//  Customer Routes
router.post("/", protect, authorizeRoles("customer"), placeOrder);
router.get("/my-orders", protect, authorizeRoles("customer"), getMyOrders);
router.put("/:id/cancel", protect, authorizeRoles("customer"), cancelOrder);

//  Vendor Routes
router.get("/vendor", protect, authorizeRoles("vendor"), getVendorOrders);

//  Admin Routes
router.get("/", protect, authorizeRoles("admin"), getAllOrders);

//  Vendor/Admin - Update Order Status
router.put(
  "/:id/status",
  protect,
  authorizeRoles("vendor", "admin"),
  updateOrderStatus
);

module.exports = router;