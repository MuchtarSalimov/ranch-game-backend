import * as dotenv from "dotenv";
import { Pool, QueryResultRow } from 'pg';

dotenv.config({ path: __dirname + '/.env' });

export const pool = new Pool({
  connectionString: process.env.NEON_DEVELOPMENT_OWNER_CONNECTION_STRING,
});

export async function simpleQuery<T extends QueryResultRow>(query: string): Promise<T[]> {
  const client = await pool.connect();
  try {
    const result = await client.query<T>(query);
    return result.rows;
  } catch (err) {
    console.error(`Error running query: ${err}`);
    return [];
  } finally {
    client.release();
  }
}

export async function paramsQuery<T extends QueryResultRow>(query: string, params: unknown[]): Promise<T[]> {
  const client = await pool.connect();
  try {
    const { rows: result } = await client.query<T>(query, params);

    return result;
  } catch (err) {
    console.error(`Error running query: ${err}`);
    return [];
  } finally {
    client.release();
  }
}

export default pool;