import z from 'zod';

export const changeStreamSchema = z.object({
  
});

export type TypeChangeStreamSchema = z.infer<typeof changeStreamSchema>;
