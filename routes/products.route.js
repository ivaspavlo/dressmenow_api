
const express = require('express');
const router = express.Router();
const reviewsRouter = require('./reviews.route');
const Product = require('../models/products.model');
const advancedResults = require('../middleware/advanced-results.mware');
const { protect, authorize } = require('../middleware/auth.mware');

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  productImageUpload
} = require('../controllers/products.controller');

router.use('/:productId/reviews', reviewsRouter);

router.route('/:id/image')
  .put(protect, authorize('admin'), productImageUpload);

router.route('/')
  .get(advancedResults(Product, 'reviews'), getProducts)
  .post(protect, authorize('admin'), createProduct);

router.route('/:id')
  .get(getProduct)
  .put(protect, authorize('admin'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

module.exports = router;
