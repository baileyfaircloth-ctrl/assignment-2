// healthReader.js
const fs = require('fs').promises;

async function healthMetricsCounter(path) {
  try {
    const data = await fs.readFile(path, 'utf-8');
    const parsed = JSON.parse(data);

    if (!Array.isArray(parsed)) {
      throw new Error('Health data must be an array');
    }

    const totalEntries = parsed.length;
    return {
      totalEntries,
    };
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Health file not found at path: ${path}`);
    }
    if (error instanceof SyntaxError) {
      throw new Error('Health file contains invalid JSON');
    }
    throw error;
  }
}

module.exports = {
  healthMetricsCounter,
};
