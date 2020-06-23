const chalk = require('chalk');

/**
 * @description     Outputs simple summary to clearly denote the Application, Environment,
 *                  Versioning, and Connection information when the API is started.
 */
const logServerHeader = () => {
  console.log(
    `${chalk.black.bgYellowBright(`\n ${process.env.APP_NAME} `)}${chalk.bgBlue(
      ` ${process.env.NODE_ENV} `
    )} \n${chalk.blackBright(`api version: ${process.env.API_VERSION}`)}`
  );

  console.log(
    `${chalk.green('Listening')} on port: ${chalk.blueBright(process.env.PORT)}`
  );
};

const logDatabaseConnection = host => {
  console.log(
    `${chalk.green('Connected')} to MongoDB Atlas: ${chalk.blueBright(host)}`
  );
};

const logError = err => {
  console.log(`${chalk.bgRed(' ERROR ')} ${err.message}`);
};

module.exports = { logServerHeader, logError, logDatabaseConnection };
