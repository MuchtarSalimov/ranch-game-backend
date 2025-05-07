import { paramsQuery } from "../dbPool";

async function getAvailablePokeballs (userId: number) {
  const activityRows = await paramsQuery(`
    SELECT activity_timestamp
    FROM catch_activity
    WHERE userid = $1
    AND activity_timestamp >= NOW() - INTERVAL '1 hour'
    ORDER BY activity_timestamp DESC
    LIMIT 3
    `, [userId]);

  return Math.max(0, 3 - activityRows.length);
}

export default {
  getAvailablePokeballs
};