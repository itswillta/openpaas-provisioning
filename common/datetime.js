function getFormattedDateTimeForFilename(dateObject) {
  const y = dateObject.getFullYear();
  const m = dateObject.getMonth() + 1;
  const d = dateObject.getDate();
  const h = dateObject.getHours();
  const mi = dateObject.getMinutes();
  const s = dateObject.getSeconds();

  return y + "-" + m + "-" + d + "-" + h + "-" + mi + "-" + s;
}

module.exports = {
  getFormattedDateTimeForFilename
};
