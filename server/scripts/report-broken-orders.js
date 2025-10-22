// server/scripts/report-broken-orders.js
// Run: node server/scripts/report-broken-orders.js
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const connectDB = require('../src/config/db'); // adjust if your path differs
const Order = require('../src/models/Order');
const Product = require('../src/models/Product');

(async function(){
  try {
    await connectDB();
    console.log('Connected to DB');

    const orders = await Order.find().populate('items.product', 'title');
    const broken = [];

    for (const o of orders) {
      const badItems = o.items.filter(it => !it.product); // product is null or missing
      if (badItems.length) {
        broken.push({
          orderId: o._id.toString(),
          user: o.user?.toString(),
          badCount: badItems.length,
          items: badItems.map(it => ({ qty: it.qty, rawProduct: it.product })),
        });
      }
    }

    console.log('Broken orders count:', broken.length);
    console.log(JSON.stringify(broken, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
