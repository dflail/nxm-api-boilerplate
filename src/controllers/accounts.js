const crypto = require('crypto');
const asyncHandler = require('../middleware/async-handler');
const mailer = require('../utils/mailer');
const { Account, RefreshToken } = require('../db/database');
const { emailOutput, errorOutput } = require('../utils/string-constants');
const { environments } = require('../utils/app-data');
const {
  AuthenticationError,
  MongooseError,
  NotFoundError,
  ServerError,
  BadRequestError
} = require('../class/AppError');

//  ROUTE          GET /api/v1/accounts/current
//  ACCESS         Private
//  DESC           Get current user account
exports.current = asyncHandler(async (req, res, next) => {
  const account = await Account.findById(req.account.id);

  res.status(200).json({ success: true, data: account });
});

//  ROUTE          GET /api/v1/accounts/logout
//  ACCESS         Private
//  DESC           Logout of current account and clear cookie
exports.logout = asyncHandler(async (req, res, next) => {
  if (req.cookies.token) {
    const refreshToken = await RefreshToken.findOne({
      token: req.cookies.token
    });

    if (refreshToken && refreshToken.isActive) {
      refreshToken.revoked = new Date(Date.now());
      await refreshToken.save();
    }
  }

  res.cookie('token', 'none', {
    expires: new Date(Date.now()),
    httpOnly: true
  });

  res.status(200).json({ success: true, data: {} });
});

//  ROUTE          POST /api/v1/accounts/registration
//  ACCESS         Public
//  DESC           Register a new account
exports.registration = asyncHandler(async (req, res, next) => {
  const { userName, email, password, firstName, lastName } = req.body;

  const account = await Account.create({
    userName,
    email,
    password,
    firstName,
    lastName
  });

  if (!account) {
    return next(new MongooseError(errorOutput.BAD_REQUEST, 'Account', 400));
  }

  sendTokenResponse(account, 201, req, res);
});

//  ROUTE          POST /api/v1/accounts/login
//  ACCESS         Public
//  DESC           Login an existing user
exports.login = asyncHandler(async (req, res, next) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return next(new AuthenticationError());
  }

  const account = await Account.findOne({ userName }).select('+password');

  if (!account) {
    return next(new NotFoundError(Account.modelName));
  }

  const isMatch = await account.verifyPassword(password);

  if (!isMatch) {
    return next(new AuthenticationError());
  }

  sendTokenResponse(account, 200, req, res);
});

//  ROUTE          POST /api/v1/accounts/password
//  ACCESS         Public
//  DESC           Request Password Reset Email
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const account = await Account.findOne({ email: req.body.email });

  if (!account) {
    return next(new NotFoundError(Account.modelName));
  }

  const resetToken = account.getResetToken();

  await account.save({ validateBeforeSave: false });

  const resetUrl = `https://${req.get('host')}${process.env.BASE_URL}${
    process.env.VERSION_URL
  }password/${resetToken}`;

  const message = `${emailOutput.TEST_PASSWORD_RESET}${resetUrl}`;

  try {
    await mailer({
      email: account.email,
      subject: `${process.env.APP_NAME} ${emailOutput.TEST_EMAIL_SUBJECT}`,
      text: message
    });

    res
      .status(200)
      .json({ success: true, data: emailOutput.TEST_EMAIL_SUCCESS });
  } catch (err) {
    account.passwordResetToken = undefined;
    account.passwordResetExpire = undefined;

    await account.save({ validateBeforeSave: false });

    return next(new ServerError(errorOutput.EMAIL_ERROR));
  }
});

//  ROUTE          PUT /api/v1/accounts/password/:token
//  ACCESS         Public
//  DESC           Reset Password
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const resetToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const account = await Account.findOne({
    resetToken: resetToken,
    resetExpire: { $gt: Date.now() }
  });

  if (!account) {
    return next(new BadRequestError(errorOutput.BAD_TOKEN));
  }

  account.password = req.body.password;
  account.resetToken = undefined;
  account.resetExpire = undefined;
  await account.save();

  sendTokenResponse(account, 200, req, res);
});

const sendTokenResponse = async (account, statusCode, req, res) => {
  const accessToken = account.getSignedToken();
  const expDate = new Date(Date.now());
  expDate.setTime(
    expDate.getTime() + process.env.DB_REFRESH_EXPIRE * 24 * 60 * 60 * 1000
  );

  const options = { expires: expDate, httpOnly: true };
  if (process.env.NODE_ENV === environments.PROD) {
    options.secure = true;
  }

  let refreshToken;
  if (req.cookies && req.cookies.token) {
    refreshToken = await RefreshToken.findOneAndUpdate(
      { token: req.cookies.token },
      { revoked: new Date(Date.now()) },
      { new: true }
    );
  }

  if (!refreshToken || !refreshToken.isActive()) {
    refreshToken = await RefreshToken.create({
      account,
      token: account.getRefreshToken(),
      expires: expDate
    });
  }

  res
    .status(statusCode)
    .cookie('token', refreshToken.token, options)
    .json({ success: true, accessToken });
};
