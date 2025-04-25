import { Login, User } from "../types/User";
import { pool } from "../dbPool";

export async function createUser(newUser: Login) {
  const client = await pool.connect();
  try {
    const result = await client.query<User>(`INSERT INTO users (username, "passwordHash") VALUES ($1, $2) RETURNING *`, [
      newUser.username,
      newUser.passwordHash,
    ]);
    return result.rows;
  } catch (err) {
    console.error(`Error running query: ${err}`);
    return [];
  } finally {
    client.release();
  }
}

export function login(username: string, passwordHash: string) {
  console.log(username, passwordHash);
  const token = "blah";
  return token;
}

export default {
  createUser,
  login,
};