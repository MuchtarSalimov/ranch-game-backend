import { z } from 'zod';

export const NewUserSchema = z.object({
  username: z.string(),
  passwordHash: z.string(),
  email: z.string(),
});

export const LoginSchema = z.object({
  username: z.string(),
  passwordHash: z.string(),
});