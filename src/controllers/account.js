const asyncHandler = require('../middleware/async-handler');

//  ROUTE          POST /api/v1/account/register
//  ACCESS         Public
//  DESC           Register a new account
exports.register = asyncHandler(async (req, res, next) => {
  const { userName, email, password } = req.body;

  const account = await Account.create({
    userName,
    email,
    password
  });

  if (!account) {
    console.log('ERROR');
    //   return next()
  }

  sendTokenResponse(account, 200, res);
});

const sendTokenResponse = async (account, statusCode, res) => {
  const accessToken = account.getSignedToken();
  const expDate = new Date(Date.now());
  expDate.setTime(
    expDate.getTime() + process.env.REF_DB_EXPIRE * 24 * 60 * 60 * 1000
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
