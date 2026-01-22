import { z } from 'zod';

export const changePasswordUserSchema = z.object({
  oldPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

export type TypeChangePasswordUserSchema = z.infer<
  typeof changePasswordUserSchema
>;
