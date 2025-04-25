import { z } from 'zod';

export const LoginSchema = z.object({
  username: z.string(),
  passwordHash: z.string(),
});