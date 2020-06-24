const asyncHandler = require('../middleware/async-handler');
const { Account, RefreshToken } = require('../db/database');
const AppError = require('../class/AppError');

//  ROUTE          POST /api/v1/accounts/registration
//  ACCESS         Public
//  DESC           Register a new account
exports.registration = asyncHandler(async (req, res, next) => {
  const { userName, email, password } = req.body;

  const account = await Account.create({
    userName,
    email,
    password
  });

  if (!account) {
    return next(
      new AppError.MongooseError(AppError.errors.BAD_REQUEST, 'Account', 400)
    );
  }

  sendTokenResponse(account, 200, res);
});

const sendTokenResponse = async (account, statusCode, res) => {
  const accessToken = account.getSignedToken();
  const expDate = new Date(Date.now());
  expDate.setTime(
    expDate.getTime() + process.env.DB_REFRESH_EXPIRE * 24 * 60 * 60 * 1000
  );

  const options = { expires: expDate, httpOnly: true };
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  const refreshToken = await RefreshToken.create({
    account,
    token: account.getRefreshToken(),
    expires: expDate
  });

  res
    .status(statusCode)
    .cookie('token', refreshToken.token, options)
    .json({ success: true, accessToken });
};
