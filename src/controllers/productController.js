const Product = require("../models/Product");

// Add Product (Vendor only)
exports.addProduct = async (req, res) => {
  try {
    const {
      productName,
      description,
      price,
      discountPrice,
      stock,
      sku,
      category,
    } = req.body;

    // Check vendor approval
    if (req.user.role === "vendor" && !req.user.isApproved) {
      return res.status(403).json({ message: "Vendor not approved" });
    }

    // Validation
    if (discountPrice && discountPrice > price) {
      return res
        .status(400)
        .json({ message: "Discount price cannot be greater than price" });
    }

    const existingSKU = await Product.findOne({ sku });
    if (existingSKU) {
      return res.status(400).json({ message: "SKU must be unique" });
    }

    const product = await Product.create({
      productName,
      description,
      price,
      discountPrice,
      stock,
      sku,
      category,
      vendorId: req.user._id,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || product.vendorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(product, req.body);
    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || product.vendorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await product.deleteOne();

    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Vendor Products
exports.getVendorProducts = async (req, res) => {
  try {
    const products = await Product.find({ vendorId: req.user._id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Customer: Get All Active Products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: "active" });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Customer: Get Single Product
exports.getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || product.status !== "active") {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};