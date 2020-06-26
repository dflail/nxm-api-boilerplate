const mongoose = require('mongoose');
const { refreshToken } = require('../utils/app-data');

const RefreshTokenSchema = new mongoose.Schema(
  {
    account: {
      type: mongoose.Schema.ObjectId,
      ref: 'Account',
      required: [true, refreshToken.fields.ACCOUNT]
    },
    token: {
      type: String,
      required: [true, refreshToken.fields.TOKEN],
      unique: true
    },
    expires: {
      type: Date,
      required: [true, refreshToken.fields.EXPIRES]
    },
    revoked: Date
  },
  { timestamps: true }
);

RefreshTokenSchema.methods.isExpired = function () {
  return Date.now() >= this.expires;
};

RefreshTokenSchema.methods.isActive = function () {
  return !this.revoked && !this.isExpired();
};

module.exports = mongoose.model(refreshToken.MODEL_NAME, RefreshTokenSchema);
