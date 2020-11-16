module.exports = function checkFetchStatus(res) {
  if (res.ok) return res;

  return res.json()
    .then(json => {
      throw new Error(`${res.status} ${res.statusText}: ${json.error.details}`)
    }).catch(() => {
      throw new Error(`${res.status} ${res.statusText}`);
    });
}
