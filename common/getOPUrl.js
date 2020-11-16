module.exports = function getOPUrl() {
  return process.env.OPENPAAS_URL || 'http://localhost:8080';
}
