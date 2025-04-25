import { z } from "zod";
import { LoginSchema, NewUserSchema } from "../utils";

export type User = {
  id: string;
  name: string;
  passwordHash: string;
  email: string;
  verified: boolean;
};

export type UserPublic = Omit<User, "passwordHash"| "email" | "verified">;

export type NewUser = z.infer<typeof NewUserSchema>;

export type Login = z.infer<typeof LoginSchema>;