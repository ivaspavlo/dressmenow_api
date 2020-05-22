
const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [ true, 'Please add a title' ],
    trim: true,
    maxlength: [ 100, 'Title cannot be more than 100 characters' ]
  },
  text: {
    type: String,
    required: [ true, 'Please add a review text' ],
    maxlength: [ 500, 'Review text cannot be more than 500 characters' ]
  },
  rating: {
    type: Number,
    min: [ 1, 'Rating must be at least 1' ],
    max: [ 5, 'Rating cant be more than 5' ]
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  addedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [ true, 'Added by user required' ]
  }
});

ReviewSchema.statics.getAverageRating = async function(productId) {
  let [{ _id, averageRating }] = await this.aggregate([
    {
      $match: { product: productId }
    }, {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' }
      }
    }
  ]);
  const errMsg = 'Error with updating the averageRating value of a product';
  averageRating = Math.round((averageRating + Number.EPSILON) * 10) / 10;
  if(!_id || isNaN(averageRating)) { throw new Error(errMsg); }
  try {
    await this.model('Product').findByIdAndUpdate(_id, { averageRating }, { new: true, runValidators: true });
  } catch (error) {
    throw new Error(errMsg);
  }
}

ReviewSchema.post('save', async function() {
  await this.constructor.getAverageRating(this.product);
});

ReviewSchema.post('remove', async function() {
  await this.constructor.getAverageRating(this.product);
});

module.exports = mongoose.model('Review', ReviewSchema);
