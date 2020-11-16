module.exports = function sleep(ms) {
  return Promise.resolve(resolve => {
    setTimeout(() => resolve(), ms);
  });
}
