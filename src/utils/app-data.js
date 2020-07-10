const { modelOutput } = require('./string-constants');

const environments = Object.freeze({
  PROD: 'PRODUCTION',
  TEST: 'TESTING',
  DEV: 'DEVELOPMENT'
});

const patterns = Object.freeze({
  USER_NAME: /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{6,15})$/,
  EMAIL: /^.+@[^\.].*\.[a-z]{2,}$/,
  PASSWORD: /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{10,})/,
  PHONE: /^\+(?:[0-9] ?){6,14}[0-9]$/
});

const models = Object.freeze({
  ACCOUNT: Object.freeze({
    MODEL_NAME: 'Account',
    fields: Object.freeze({
      USER_NAME: Object.freeze({
        PATTERN: patterns.USER_NAME,
        RULES: modelOutput.USER_NAME_RULES
      }),
      EMAIL: Object.freeze({
        PATTERN: patterns.EMAIL,
        RULES: modelOutput.EMAIL_RULES
      }),
      PASSWORD: Object.freeze({
        PATTERN: patterns.PASSWORD,
        RULES: modelOutput.PASSWORD_RULES
      })
    })
  }),
  REFRESH_TOKEN: Object.freeze({
    MODEL_NAME: 'RefreshToken',
    fields: Object.freeze({
      ACCOUNT: modelOutput.ACCOUNT_REQ,
      TOKEN: modelOutput.TOKEN_REQ,
      EXPIRES: modelOutput.EXPIRES_REQ
    })
  })
});

module.exports = {
  account: models.ACCOUNT,
  refreshToken: models.REFRESH_TOKEN,
  environments,
  patterns
};
