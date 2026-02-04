// workoutReader.test.js
const path = require('path');
const fs = require('fs').promises;
const { workoutCalculator } = require('./workoutReader');

const TEST_CSV_PATH = path.join(__dirname, 'data', 'workouts.csv');

describe('workoutCalculator', () => {
  test('reads valid CSV and returns totals', async () => {
    const result = await workoutCalculator(TEST_CSV_PATH);
    expect(result).toHaveProperty('totalWorkouts');
    expect(result).toHaveProperty('totalMinutes');
    expect(typeof result.totalWorkouts).toBe('number');
    expect(typeof result.totalMinutes).toBe('number');
    expect(result.totalWorkouts).toBeGreaterThan(0);
  });

  test('throws helpful error when file is missing', async () => {
    await expect(
      workoutCalculator('./data/missing-workouts.csv')
    ).rejects.toThrow('Workout file not found');
  });

  test('works when CSV has zero workouts', async () => {
    const emptyPath = path.join(__dirname, 'data', 'empty-workouts.csv');
    await fs.writeFile(emptyPath, 'minutes\n', 'utf-8');

    const result = await workoutCalculator(emptyPath);
    expect(result.totalWorkouts).toBe(0);
    expect(result.totalMinutes).toBe(0);

    await fs.unlink(emptyPath);
  });
});
// Test your workoutReader.js module here
