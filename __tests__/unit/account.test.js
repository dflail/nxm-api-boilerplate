const mongoose = require('mongoose');
const dbHandler = require('../../src/db/testDatabase');
const Account = require('../../src/models/Account');

const validData = {
  userName: 'tester1',
  email: 'test1@test.com',
  password: 'Test1pass!',
  firstName: 'Test',
  lastName: 'Testerson'
};

const invalidData = { thing: 'stuff' };

beforeAll(async () => await dbHandler.connect());
afterAll(async () => {
  await dbHandler.terminateDb();
  await dbHandler.clearDb();
});

describe('Account Model', () => {
  it('cannot be created using invalid data', async () => {
    let error = null;
    try {
      const account = new Account(invalidData);
      await account.validate();
    } catch (e) {
      error = e;
    }
    expect(error).not.toBeNull();
  });

  it('can be created using valid data', async () => {
    const account = await Account.create(validData);
    expect(account.userName).toBe('tester1');
  });

  it('can be retrieved from the database', async () => {
    const findAccount = await Account.findOne({ userName: 'tester1' }).select(
      '+password'
    );
    console.log(findAccount);
    expect(findAccount.email).toBe('test1@test.com');
  });
});
