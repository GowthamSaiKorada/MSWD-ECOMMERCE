// server/src/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const path = require('path');
const connectDB = require('./config/db');

// Load .env
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ======== MIDDLEWARES ========
app.use(express.json());

// Allow requests from your frontend (React at port 5173)
app.use(
  cors({
    origin: [
  'http://localhost:5173',
  'https://mswd-ecommerce-six.vercel.app'
],
    credentials: true,
  })
);


// Security headers — allow images from other origins
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Serve uploaded images publicly
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ======== ROUTES ========
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const orderRoutes = require('./routes/orders'); // ✅ Added missing import

// Mount all API routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes); // ✅ Added missing registration

// ======== DEFAULT ROUTE ========
app.get('/', (req, res) => {
  res.send('🚀 Grocery Store API running');
});

// ======== START SERVER ========
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
