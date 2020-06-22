const mongoose = require('mongoose');
const { logDatabaseConnection } = require('../utils/console-utils');

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });

  logDatabaseConnection(conn.connection.host);
};

module.exports = connectDB;
