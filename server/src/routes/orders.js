// server/src/routes/orders.js
const router = require('express').Router();
const auth = require('../middlewares/auth');
const ctrl = require('../controllers/orderController');

router.post('/', auth, ctrl.createOrder);
router.get('/', auth, ctrl.myOrders);

module.exports = router;
