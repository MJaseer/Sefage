const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  discount: {
    type: Number,
    required: true,
    min: 1,
    max: 99,
  },
  minimumAmount: {
    type: Number,
    required: true,
    min: 1,
  },
  maximumDiscountAmount: {
    type: Number,
    required: true,
    min: 1,
  },
  expireAt: {
    type: Date,
    required: true,
  },
  users: [{
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User'
    }
  }]
});

// expire the coupon automatically when it expires
couponSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
