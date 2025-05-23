import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as dotenv from "dotenv";
import { UserPublic } from "../types/User";
import { RequestWithAuth } from '../types/RequestWithAuth';
dotenv.config({ path: __dirname + '/.env' });

const getTokenFrom = (request: Request) => {

  const authorization = request.get('authorization');

  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '');
  }
  return null;
};

// const tokenExtractor = (request: RequestWithAuth, _response: Response, next: NextFunction) => {
//   const token = getTokenFrom(request) as string;
//   const secret =  process.env.SECRET;
//   if (token && secret) {
//     const decodedToken = jwt.verify(token, secret) as string | null;
  
//     request.token = decodedToken || null;
  
//     next();
//   }
// };

export const userExtractor = (req: RequestWithAuth, _res: Response, next: NextFunction) => { 
  const secret =  process.env.SECRET;
  const token = getTokenFrom(req);

  if ( token && secret ) {
    try{
      const decodedToken = jwt.verify(token, secret) as UserPublic | null;
      req.userid = decodedToken?.userid;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(`error: ${error.message}`, ' token: ', token);
      } else {
        console.log('error: unknownerror, token: ', token);
      }
    }
  }
  next();
};

