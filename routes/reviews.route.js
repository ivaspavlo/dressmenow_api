
const express = require('express');
const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview
} = require('../controllers/reviews.controller');
const Review = require('../models/reviews.model');
const advancedResults = require('../middleware/advanced-results');
const { protect } = require('../middleware/auth');


const router = express.Router({ mergeParams: true });

router.route('/')
  .get(advancedResults(Review, { path: 'product', select: 'name priceUSD' }), getReviews)
  .post(protect, createReview);

router
  .route('/:id')
  .get(getReview)
  .put(protect, updateReview)
  .delete(protect, deleteReview);

module.exports = router;
