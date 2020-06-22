const constants = Object.freeze({
  // models: contains mongoose schema specific constants for use in Mongo DB required
  // and validation checks.

  // module.exports are currently set up to export the models individually for ease of use
  // and clarity in their respective ./models.js file, though you could certainly tweak them
  // to export more or less information based on your needs.
  // eg module.exports = constants; would result in exporting ALL constants

  // Releasing subsets of constant data just seemed a more realistic compromise between
  // Object immutability and readability.
  models: Object.freeze({
    ACCOUNT: Object.freeze({
      MODEL_NAME: 'Account',
      fields: Object.freeze({
        USER_NAME: Object.freeze({
          PATTERN: /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{6,15})$/,
          RULES:
            'User Name must be alphanumeric with at least one number, one letter, and be between 6-15 character in length.'
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
    })
  }),
  // Constants utilized throughout the project that are not specific to any specific type of file
  common: Object.freeze({})
});

module.exports = { account: constants.models.ACCOUNT };
