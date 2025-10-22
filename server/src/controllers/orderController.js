// server/src/controllers/orderController.js
const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    if (!items || !items.length) return res.status(400).json({ message: 'No items' });

    let total = 0;
    for (const it of items) {
      const p = await Product.findById(it.product);
      if (!p) return res.status(400).json({ message: 'Invalid product in cart' });
      total += p.price * (it.qty || 1);
    }

    const order = await Order.create({
      user: req.user.id,
      items,
      total,
      shippingAddress: shippingAddress || {},
      status: 'pending',
    });

    res.status(201).json(order);
  } catch (err) {
    console.error('orderController.createOrder', err);
    res.status(500).json({ message: 'Order failed' });
  }
};

exports.myOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('items.product');
    res.json(orders);
  } catch (err) {
    console.error('orderController.myOrders', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listAll = async (req, res) => {
  try {
    const orders = await Order.find().populate('items.product').populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('orderController.listAll', err);
    res.status(500).json({ message: 'Server error' });
  }
};
