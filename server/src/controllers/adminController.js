// server/src/controllers/adminController.js
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

exports.stats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const revenueAggregate = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
    ]);
    const totalRevenue = (revenueAggregate[0] && revenueAggregate[0].totalRevenue) || 0;
    res.json({ totalProducts, totalOrders, totalRevenue });
  } catch (err) {
    console.error('adminController.stats', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('items.product').populate('user', 'name email').sort({ createdAt:-1 });
    res.json(orders);
  } catch (err) {
    console.error('adminController.listOrders', err);
    res.status(500).json({ message: 'Server error' });
  }
};
