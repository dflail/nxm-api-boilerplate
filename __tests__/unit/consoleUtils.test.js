const {
  logDatabaseConnection,
  logServerHeader,
  logError
} = require('../../src/utils/console-utils');
const { BadRequestError } = require('../../src/class/AppError');

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
    logError(new BadRequestError('Console Utility Testing'));
    expect(console.log).toBeCalled();
  });
});
