
const asyncHandler = require('../middleware/async.mware');
const ErrorResponse = require('../utils/error-response.util');
const axios = require('axios');

// @desc    Get currencies
// @route   GET /api/v1/currency
// @access  Public
exports.getCurrency = asyncHandler(
  async (req, res, next) => {
    let httpResponse;
    try {
      httpResponse = await axios.get('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5');
    } catch (error) {
      return next(new ErrorResponse('Could not retrieve currencies', 404));
    }
    res.status(200).json({
      success: true,
      data: httpResponse.data
    });
  }
);
