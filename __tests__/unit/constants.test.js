'use strict';

const {
  errorOutput,
  modelOutput
} = require('../../src/utils/string-constants');
const { account } = require('../../src/utils/app-data');

describe('String Constants Immutability', () => {
  it('returns a defined string constant', () => {
    expect(errorOutput.AUTH_ERROR).not.toBeNull;
  });

  it('is READONLY and throws an error when writing to object', () => {
    expect(() => {
      errorOutput = {};
    }).toThrow(TypeError);
  });

  // strict mode only
  it('is READONLY and throws an error when writing to a nested object', () => {
    expect(() => {
      errorOutput.AUTH_ERROR = 'This error only throws in strict mode.';
    }).toThrow(TypeError);
  });

  it('returns the expected value', () => {
    expect(errorOutput.AUTH_ERROR).toBe('Authentication was not successful.');
  });
});

describe('App Data Immutability', () => {
  it('returns a defined value for the provided key', () => {
    expect(account.MODEL_NAME).not.toBeNull;
  });

  it('is READONLY and throws an error when writing to object', () => {
    expect(() => {
      account = {};
    }).toThrow(TypeError);
  });

  // strict mode only
  it('is READONLY and throws an error when writing to a nested object', () => {
    expect(() => {
      account.fields.USER_NAME = 'This error only throws in strict mode.';
    }).toThrow(TypeError);
  });

  it('returns the expected value', () => {
    expect(account.fields.EMAIL.RULES).toBe(modelOutput.EMAIL_RULES);
  });
});
