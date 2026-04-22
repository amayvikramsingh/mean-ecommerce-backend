const express = require('express');
const router = express.Router();

const {
  createProduct,
  createMultipleProducts,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');

// PUBLIC
router.get('/', getProducts);
router.get('/:id', getProduct);

// PROTECTED
router.post('/', auth, createProduct);
router.post('/bulk',auth, createMultipleProducts);
router.put('/:id', auth, role('admin', 'vendor'), updateProduct);
router.delete('/:id', auth, role('admin'), deleteProduct);

module.exports = router;
