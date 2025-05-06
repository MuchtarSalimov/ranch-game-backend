import { Request } from "express";

export interface RequestWithAuth extends Request {
  userid?: number;
}