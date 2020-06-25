const jwt = require('jsonwebtoken');
const asyncHandler = require('./async-handler');
const { AuthenticationError, NotFoundError } = require('../class/AppError');
const { Account, RefreshToken } = require('../db/database');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    // Set token from headers if they exist
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    // Otherwise, request a new access token using the refresh token
    const refreshToken = await RefreshToken.findOne({
      token: req.cookies.token
    });

    if (!refreshToken || !refreshToken.isActive()) {
      return next(new AuthenticationError());
    }

    const decoded = jwt.verify(refreshToken.token, process.env.REFRESH_SECRET);
    const account = await Account.findById(decoded.id);

    if (!account) {
      return next(new NotFoundError(account.constructor.modelName));
    }

    token = account.getSignedToken();
  }

  if (!token) {
    return next(new AuthenticationError());
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.account = await Account.findById(decoded.id);
    next();
  } catch (error) {
    return next(new AuthenticationError());
  }
});

module.exports = protect;
