const constants = {
  models: {
    account: {
      MODEL_NAME: 'Account',
      USER_NAME_RULES:
        'User Name must be alphanumeric with at least one number, one letter, and be between 6-15 character in length.',
      PASSWORD_RULES:
        'Password requires at least 1 lower case character, 1 upper case character, 1 number, 1 special character and must be at least 10 characters in length.'
    }
  }
};

module.exports = constants;
