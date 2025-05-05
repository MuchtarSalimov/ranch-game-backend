import { z } from "zod";
import { LoginSchema } from "../utils";

export type User = {
  userid: string;
  name: string;
  passwordHash: string;
};

export type UserPublic = Omit<User, "passwordHash">;

export type Login = z.infer<typeof LoginSchema>;