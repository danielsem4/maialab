import { z } from 'zod';

/** An absolute http(s) URL. Rejects `javascript:`, `data:` and other schemes that are unsafe in an href. */
export const httpUrl = z
  .string()
  .trim()
  .max(1000)
  .refine((value) => {
    try {
      const { protocol } = new URL(value);
      return protocol === 'http:' || protocol === 'https:';
    } catch {
      return false;
    }
  }, 'Links must start with http:// or https://');

/** An http(s) URL or an empty string (field left blank). */
export const optionalHttpUrl = z.union([z.literal(''), httpUrl]);
