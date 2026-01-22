import { z } from 'zod';

export const changeEmailUserSchema = z.object({
  email: z.email({ error: '*Введите корректный адрес электронной почты' }),
});

export type TypeChangeEmailUserSchema = z.infer<typeof changeEmailUserSchema>;
