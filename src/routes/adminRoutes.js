const express = require("express");
const router = express.Router();

const {
  approveVendor,
  rejectVendor,
  getPendingVendors,
} = require("../controllers/adminController");

const {
  protect,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

// Only admin can access
router.get(
  "/vendors/pending",
  protect,
  authorizeRoles("admin"),
  getPendingVendors
);

router.put(
  "/vendors/:vendorId/approve",
  protect,
  authorizeRoles("admin"),
  approveVendor
);

router.delete(
  "/vendors/:vendorId/reject",
  protect,
  authorizeRoles("admin"),
  rejectVendor
);

module.exports = router;