
const path = require('path');
const asyncHandler = require('../middleware/async.mware');
const ErrorResponse = require('../utils/error-response.util');
const Product = require('../models/products.model');

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = asyncHandler(
  async (req, res, next) => { res.status(200).json(res.advancedResults); }
);

// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if(!product) { return next(new ErrorResponse(`Product with id ${ req.params.id } not found`, 404)); }
  res.status(200).json({ success: true, data: product }); }
);

// @desc    Create new product
// @route   POST /api/v1/products
// @access  Private/Admin
exports.createProduct = asyncHandler(async (req, res, next) => {
  req.body.addedBy = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    data: product
  }); }
);

// @desc    Update a product
// @route   PUT /api/v1/products
// @access  Private/Admin
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if(!product) { return next(new ErrorResponse(`Product with id ${ req.params.id } not found`, 404)); }
  res.status(200).json({ success: true, data: product }); }
);

// @desc    Delete all products
// @route   DELETE /api/v1/products
// @access  Private/Admin
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if(!product) { return next(new ErrorResponse(`Product with id ${ req.params.id } not found`, 404)); }
  product.remove();
  res.status(200).json({ success: true, data: null }); }
);

// @desc    Upload image for product
// @route   PUT /api/v1/products/:id/image
// @access  Private/Admin
exports.productImageUpload = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if(!product) { return next(new ErrorResponse(`Product with id ${ req.params.id } not found`, 404)); }
  if(!req.files) { return next(new ErrorResponse(`Please upload a file`, 400)); }

  const file = req.files.file;

  if(!file.mimetype.startsWith('image')) { return next(new ErrorResponse(`Please upload an image file`, 400)); }
  if(file.size > process.env.MAX_FILE_UPLOAD) { return next(new ErrorResponse(`Please upload an image less than ${ process.env.MAX_FILE_UPLOAD } bytes`, 400)); }

  file.name = `product_image_${ product._id }${path.parse(file.name).ext}`;

  file.mv(`${ process.env.FILE_UPLOAD_PATH }/${ file.name }`, async err => {
    if(err) { return next(new Error('Problem with file upload')); }
    await Product.findByIdAndUpdate(req.params.id, { image: file.name });
  });

  res.status(200).json({ success: true, data: file.name }); }
);
