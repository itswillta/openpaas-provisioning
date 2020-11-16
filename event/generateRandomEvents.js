const ora = require('ora');
const client = require('esn-calendar-client');
const { generateFakeEvents } = require('./lib/eventGenerator');
const getOPUrl = require('../common/getOPUrl');
const getUser = require('../user/getUser');
const { getDomainNameFromEmail } = require('../common/domain');

module.exports = async function generateRandomEvents({ numOfEvents, username, password }) {
  const user = await getUser(username, password);
  const organizer = { email: user.preferredEmail, cn: user.displayName };

  const events = generateFakeEvents({
    numOfEvents,
    organizer,
    domainName: getDomainNameFromEmail(user.preferredEmail)
  });

  await init();

  await createEvents();

  function init() {
    // get the list of calendars to be sure that they are initialized first
    return client({ auth: { username, password }, baseURL: getOPUrl() }).calendars.list();
  }

  function createEvents() {
    return Promise.all(events.map(createEvent));
  }

  async function createEvent(event) {
    await client({ auth: { username, password }, baseURL: getOPUrl() }).calendars.get(user.id).create(event);
  }
};
