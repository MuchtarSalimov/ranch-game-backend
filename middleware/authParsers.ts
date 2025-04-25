import { Request, Response, NextFunction } from "express";
import { LoginSchema, NewUserSchema } from "../utils";

export const newUserParser = (req: Request, _res: Response, next: NextFunction) => { 
  try {
    NewUserSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

export const loginParser = (req: Request, _res: Response, next: NextFunction) => { 
  try {
    LoginSchema.parse({
      userId: req.params.userId,
      passwordHash: req.params.passwordHash,
    });
    next();
  } catch (error: unknown) {
    next(error);
  }
};