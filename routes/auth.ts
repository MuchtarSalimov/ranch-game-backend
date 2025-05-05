import express, { Request, RequestHandler, Response } from 'express';
import { Login } from '../types/User';
import userService from '../services/userService';
import { errorMiddleware } from '../middleware/errorMiddleware';
import { loginInfoParser } from '../middleware/authParsers';

const authRouter = express.Router();

authRouter.post('/signup', loginInfoParser, (async (req: Request<unknown, unknown, Login>, res: Response) => {
  try {
    const result = await userService.createUser(req.body);
    if (result.result) {
      res.status(200).send(result.message);
    } else {
      res.status(400).send(result.message);
    }
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong';
    if (error instanceof Error) {
      errorMessage = 'Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
}) as RequestHandler);

authRouter.post('/login', loginInfoParser, (async (req: Request<unknown, unknown, Login>, res: Response) => {
  try {
    const token = await userService.login(req.body);
    if (token) {
      res.json(token);
    } else {
      res.status(400).send('username or password does not match');
    }
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong';
    if (error instanceof Error) {
      errorMessage = 'Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
}) as RequestHandler);

authRouter.use(errorMiddleware);

export default authRouter;