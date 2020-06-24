const { logServerHeader } = require('./utils/console-utils');
const dotenv = require('dotenv');
const express = require('express');
const { connectDB } = require('./db/database');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const sanitizer = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const limiter = require('express-rate-limit');
const hpp = require('hpp');

dotenv.config({ path: './app.env' });

const app = express();
const ENV = process.env.NODE_ENV;

if (ENV === 'DEVELOPMENT') {
  app.use(morgan('dev'));
}

app.use(cookieParser());
app.use(sanitizer());
app.use(helmet());
app.use(xss());

const limit = limiter({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limit);
app.use(hpp());

const server = app.listen(process.env.PORT, () => logServerHeader());

connectDB();

process.on('unhandledRejection', err => {
  err.statusCode = 500;
  consoleUtils.logError(err);
  server.close(() => process.exit(1));
});
