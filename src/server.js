const { logServerHeader, logError } = require('./utils/console-utils');
const { environments } = require('./utils/app-data');
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
const accounts = require('./routes/accounts');
const errorHandler = require('./middleware/error-handler');

dotenv.config({ path: './.env' });

const ENV = process.env.NODE_ENV;
const app = express();

app.use(express.json());

if (ENV === environments.DEV) {
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

const BASE_URL = process.env.BASE_URL + process.env.VERSION_URL;
app.use(`${BASE_URL}accounts`, accounts);

const server = app.listen(process.env.PORT, () => logServerHeader());

connectDB();

app.use(errorHandler);

process.on('unhandledRejection', err => {
  err.statusCode = 500;
  logError(err);
  server.close(() => process.exit(1));
});

module.exports = app;
