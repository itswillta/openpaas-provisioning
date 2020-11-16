const getArgs = require('../common/getArgs');
const path = require('path');
const ora = require('ora');
const _ = require('lodash');
const { readCsv } = require('../common/csv');
const generateRandomEvents = require('../event/generateRandomEvents');
const sleep = require('../common/sleep');

async function generateRandomEventsForUsers() {
  const { csvFilename, minNumOfEvents = 2, maxNumOfEvents = 5 } = getArgs();
  const csvFilePath = path.resolve('output', csvFilename);
  const spinner = ora(`[CLI] Trying to read user accounts from ${csvFilePath}...`).start();

  try {
    if (minNumOfEvents > maxNumOfEvents) throw new Error(`The min number of events must not be greater than the max number of events`);

    const userAccounts = await readCsv(csvFilePath);

    const numOfUsersInOneBatch = 10;
    const numOfBatches = Math.ceil(userAccounts.length / numOfUsersInOneBatch);

    let currentUserIndex;

    spinner.start(`[CLI] Trying to generate random events for ${userAccounts.length} users...`)

    for (let currentBatchIndex = 0; currentBatchIndex < numOfBatches; currentBatchIndex++) {
      const generateRandomEventsPromises = [];

      for (
        currentUserIndex = numOfUsersInOneBatch * currentBatchIndex;
        currentUserIndex < numOfUsersInOneBatch * (currentBatchIndex + 1) && currentUserIndex < userAccounts.length;
        currentUserIndex++
      ) {
        generateRandomEventsPromises.push(
          generateRandomEvents({
            numOfEvents: _.random(minNumOfEvents, maxNumOfEvents),
            username: userAccounts[currentUserIndex].username.trim(),
            password: userAccounts[currentUserIndex].password.trim(),
          })
        );
      }

      await Promise.all(generateRandomEventsPromises);

      spinner.start(
        `[CLI] Trying to create random events for ${userAccounts.length} users. Events for ${currentUserIndex} users have been created...`
      );

      await sleep(2000);
    }

    spinner.succeed(`[CLI] Successfully created random events for users!`);
  } catch (err) {
    spinner.fail(`[CLI] Failed to create random events for the users!`);
    console.error(err);
  }
}

generateRandomEventsForUsers();
