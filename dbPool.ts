import * as dotenv from "dotenv";
import { Pool, QueryResultRow } from 'pg';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
dotenv.config({ path: __dirname + '/.env' });

export const pool = new Pool({
  connectionString: process.env.NEON_DEVELOPMENT_OWNER_CONNECTION_STRING,
});

export async function simpleQuery<T extends QueryResultRow>(query: string): Promise<T[]> {
  const client = await pool.connect();
  try {
    const result = await client.query<T>(query);
    // console.log('query: ', query, ' result: ', result);
    return result.rows;
  } catch (err) {
    console.error(`Error running query: ${err}`);
    return [];
  } finally {
    client.release();
  }
}

export default pool;