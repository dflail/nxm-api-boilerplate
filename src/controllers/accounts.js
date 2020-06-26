const asyncHandler = require('../middleware/async-handler');
const { Account, RefreshToken } = require('../db/database');
const AppError = require('../class/AppError');

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
    return next(
      new AppError.MongooseError(AppError.errors.BAD_REQUEST, 'Account', 400)
    );
  }

  sendTokenResponse(account, 200, req, res);
});

//  ROUTE          POST /api/v1/auth/login
//  ACCESS         Public
//  DESC           Login an existing user
exports.login = asyncHandler(async (req, res, next) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return next(new AppError.AuthenticationError());
  }

  const account = await Account.findOne({ userName }).select('+password');

  if (!account) {
    return next(new AppError.NotFoundError(Account.modelName));
  }

  const isMatch = await account.verifyPassword(password);

  if (!isMatch) {
    return next(new AppError.AuthenticationError());
  }

  sendTokenResponse(account, 200, req, res);
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

const sendTokenResponse = async (account, statusCode, req, res) => {
  const accessToken = account.getSignedToken();
  const expDate = new Date(Date.now());
  expDate.setTime(
    expDate.getTime() + process.env.DB_REFRESH_EXPIRE * 24 * 60 * 60 * 1000
  );

  const options = { expires: expDate, httpOnly: true };
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  let refreshToken;
  if (req.cookies.token) {
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
