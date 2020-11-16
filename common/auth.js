const getBasicAuthHeader = (username, password) => `Basic ${Buffer.from(username + ':' + password).toString('base64')}`;

module.exports = {
  getBasicAuthHeader
};
