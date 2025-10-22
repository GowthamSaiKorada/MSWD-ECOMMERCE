// server/src/routes/products.js
const router = require('express').Router();
const ctrl = require('../controllers/productController');
const upload = require('../utils/upload'); // multer instance
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);

// Create product (protected)
router.post('/', auth, role('admin','manager'), upload.single('image'), ctrl.create);

// Update product (allow optional image replacement)
router.put('/:id', auth, role('admin','manager'), upload.single('image'), ctrl.update);

// Delete product
router.delete('/:id', auth, role('admin','manager'), ctrl.remove);

module.exports = router;
