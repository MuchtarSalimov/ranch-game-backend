import { Login, User } from "../types/User";
import { pool } from "../dbPool";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + '/.env' });

const SALT_ROUNDS = 10;
const SECRET = process.env.SECRET as string;

const genericNewUserFail = { result: false, message: 'user could not be created'};

export async function createUser(newUser: Login) {
  const client = await pool.connect();
  try {
    if (!newUser.username && newUser.username.length < 3) {
      return { result: false, message: 'username must be at least 3 charactrs'};
    } else if (!newUser.password && newUser.username.length < 5) {
      return { result: false, message: 'password must be at least 5 charactrs'};
    }

    const result = await client.query<User>(`INSERT INTO users (username, "passwordHash") VALUES ($1, $2) RETURNING *`, [
      newUser.username,
      await bcrypt.hash(newUser.password, SALT_ROUNDS),
    ]);
    if (result.rows.length === 1) {
      return {
        result: true,
        message: `user ${newUser.username} created`
      };
    }
    return genericNewUserFail;
  } catch (err) {
    console.error(`Error running query: ${err}`);
    if (err instanceof Error && err?.message.match(/duplicate key value violates unique constraint/)) {
      return { result: false, message: 'user already exists' };
    } else {
      return genericNewUserFail;
    }
  } finally {
    client.release();
  }
}

export async function login(user: Login) {
  const {username, password} = user;
  console.log('username', username, 'password', password);
  const client = await pool.connect();
  const  { rows: userRows } = await client.query<User>(`SELECT * FROM USERS users WHERE username = $1`, [
    username,
  ]);

  if (userRows.length === 1) {
    const isSuccess = userRows[0] === null ? false : await bcrypt.compare(password, userRows[0].passwordHash);
    const userForToken = {
      username,
      userid: userRows[0].userid,
    };
    const token = jwt.sign(userForToken, SECRET);
    const loginResult = isSuccess ? {
      username,
      userid: userRows[0].userid,
      token
    } : null;
    return loginResult;
  }
  return null;
}

export default {
  createUser,
  login,
};