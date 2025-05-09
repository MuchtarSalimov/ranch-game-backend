import * as dotenv from "dotenv";
import { Pool, QueryResultRow } from 'pg';
dotenv.config({ path: __dirname + '/.env' });

const connectionString = process.env.NEON_OWNER_CONNECTION_STRING;

export let pool = new Pool({ connectionString });

const initialDelay = 1000;
const maxDelay = 10_000_000;

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function *backoff() {
  let sleep = initialDelay;
  do {
    yield sleep;
    sleep = Math.min(maxDelay, randomBetween(initialDelay, sleep * 2));
  } while (true);
}

async function reconnect(error: Error){
  for (const nextDelay of backoff()) {
    try {
      if (error instanceof Error) {
        console.log('connection issue: ', error.stack);
        pool = new Pool({ connectionString });
        console.log('tried to reconnect!');
      } else {
        console.log('connection issue: unknown');
      }
    } catch {
      await new Promise(res => setTimeout(res, nextDelay));
    }
  }
}


pool.on('error', function(error: Error, client) {
  try {
    if (client) { client.release(); }
    // try to reconnect pool
    ( async () => await reconnect(error) )().catch(err=> console.log(err));
  } catch (err) {
    console.log('error: ', err);
  }
});

export async function simpleQuery<T extends QueryResultRow>(query: string): Promise<T[]> {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query<T>(query);
    return result.rows;
  } catch (err) {
    console.error(`Error running query: ${err}`);
    return [];
  } finally {
    if (client) {
      client.release();
    }
  }
}

export async function paramsQuery<T extends QueryResultRow>(query: string, params: unknown[]): Promise<T[]> {
  let client;
  try {
    client = await pool.connect();
    const { rows: result } = await client.query<T>(query, params);
    return result;
  } catch (err) {
    console.error(`Error running query: ${err}`);
    return [];
  } finally {
    if (client) {
      client.release();
    }
  }
}

export default pool;