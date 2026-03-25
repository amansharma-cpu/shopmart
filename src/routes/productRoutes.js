const express = require("express");
const router = express.Router();

const {
  addProduct,
  updateProduct,
  deleteProduct,
  getVendorProducts,
  getAllProducts,
  getSingleProduct,
} = require("../controllers/productController");

const {
  protect,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

// Vendor routes
router.post("/", protect, authorizeRoles("vendor"), addProduct);
router.put("/:id", protect, authorizeRoles("vendor"), updateProduct);
router.delete("/:id", protect, authorizeRoles("vendor"), deleteProduct);
router.get("/my-products", protect, authorizeRoles("vendor"), getVendorProducts);

// Customer routes
router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);

module.exports = router;