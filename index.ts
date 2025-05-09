
import express from 'express';
import authRouter from './routes/auth';
import usersRouter from './routes/users';
import pokedexRouter from './routes/pokedex';
import cors from 'cors';
import pool from './dbPool';
import { userExtractor } from './middleware/userTokenExtractor';
import { errorMiddleware } from './middleware/errorMiddleware';
import * as dotenv from "dotenv";
import path from "path";

if (process.env.NODE_ENV === 'production'){
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
} else {
  dotenv.config({ path: path.resolve(__dirname, '.env') });
}

console.log(__dirname);

async function testClient() {
  const client = await pool.connect();
  const result = await client.query('SELECT version()');
  const version = result.rows[0] as string;
  console.log(`Connected to PostgreSQL database successfully. version: ${JSON.stringify(version)}`);
  client.release();
}

testClient().catch(error=>{
  console.log(`error connecting to database${error}`);
});

const app = express();
app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
app.use((_req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'none'");
  next();
});

const PORT = process.env.PORT || 10000;

usersRouter.use(errorMiddleware);
app.use(userExtractor);

app.get('/', (_req, res) => {
  res.redirect('/index.html');
});
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/pokedex', pokedexRouter);

app.get('/api/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.get('/*', (_req, res) => {
  res.redirect('/index.html');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});