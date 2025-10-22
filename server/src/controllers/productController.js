// server/src/controllers/productController.js
const Product = require('../models/Product');
const path = require('path');
const fs = require('fs');

// backend/controllers/productController.js
exports.getAll = async (req, res) => {
  try {
    const { q, page = 1, limit = 12, category } = req.query;
    const filter = {};

    // 🔍 Text search
    if (q) {
      filter.$or = [
        { title: new RegExp(q, "i") },
        { description: new RegExp(q, "i") },
      ];
    }

    // 🏷️ Category filter
    if (category && category.trim()) {
      filter.category = category.trim();
    }

    const skip = (page - 1) * limit;
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      items: products,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getOne = async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Not found' });
    res.json(p);
  } catch (err) {
    console.error('productController.getOne', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, description, price, stock, category } = req.body;

    if (!req.file) {
      console.warn('productController.create: No file uploaded for product create');
      // continue — you may allow product without image
    }

    const image = req.file ? `/uploads/${req.file.filename}` : '';
    const product = await Product.create({
      title,
      description,
      price: price !== undefined ? Number(price) : undefined,
      stock: stock !== undefined ? Number(stock) : undefined,
      category: category || '',
      image,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error('productController.create', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// server/src/controllers/productController.js

exports.update = async (req, res) => {
  try {
    const { title, description, price, stock, category } = req.body;
    const productId = req.params.id;

    // find existing product
    const existing = await Product.findById(productId);
    if (!existing) return res.status(404).json({ message: 'Product not found' });

    // Determine image path: keep existing unless new file uploaded or removeImage flag set
    let imagePath = existing.image || '';

    const removeImageFlag = req.body && (req.body.removeImage === 'true' || req.body.removeImage === true);

    if (req.file) {
      // new image uploaded
      imagePath = `/uploads/${req.file.filename}`;

      // remove old file (if exists)
      if (existing.image) {
        try {
          const prevRel = existing.image.replace(/^\//, ''); // remove leading slash
          const prevAbs = path.join(__dirname, '..', '..', prevRel);
          if (fs.existsSync(prevAbs)) {
            fs.unlinkSync(prevAbs);
          }
        } catch (unlinkErr) {
          console.warn('Failed to delete previous image:', unlinkErr);
        }
      }
    } else if (removeImageFlag) {
      // user requested image removal
      if (existing.image) {
        try {
          const prevRel = existing.image.replace(/^\//, '');
          const prevAbs = path.join(__dirname, '..', '..', prevRel);
          if (fs.existsSync(prevAbs)) {
            fs.unlinkSync(prevAbs);
          }
        } catch (unlinkErr) {
          console.warn('Failed to delete previous image:', unlinkErr);
        }
      }
      imagePath = ''; // clear image path in DB
    } else {
      // no new file and no remove flag -> keep existing imagePath unchanged
      imagePath = existing.image || '';
    }

    // Build update object only with provided fields
    const updateObj = {};
    if (title !== undefined) updateObj.title = title;
    if (description !== undefined) updateObj.description = description;
    if (price !== undefined) updateObj.price = Number(price);
    if (stock !== undefined) updateObj.stock = Number(stock);
    if (category !== undefined) updateObj.category = category;
    updateObj.image = imagePath;

    const updated = await Product.findByIdAndUpdate(productId, updateObj, { new: true });
    res.json(updated);
  } catch (err) {
    console.error('productController.update', err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.remove = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Not found' });

    // delete image file from disk if exists
    if (product.image) {
      try {
        const prevRel = product.image.replace(/^\//, '');
        const prevAbs = path.join(__dirname, '..', '..', prevRel);
        if (fs.existsSync(prevAbs)) {
          fs.unlinkSync(prevAbs);
        }
      } catch (err) {
        console.warn('Failed to delete product image during remove:', err);
      }
    }

    await Product.findByIdAndDelete(productId);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('productController.remove', err);
    res.status(500).json({ message: 'Server error' });
  }
};
