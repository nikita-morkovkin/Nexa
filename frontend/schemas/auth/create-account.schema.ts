import { z } from 'zod';

export const createAccountSchema = z.object({
  username: z
    .string()
    .min(3, '*Минимум 3 символа')
    .regex(/^[A-Za-z0-9_]+$/, '*Только латиница, цифры и нижнее подчеркивание'),
  email: z.email('*Некорректная почта'),
  password: z.string().min(8, '*Минимум 8 символов'),
});

export type TypeCreateAccountSchema = z.infer<typeof createAccountSchema>;
