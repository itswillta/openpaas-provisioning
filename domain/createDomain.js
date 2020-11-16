require('dotenv').config();
const ora = require('ora');
const fetch = require('node-fetch');
const checkFetchStatus = require('../common/checkFetchStatus');
const getOPUrl = require('../common/getOPUrl');
const { getBasicAuthHeader } = require('../common/auth');
const { getDomainNameFromEmail } = require('../common/domain');

module.exports = async function createDomain(domainAdminEmail, domainAdminPassword) {
  const domainName = getDomainNameFromEmail(domainAdminEmail);

  const spinner = ora(`[CLI] Trying to create domain: ${domainName}...`);

  const fetchOptions = {
    method: 'POST',
    body: JSON.stringify({
      name: domainName,
      company_name: domainName,
      administrator: { 
        email: domainAdminEmail,
        password: domainAdminPassword || 'secret'
      }
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization = getBasicAuthHeader(process.env.PLATFORM_ADMIN_USERNAME, process.env.PLATFORM_ADMIN_PASSWORD)
    }
  };

  try {
    const res = await fetch(`${getOPUrl()}/api/domains`, fetchOptions);

    checkFetchStatus(res);

    spinner.succeed(`[CLI] Successfully created domain: ${domainName}.`)
  } catch (err) {
    spinner.fail(`[CLI] Something went wrong while creating domain: ${domainName}.`);
    console.error(err);
  }
}
