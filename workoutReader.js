// workoutReader.js
const fs = require('fs');
const csv = require('csv-parser'); // installed via npm install csv-parser [web:2]

function workoutCalculator(path) {
  return new Promise((resolve, reject) => {
    const results = [];
    let totalMinutes = 0;

    // Check file exists first for nicer error
    fs.access(path, fs.constants.F_OK, (err) => {
      if (err) {
        return reject(new Error(`Workout file not found at path: ${path}`));
      }

      fs.createReadStream(path)
        .on('error', () => {
          reject(new Error('Error reading workout CSV file'));
        })
        .pipe(csv())
        .on('data', (data) => {
          results.push(data);

          // assume there is a "minutes" column; adjust to your actual header
          const minutes = Number(data.minutes);
          if (!Number.isNaN(minutes)) {
            totalMinutes += minutes;
          }
        })
        .on('error', () => {
          reject(new Error('Workout CSV file is corrupted or invalid'));
        })
        .on('end', () => {
          const totalWorkouts = results.length;
          resolve({
            totalWorkouts,
            totalMinutes,
          });
        });
    });
  });
}

module.exports = {
  workoutCalculator,
};
