import { Request, Response, NextFunction } from "express";
import { LoginSchema } from "../utils";

export const newUserParser = (req: Request, _res: Response, next: NextFunction) => { 
  try {
    LoginSchema.parse(req.body);
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