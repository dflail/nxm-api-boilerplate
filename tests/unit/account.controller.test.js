const AccountController = require('../../src/controllers/accounts');
const { Account, RefreshToken } = require('../../src/db/database');

Account.create = jest.fn();

describe('registerNewAccount', () => {
  it('should have an existing registration route', () => {
    expect(typeof AccountController.registration).toBe('function');
  });
  it('should try to create a new account', () => {
    AccountController.create();
    expect(Account.create()).toBeCalled();
  });
});
