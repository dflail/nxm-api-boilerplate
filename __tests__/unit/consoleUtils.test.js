// mongodb-memory-server jest testing
const {
  logDatabaseConnection,
  logServerHeader,
  logError
} = require('../../src/utils/console-utils');
const {
  AuthenticationError,
  BadRequestError,
  ForbiddenError,
  MongooseError,
  NotFoundError,
  ServerError
} = require('../../src/class/AppError');

jest.spyOn(global.console, 'log');

describe('Console Utilities', () => {
  beforeAll(async () => {
    process.env.APP_NAME = 'Testing App Name';
    process.env.NODE_ENV = 'TESTING';
    process.env.API_VERSION = 'x.x';
    process.env.PORT = 'xxxx';
  });

  it('logs a formatted app summary', () => {
    logServerHeader();
    expect(console.log).toBeCalled();
  });

  it('logs formatted database information', () => {
    logDatabaseConnection();
    expect(console.log).toBeCalled();
  });

  it('logs error output', () => {
    logError(new AuthenticationError());
    expect(console.log).toBeCalled();

    logError(new BadRequestError('Console Utility Testing'));
    expect(console.log).toBeCalled();

    logError(new ForbiddenError());
    expect(console.log).toBeCalled();

    logError(new MongooseError('Mongoose is on fire', 'It burns!', 500));
    expect(console.log).toBeCalled();

    logError(new ServerError('The server is broken!'));
    expect(console.log).toBeCalled();

    logError(new NotFoundError('Testing Not Found Details'));
    expect(console.log).toBeCalled();
  });

  it('does not append additional details when none are provided', () => {
    logError(new BadRequestError());
    expect(console.log).toBeCalled();

    logError(new MongooseError('Mongoose Error Test', null, 400));
    expect(console.log).toBeCalled();

    logError(new NotFoundError());
    expect(console.log).toBeCalled();
  });
});
