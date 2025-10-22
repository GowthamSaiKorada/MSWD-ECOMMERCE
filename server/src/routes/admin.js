// server/src/routes/admin.js
const router = require('express').Router();
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');
const ctrl = require('../controllers/adminController');

router.get('/stats', auth, role('admin','manager'), ctrl.stats);
router.get('/orders', auth, role('admin','manager'), ctrl.listOrders);

module.exports = router;
