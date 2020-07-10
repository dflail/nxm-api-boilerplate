const { modelOutput } = require('./string-constants');

const environments = Object.freeze({
  PROD: 'PRODUCTION',
  TEST: 'TESTING',
  DEV: 'DEVELOPMENT'
});

const models = Object.freeze({
  ACCOUNT: Object.freeze({
    MODEL_NAME: 'Account',
    fields: Object.freeze({
      USER_NAME: Object.freeze({
        PATTERN: /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{6,15})$/,
        RULES: modelOutput.USER_NAME_RULES
      }),
      EMAIL: Object.freeze({
        PATTERN: /^.+@[^\.].*\.[a-z]{2,}$/,
        RULES: modelOutput.EMAIL_RULES
      }),
      PASSWORD: Object.freeze({
        PATTERN: /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{10,})/,
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
  environments
};
