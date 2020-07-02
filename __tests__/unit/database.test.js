// mongodb-memory-server jest testing
const { connectDB } = require('../../src/db/database');
const {
  checkConnection,
  getTestUri,
  terminateDb
} = require('../../src/db/testDatabase');

describe('Database Connection', () => {
  beforeAll(async () => {
    process.env.MONGO_URI = await getTestUri();
  });

  afterAll(async () => {
    await dbHandler.clearDb();
    await dbHandler.terminateDb();
  });

  it('should connect to the (test) database', async () => {
    await connectDB();
    expect(checkConnection()).toBe(1);
  });
});
