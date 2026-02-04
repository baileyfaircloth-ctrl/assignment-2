// healthReader.test.js
const fs = require('fs').promises;
const path = require('path');
const { healthMetricsCounter } = require('./healthReader');

const TEST_JSON_PATH = path.join(__dirname, 'data', 'health-metrics.json');

describe('healthMetricsCounter', () => {
  test('reads valid JSON and counts entries', async () => {
    const result = await healthMetricsCounter(TEST_JSON_PATH);
    expect(result).toHaveProperty('totalEntries');
    expect(typeof result.totalEntries).toBe('number');
    expect(result.totalEntries).toBeGreaterThan(0);
  });

  test('throws helpful error when file is missing', async () => {
    await expect(
      healthMetricsCounter('./data/does-not-exist.json')
    ).rejects.toThrow('Health file not found');
  });

  test('throws helpful error when JSON is invalid', async () => {
    const invalidPath = path.join(__dirname, 'data', 'invalid-health.json');
    await fs.writeFile(invalidPath, '{not valid json}', 'utf-8');

    await expect(healthMetricsCounter(invalidPath)).rejects.toThrow(
      'Health file contains invalid JSON'
    );

    await fs.unlink(invalidPath);
  });
});
