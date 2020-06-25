const models = Object.freeze({
  ACCOUNT: Object.freeze({
    MODEL_NAME: 'Account',
    fields: Object.freeze({
      USER_NAME: Object.freeze({
        PATTERN: /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{6,15})$/,
        RULES:
          'User Name must be alphanumeric with at least one number, one letter, and be between 6-15 characters in length.'
      }),
      EMAIL: Object.freeze({
        PATTERN: /^.+@[^\.].*\.[a-z]{2,}$/,
        RULES: 'Please enter a properly formatted email address.'
      }),
      PASSWORD: Object.freeze({
        PATTERN: /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{10,})/,
        RULES:
          'Password requires at least 1 lower case character, 1 upper case character, 1 number, 1 special character and must be at least 10 characters in length.'
      })
    })
  }),
  REFRESH_TOKEN: Object.freeze({
    MODEL_NAME: 'RefreshToken',
    fields: Object.freeze({
      ACCOUNT: 'A valid Account ID is required.',
      TOKEN: 'A valid token string is required.',
      EXPIRES: 'A valid expiration date is required.'
    })
  })
});

// Feel free to add some more elaborate error message copy if desired.
const errors = Object.freeze({
  AUTH: 'Authentication was not successful.',
  BAD_REQUEST: 'The request did not contain all required information.',
  DETAILS: '\nAdditional Details: ',
  FORBIDDEN: 'You are not authorized to perform this operation.',
  INTERNAL:
    'We are experiencing technical difficulties and are working to resolve the issue.',
  MONGOOSE_CAST: 'Mongoose: Cast Error',
  MONGOOSE_DUPLICATE: 'Duplicate field entered.',
  NOT_FOUND: 'The requested resource could not be found.'
});

module.exports = {
  account: models.ACCOUNT,
  refreshToken: models.REFRESH_TOKEN,
  errors
};
