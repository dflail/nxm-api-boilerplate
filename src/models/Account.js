const argon2 = require('argon2');
const { account } = require('../utils/app-data');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, account.fields.USER_NAME.RULES],
    unique: true,
    trim: true,
    match: [account.fields.USER_NAME.PATTERN, account.fields.USER_NAME.RULES]
  },
  email: {
    type: String,
    required: [true, account.fields.EMAIL.RULES],
    trim: true,
    match: [account.fields.EMAIL.PATTERN, account.fields.EMAIL.RULES]
  },
  password: {
    type: String,
    required: [true, account.fields.PASSWORD.RULES],
    match: [account.fields.PASSWORD.PATTERN, account.fields.PASSWORD.RULES],
    select: false
  },
  firstName: String,
  lastName: String,
  resetToken: String,
  resetExpire: Date
});

schema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  try {
    const hash = await argon2.hash(this.password, { type: argon2.argon2id });
    let account = this;
    account.password = hash;
    next();
  } catch (err) {
    return next(err);
  }
});

schema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

schema.methods.getRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_EXPIRE
  });
};

schema.methods.verifyPassword = async function (passIn) {
  try {
    return await argon2.verify(this.password, passIn);
  } catch (err) {
    throw new Error(err.message);
  }
};

schema.methods.getResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model(account.MODEL_NAME, schema);
