// server/scripts/fix-mark-removed.js
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const connectDB = require('../src/config/db');
const Order = require('../src/models/Order');

(async function(){
  try {
    await connectDB();
    const orders = await Order.find();
    let updated = 0;

    for (const o of orders) {
      let modified = false;
      for (let it of o.items) {
        if (!it.product) {
          // add a snapshot field inside the item
          it._deletedProduct = true;
          it._deletedTitle = it._deletedTitle || 'Product removed';
          modified = true;
        }
      }
      if (modified) {
        await o.save();
        updated++;
      }
    }

    console.log('Updated orders:', updated);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
