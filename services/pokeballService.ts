import { paramsQuery } from "../dbPool";

async function getAvailablePokeballs (userId: number) {
  const activityRows = await paramsQuery(`
    SELECT activity_timestamp
    FROM catch_activity
    WHERE userid = $1
    AND activity_timestamp >= NOW() - INTERVAL '2 hour'
    ORDER BY activity_timestamp DESC
    LIMIT 3
    `, [userId]);
  // TO DO: turn off this fountain of pokeballs from testing. set to 3 - count
  return Math.max(0, 6 - activityRows.length);
}

export default {
  getAvailablePokeballs
};