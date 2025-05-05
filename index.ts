import express from 'express';
import authRouter from './routes/auth';
import usersRouter from './routes/users';
import pokedexRouter from './routes/pokedex';
import cors from 'cors';
import pool from './dbPool';
import { userExtractor } from './middleware/userTokenExtractor';
import { errorMiddleware } from './middleware/errorMiddleware';

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
app.use(express.json());

const PORT = 3001;

usersRouter.use(errorMiddleware);
app.use(userExtractor);

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/pokedex', pokedexRouter);

app.get('/api/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});