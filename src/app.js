const consoleUtils = require('./utils/console-utils');
const dotenv = require('dotenv');
const express = require('express');
const connectDB = require('./db/database');
const morgan = require('morgan');

dotenv.config({ path: './app.env' });

const app = express();
app.use(morgan('dev'));

const server = app.listen(process.env.PORT, () =>
  consoleUtils.logServerHeader()
);

connectDB();

process.on('unhandledRejection', err => {
  consoleUtils.logError(err);
  server.close(() => process.exit(1));
});
