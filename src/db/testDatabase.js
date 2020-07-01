const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongod = new MongoMemoryServer();

exports.connect = async () => {
  const uri = await mongod.getUri();
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  // mongoose.set('useUnifiedTopology', true);

  await mongoose.connect(uri);
};

exports.clearDb = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};

exports.terminateDb = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await mongod.stop();
};
