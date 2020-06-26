const { constants } = require('./string-constants');

const models = Object.freeze({
  ACCOUNT: Object.freeze({
    MODEL_NAME: 'Account',
    fields: Object.freeze({
      USER_NAME: Object.freeze({
        PATTERN: /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{6,15})$/,
        RULES: constants.USER_NAME_RULES
      }),
      EMAIL: Object.freeze({
        PATTERN: /^.+@[^\.].*\.[a-z]{2,}$/,
        RULES: constants.EMAIL_RULES
      }),
      PASSWORD: Object.freeze({
        PATTERN: /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{10,})/,
        RULES: constants.PASSWORD_RULES
      })
    })
  }),
  REFRESH_TOKEN: Object.freeze({
    MODEL_NAME: 'RefreshToken',
    fields: Object.freeze({
      ACCOUNT: constants.REFRESH_ACCOUNT,
      TOKEN: constants.REFRESH_TOKEN,
      EXPIRES: constants.REFRESH_EXPIRES
    })
  })
});

// Feel free to add some more elaborate error message copy if desired.
const errors = Object.freeze({
  AUTH: constants.AUTH_ERROR,
  BAD_REQUEST: constants.BAD_REQUEST,
  FORBIDDEN: constants.FORBIDDEN,
  INTERNAL: constants.INTERNAL,
  MONGOOSE_CAST: constants.MONGOOSE_CAST,
  MONGOOSE_DUPLICATE: constants.MONGOOSE_DUPLICATE,
  NOT_FOUND: constants.NOT_FOUND
});

module.exports = {
  account: models.ACCOUNT,
  refreshToken: models.REFRESH_TOKEN,
  errors
};
