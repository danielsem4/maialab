import { z } from "zod";
import type { IMedia } from "@/common/types/Media";
import type { INewsPost, INewsPostInput } from "@/common/types/NewsPost";
import { SLUG_PATTERN } from "@/common/utils/slugify";
import { fromDateInputValue, toDateInputValue } from "@/common/utils/formatDate";

const mediaSchema = z.custom<IMedia>((value) => typeof value === "object" && value !== null && "id" in value);

export const newsFormSchema = z.object({
  title: z.string().trim().min(1, "validation.required").max(200, "validation.tooLong"),
  slug: z
    .string()
    .trim()
    .max(80, "validation.tooLong")
    .refine((v) => v === "" || SLUG_PATTERN.test(v), "validation.invalidSlug"),
  date: z.string().min(1, "validation.required"),
  cover: mediaSchema.nullable(),
  body: z.string().max(50000, "validation.tooLong"),
  published: z.boolean(),
});

export type NewsFormValues = z.infer<typeof newsFormSchema>;

export function emptyNewsForm(): NewsFormValues {
  return {
    title: "",
    slug: "",
    date: toDateInputValue(new Date().toISOString()),
    cover: null,
    body: "",
    published: false,
  };
}

export function newsToForm(post: INewsPost): NewsFormValues {
  return {
    title: post.title,
    slug: post.slug,
    date: toDateInputValue(post.date),
    cover: post.cover,
    body: post.body,
    published: post.published,
  };
}

export function formToNewsInput(values: NewsFormValues): INewsPostInput {
  return {
    title: values.title.trim(),
    slug: values.slug.trim() || undefined,
    date: fromDateInputValue(values.date) ?? new Date().toISOString(),
    coverMediaId: values.cover?.id ?? null,
    body: values.body,
    published: values.published,
  };
}
