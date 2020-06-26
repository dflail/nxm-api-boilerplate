const constants = Object.freeze({
  consoleMessages: Object.freeze({}),
  modelOutput: Object.freeze({
    USER_NAME_RULES:
      'User Name must be alphanumeric with at least one number, one letter, and be between 6-15 characters in length.',
    EMAIL_RULES: 'Please enter a properly formatted email address.',
    PASSWORD_RULES:
      'Password requires at least 1 lower case character, 1 upper case character, 1 number, 1 special character and must be at least 10 characters in length.',
    REFRESH_ACCOUNT: 'A valid Account ID is required.',
    REFRESH_TOKEN: 'A valid token string is required.',
    REFRESH_EXPIRES: 'A valid expiration date is required.'
  }),
  errorOutput: Object.freeze({
    AUTH_ERROR: 'Authentication was not successful.',
    BAD_REQUEST: 'The request did not contain all required information.',
    FORBIDDEN: 'You are not authorized to perform this operation.',
    INTERNAL:
      'We are experiencing technical difficulties and are working to resolve the issue.',
    MONGOOSE_CAST: 'Mongoose: Cast Error',
    MONGOOSE_DUPLICATE: 'Duplicate field entered.',
    NOT_FOUND: 'The requested resource could not be found.'
  })
});

module.exports = {
  modelOutput: constants.modelOutput,
  errorOutput: constants.errorOutput
};
