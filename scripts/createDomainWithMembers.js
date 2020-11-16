const getArgs = require("../common/getArgs");
const createDomain = require("../domain/createDomain");
const createUsers = require("../user/createUsers");

async function createDomainWithMembers() {
  const { domainAdminEmail, domainAdminPassword, numOfUsers = 100 } = { domainAdminPassword: 'secret', ...getArgs() };

  await createDomain(domainAdminEmail, domainAdminPassword);
  await createUsers(Number(numOfUsers), domainAdminEmail, domainAdminPassword);
}

createDomainWithMembers();
