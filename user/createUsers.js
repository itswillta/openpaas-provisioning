const path = require('path');
const fetch = require('node-fetch');
const ora = require('ora');
const { createObjectCsvWriter } = require('csv-writer');

const getOPUrl = require('../common/getOPUrl');
const checkFetchStatus = require('../common/checkFetchStatus');
const getUser = require('./getUser');
const { getDomainNameFromEmail } = require('../common/domain');
const { getBasicAuthHeader } = require('../common/auth');
const { getFormattedDateTimeForFilename } = require('../common/datetime');
const sleep = require('../common/sleep');

function createUser(index, domain, domainAdminUsername, domainAdminPassword) {
  const username = `user${index}@${domain.name}`;
  const fetchOptions = {
    method: 'POST',
    body: JSON.stringify({
      firstname: `Doe${index}`,
      lastname: 'John',
      accounts: [
        {
          type: 'email',
          preferredEmailIndex: 0,
          emails: [username],
          hosted: false,
        },
      ],
      domains: [{ domain_id: domain._id }],
      password: 'secret',
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: getBasicAuthHeader(domainAdminUsername, domainAdminPassword),
    },
  };

  return fetch(`${getOPUrl()}/api/domains/${domain._id}/members`, fetchOptions)
    .then(checkFetchStatus)
    .then(() => {
      return { username, password: 'secret ' };
    })
    .catch((err) => {
      console.error(`Something went wrong while creating user ${username}`, err);

      throw err;
    });
}

function generateCsv(users) {
  const csvFilename = `users-${getFormattedDateTimeForFilename(new Date())}.csv`;
  const csvWriter = createObjectCsvWriter({
    path: path.resolve('output', csvFilename),
    header: [
      { id: 'username', title: 'username' },
      { id: 'password', title: 'password' },
    ],
  });

  const spinner = ora(`[CLI] Trying to generate .csv file...`).start();

  csvWriter
    .writeRecords(users)
    .then(() => {
      spinner.succeed(`[CLI] Successfully generated .csv file at ${path.resolve('output', csvFilename)}.`);
    })
    .catch((err) => {
      spinner.fail('[CLI] Failed to generate users.csv file.');
      console.error(err);
    });
}

module.exports = async function createUsers(
  numOfUsers,
  domainAdminUsername,
  domainAdminPassword = 'secret'
) {
  let domain;
  const numberOfUsers = Number(numOfUsers);
  let createdUsers = [];

  if (Number.isNaN(numberOfUsers) || numberOfUsers <= 0) {
    throw new Error(`Invalid number of users: ${numOfUsers}`);
  }

  const spinner = ora(
    `[CLI] Trying to create ${numOfUsers} users using domain admin ${domainAdminUsername}...`
  ).start();

  try {
    const domainAdmin = await getUser(domainAdminUsername, domainAdminPassword);

    domain = {
      _id: domainAdmin.domains[0].domain_id,
      name: getDomainNameFromEmail(domainAdminUsername),
    };

    const numOfUsersInOneBatch = 100;
    const numOfBatches = Math.ceil(numberOfUsers / numOfUsersInOneBatch);

    for (let currentBatchIndex = 0; currentBatchIndex < numOfBatches; currentBatchIndex++) {
      const createUserPromises = [];

      for (
        let currentNumOfUsers = numOfUsersInOneBatch * currentBatchIndex;
        currentNumOfUsers < numOfUsersInOneBatch * (currentBatchIndex + 1) &&
        currentNumOfUsers < numberOfUsers;
        currentNumOfUsers++
      ) {
        createUserPromises.push(createUser(currentNumOfUsers, domain, domainAdminUsername, domainAdminPassword));
      }

      const users = await Promise.all(createUserPromises);

      createdUsers = [...createdUsers, ...users];

      spinner.start(`[CLI] Trying to create ${numOfUsers} users using domain admin ${domainAdminUsername}, ${createdUsers.length} created...`)

      await sleep(2000);
    }

    spinner.succeed(`[CLI] Successfully created ${createdUsers.length} users in domain ${domain.name}!`);

    generateCsv(createdUsers);
  } catch (err) {
    spinner.fail('[CLI] Something went wrong while creating users.');
    console.error(err);
  }
};
