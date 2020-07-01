const dbHandler = require('../../src/db/testDatabase');
const { Account } = require('../../src/db/database');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const validData = {
  userName: 'tester1',
  email: 'test1@test.com',
  password: 'Test1pass!',
  firstName: 'Test',
  lastName: 'Testerson'
};

const invalidData = { thing: 'stuff' };

describe('Account Model', () => {
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

  let account;
  let password;
  it('cannot be created using invalid data', async () => {
    let error = null;
    try {
      account = new Account(invalidData);
      await account.validate();
    } catch (e) {
      error = e;
    }
    expect(error).not.toBeNull();
  });

  it('can be created using valid data', async () => {
    account = await Account.create(validData);
    password = account.password;
    expect(account.userName).toBe('tester1');
  });

  it('can be retrieved from and be updated in the database', async () => {
    account = await Account.findOneAndUpdate(
      { userName: 'tester1' },
      { email: 'test2@test.com' },
      { new: true, runValidators: true }
    ).select('+password');
    account.save();

    expect(account).not.toBeNull;
    expect(account.password).toBe(password);
    expect(account.email).toBe('test2@test.com');
  });

  it('returns a valid access token', async () => {
    const accountId = account._id.toString();
    const decoded = jwt.verify(
      account.getSignedToken(),
      process.env.JWT_SECRET
    );
    expect(accountId).toBe(decoded.id);
  });

  it('returns a valid refresh token', async () => {
    const accountId = account._id.toString();
    const decoded = jwt.verify(
      account.getRefreshToken(),
      process.env.REFRESH_SECRET
    );
    expect(accountId).toBe(decoded.id);
  });

  it('validates correct passwords', async () => {
    const passIn = validData.password;
    const isValid = await account.verifyPassword(passIn);
    expect(isValid).toBe(true);
  });

  it('recognizes incorrect passwords', async () => {
    const passIn = 'Incorrect Password';
    const isValid = await account.verifyPassword(passIn);
    expect(isValid).toBe(false);
  });

  it('throws an error when validating an empty password', async () => {
    let error = null;
    try {
      const passIn = null;
      await account.verifyPassword(passIn);
    } catch (e) {
      error = e;
    }
    expect(error).not.toBeNull();
  });

  it('returns a valid reset token', async () => {
    expect(account.resetToken).toBe(undefined);
    expect(account.resetExpire).toBe(undefined);

    await account.getResetToken();
    expect(account.resetToken).not.toBe(null);
    expect(account.resetExpire).not.toBe(null);
    // If resetExpire is correctly a Date, it will have a getMonth function...
    expect(typeof account.resetExpire.getMonth).toBe('function');
  });
});
