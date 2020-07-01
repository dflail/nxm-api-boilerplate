const dbHandler = require('../../src/db/testDatabase');
const { Account, RefreshToken } = require('../../src/db/database');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const validAccountData = {
  userName: 'tester1',
  email: 'test1@test.com',
  password: 'Test1pass!',
  firstName: 'Test',
  lastName: 'Testerson'
};

const invalidData = { thing: 'stuff' };

describe('RefreshToken model', () => {
  beforeAll(async () => {
    process.env.JWT_SECRET = crypto.randomBytes(64).toString('hex');
    process.env.JWT_EXPIRE = '30s';
    process.env.REFRESH_SECRET = crypto.randomBytes(64).toString('hex');
    process.env.REFRESH_EXPIRE = '30s';
    await dbHandler.connect();
  });

  afterAll(async () => {
    await dbHandler.terminateDb();
    await dbHandler.clearDb();
  });

  it('cannot be created using invalid data', async () => {
    let error = null;
    try {
      token = new RefreshToken(invalidData);
      await token.validate();
    } catch (e) {
      error = e;
    }
    expect(error).not.toBeNull();
  });

  let account, refreshToken;
  it('can be created using valid data', async () => {
    account = await Account.create(validAccountData);
    const expDate = new Date(Date.now());
    expDate.setTime(expDate.getTime() - 3 * 24 * 60 * 60 * 1000);

    refreshToken = await RefreshToken.create({
      account,
      token: account.getRefreshToken(),
      expires: expDate
    });

    expect(refreshToken).not.toBe(null);
    expect(refreshToken.revoked).toBe(undefined);
  });

  it('is not active if the token has expired', async () => {
    expect(refreshToken.isExpired()).toBe(true);
    expect(refreshToken.isActive()).toBe(false);
  });

  it('can be read from and updated in the database', async () => {
    const oldExpiration = refreshToken.expires;

    const expDate = new Date(Date.now());
    expDate.setTime(expDate.getTime() + 7 * 24 * 60 * 60 * 1000);

    refreshToken = await RefreshToken.findOneAndUpdate(
      { account },
      { expires: expDate },
      { new: true, runValidators: true }
    );

    expect(refreshToken.expires).not.toBe(undefined);
    expect(refreshToken.expires).not.toBe(oldExpiration);
  });

  it('is active if the token has not expired', () => {
    expect(refreshToken.isExpired()).toBe(false);
    expect(refreshToken.isActive()).toBe(true);
  });

  it('is not active if the token has been revoked', async () => {
    refreshToken = await RefreshToken.findOneAndUpdate(
      { account },
      { revoked: new Date(Date.now()) },
      { new: true }
    );

    expect(refreshToken.isActive()).toBe(false);
  });
});
