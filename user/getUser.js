const fetch = require('node-fetch');
const { getBasicAuthHeader } = require('../common/auth');
const getOPUrl = require('../common/getOPUrl');
const checkFetchStatus = require('../common/checkFetchStatus');

module.exports = function getUser(username, password) {
  const fetchOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getBasicAuthHeader(username.trim(), password.trim())
    }
  };

  return fetch(`${getOPUrl()}/api/user`, fetchOptions)
    .then(checkFetchStatus)
    .then(res => res.json());
};
