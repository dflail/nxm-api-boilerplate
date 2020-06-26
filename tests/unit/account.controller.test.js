const accountController = require('../../src/controllers/accounts');

describe('loginWithoutAccount', () => {
  it('should have an existing login route', () => {
    expect(typeof accountController.login).toBe('function');
  });
});
