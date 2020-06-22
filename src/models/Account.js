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
  }
});

module.exports = mongoose.model(account.MODEL_NAME, schema);
