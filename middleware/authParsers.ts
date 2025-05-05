import { Request, Response, NextFunction } from "express";
import { LoginSchema } from "../utils";

export const loginInfoParser = (req: Request, _res: Response, next: NextFunction) => { 
  try {
    LoginSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};