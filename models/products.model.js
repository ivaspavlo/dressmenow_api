
const mongoose = require('mongoose');
const slugify = require('slugify');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [ true, 'Please add a name' ],
    unique: true,
    trim: true,
    maxlength: [ 50, 'Name cannot be more than 50 characters' ]
  },
  image: {
    type: String,
    default: 'no-photo.jpg'
  },
  slug: String,
  description: {
    type: String,
    required: [ true, 'Please add a description' ],
    maxlength: [ 50, 'Description cannot be more than 500 characters' ]
  },
  priceUSD: {
    type: Number,
    required: [ true, 'Please add a price' ]
  },
  averageRating: {
    type: Number,
    min: [ 1, 'Rating must be at least 1' ],
    max: [ 5, 'Rating cant be more than 5' ]
  },
  colors: {
    type: [String]
  },
  size: {
    type: [String],
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
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

ProductSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
  justOne: false
});

ProductSchema.pre('remove', async function(next) {
  await this.model('Review').deleteMany({ product: this._id });
  next();
});

ProductSchema.pre('save', function() {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model('Product', ProductSchema);
