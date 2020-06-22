const consoleUtils = require('./utils/console-utils');
const dotenv = require('dotenv');
const express = require('express');
const { account } = require('./utils/app-data');

dotenv.config({ path: './app.env' });

const app = express();
console.log(`original pattern: ${account.fields.USER_NAME.PATTERN}`);
account.fields.USER_NAME.PATTERN = '';
console.log(`new pattern: ${account.fields.USER_NAME.PATTERN}`);

app.get('/', (req, res) => {
  res.send(`${process.env.APP_NAME} v.${process.env.API_VERSION} READY`);
});

const server = app.listen(process.env.PORT, () =>
  consoleUtils.logServerHeader()
);

process.on('unhandledRejection', err => {
  consoleUtils.logError(err);
  server.close(() => process.exit(1));
});
