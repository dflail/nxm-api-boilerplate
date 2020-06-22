const consoleUtils = require('./utils/console-utils');
const dotenv = require('dotenv');
const express = require('express');
const connectDB = require('./db/database');

dotenv.config({ path: './app.env' });

const app = express();

app.get('/', (req, res) => {
  res.send(`${process.env.APP_NAME} v.${process.env.API_VERSION} READY`);
});

const server = app.listen(process.env.PORT, () =>
  consoleUtils.logServerHeader()
);

connectDB();

process.on('unhandledRejection', err => {
  consoleUtils.logError(err);
  server.close(() => process.exit(1));
});
