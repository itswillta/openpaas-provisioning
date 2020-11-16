const csv = require('csv-parser');
const fs = require('fs');

function readCsv(csvFilePath) {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', data => results.push(data))
      .on('end', () => {
        resolve(results);
      })
      .on('error', reject);
  });
}

module.exports = {
  readCsv
};
