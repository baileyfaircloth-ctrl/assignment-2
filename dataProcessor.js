// dataProcessor.js
require('dotenv').config(); // npm install dotenv [web:9]

const { workoutCalculator } = require('./workoutReader');
const { healthMetricsCounter } = require('./healthReader');

async function processFiles() {
  const userName = process.env.USER_NAME || 'User';
  const weeklyGoalRaw = process.env.WEEKLY_GOAL || '0';
  const weeklyGoal = Number(weeklyGoalRaw);

  console.log(`Processing data for: ${userName}`);
  console.log('📁 Reading workout data...');

  try {
    const workoutData = await workoutCalculator('./data/workouts.csv');
    console.log(`Total workouts: ${workoutData.totalWorkouts}`);
    console.log(`Total minutes: ${workoutData.totalMinutes}`);

    console.log('📁 Reading health data...');
    const healthData = await healthMetricsCounter('./data/health-metrics.json');
    console.log(`Total health entries: ${healthData.totalEntries}`);

    console.log('\n=== SUMMARY ===');
    console.log(`Workouts found: ${workoutData.totalWorkouts}`);
    console.log(`Total workout minutes: ${workoutData.totalMinutes}`);
    console.log(`Health entries found: ${healthData.totalEntries}`);
    console.log(`Weekly goal: ${weeklyGoal} minutes`);

    if (!Number.isNaN(weeklyGoal) && weeklyGoal > 0) {
      if (workoutData.totalMinutes >= weeklyGoal) {
        console.log(`🎉 Congratulations ${userName}! You have exceeded your weekly goal!`);
      } else {
        const remaining = weeklyGoal - workoutData.totalMinutes;
        console.log(
          `💪 Keep going ${userName}! You need ${remaining} more minutes to reach your weekly goal.`
        );
      }
    } else {
      console.log('⚠️ Weekly goal is not set to a valid number.');
    }
  } catch (error) {
    console.error('❌ An error occurred while processing files:');
    console.error(error.message);
  }
}

if (require.main === module) {
  processFiles();
}

module.exports = {
  processFiles,
};
