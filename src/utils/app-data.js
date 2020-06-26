const { errorOutput, modelOutput } = require('./string-constants');

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
      ACCOUNT: modelOutput.REFRESH_ACCOUNT,
      TOKEN: modelOutput.REFRESH_TOKEN,
      EXPIRES: modelOutput.REFRESH_EXPIRES
    })
  })
});

// Feel free to add some more elaborate error message copy if desired.
// const errors = Object.freeze({
//   AUTH: errorOutput.AUTH_ERROR,
//   BAD_REQUEST: errorOutput.BAD_REQUEST,
//   FORBIDDEN: errorOutput.FORBIDDEN,
//   INTERNAL: errorOutput.INTERNAL,
//   MONGOOSE_CAST: errorOutput.MONGOOSE_CAST,
//   MONGOOSE_DUPLICATE: errorOutput.MONGOOSE_DUPLICATE,
//   NOT_FOUND: errorOutput.NOT_FOUND
// });

module.exports = {
  account: models.ACCOUNT,
  refreshToken: models.REFRESH_TOKEN
};
