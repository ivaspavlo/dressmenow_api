
const asyncHandler = require('../middleware/async.mware');
const ErrorResponse = require('../utils/error-response.util');
const Review = require('../models/reviews.model');
const Product = require('../models/products.model');

// @desc    Get all reviews
// @route   GET /api/v1/reviews
// @route   GET /api/v1/products/:productId/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if(req.params.productId) {
    const reviews = await Review.find({ product: req.params.productId });
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } else {
    res.status(200).json( res.advancedResults );
  }
});

// @desc    Get a single review
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'product',
    select: 'name'
  });
  if(!review) {
    return next(new ErrorResponse(`No review with the id of ${ req.params.id }`), 404);
  }
  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc    Create a review
// @route   POST /api/v1/products/:productId/reviews
// @access  Private
exports.createReview = asyncHandler(async (req, res, next) => {
  req.body.product = req.params.productId; // TODO ??
  const product = await Product.findById(req.params.productId);
  if(!product) {
    return next(
      new ErrorResponse(`No product with the id of ${ req.params.productId }`, 404)
    );
  }
  const review = await Review.create(req.body);
  res.status(200).json({ success: true, data: review }); }
);

// @desc    Update a review
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if(!review) { return next(new ErrorResponse(`No review with the id of ${ req.params.id }`, 404)); }
  if(review.addedBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${ req.params.id } is not authorized to update this review`, 401));
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.status(200).json({ success: true, data: review }); }
);

// @desc    Delete a review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if(!review) { return next(new ErrorResponse(`No review with the id of ${ req.params.id }`, 404)); }
  if(review.addedBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${ req.params.id } is not authorized to delete this review`, 401));
  }

  await review.remove();
  res.status(200).json({ success: true, data: {} }); }
);
