import express, { Request, Response } from 'express';
import { Login, NewUser } from '../types/User';
import userService from '../services/userService';
import { errorMiddleware } from '../middleware/errorMiddleware';
import { newUserParser, loginParser } from '../middleware/authParsers';

const authRouter = express.Router();

authRouter.post('/auth/signup', newUserParser, (req: Request<unknown, unknown, NewUser>, res: Response) => {
  try {
    const createdUser = userService.createUser(req.body);
    res.json(createdUser);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong :(';
    if (error instanceof Error) {
      errorMessage = 'Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

authRouter.post('/auth/login', loginParser, (req: Request<Login, unknown, unknown>, res: Response) => {
  try {
    const { username, passwordHash} = req.params as unknown as Login;
    const token = userService.login(username, passwordHash);
    res.json(token);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong :(';
    if (error instanceof Error) {
      errorMessage = 'Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

authRouter.use(errorMiddleware);

export default authRouter;