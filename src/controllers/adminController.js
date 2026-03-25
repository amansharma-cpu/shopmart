const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

// Approve Vendor
exports.approveVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const vendor = await User.findById(vendorId);

    if (!vendor || vendor.role !== "vendor") {
      return res.status(404).json({ message: "Vendor not found" });
    }

    vendor.isApproved = true;
    await vendor.save();

    res.json({ message: "Vendor approved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject Vendor
exports.rejectVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const vendor = await User.findById(vendorId);

    if (!vendor || vendor.role !== "vendor") {
      return res.status(404).json({ message: "Vendor not found" });
    }

    await vendor.deleteOne();

    res.json({ message: "Vendor rejected successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Pending Vendors
exports.getPendingVendors = async (req, res) => {
  try {
    const vendors = await User.find({
      role: "vendor",
      isApproved: false,
    });

    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin Stats
exports.getStats = async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments({
      role: "customer",
    });

    const totalVendors = await User.countDocuments({
      role: "vendor",
    });

    const approvedVendors = await User.countDocuments({
      role: "vendor",
      isApproved: true,
    });

    const totalProducts = await Product.countDocuments();

    const activeProducts = await Product.countDocuments({
      status: "active",
    });

    const totalOrders = await Order.countDocuments();

    const revenueData = await Order.aggregate([
      { $match: { orderStatus: "delivered" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    res.json({
      totalCustomers,
      totalVendors,
      approvedVendors,
      totalProducts,
      activeProducts,
      totalOrders,
      totalRevenue: revenueData[0]?.totalRevenue || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};