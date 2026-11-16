import { z } from "zod";
import { safeHref } from "@/common/utils/safeHref";
import type { IMedia } from "@/common/types/Media";
import type { IPublication, IPublicationInput } from "@/common/types/Publication";


export const NO_PROJECT = "none";

const mediaSchema = z.custom<IMedia>((value) => typeof value === "object" && value !== null && "id" in value);

export const publicationFormSchema = z.object({
  title: z.string().trim().min(1, "validation.required").max(300, "validation.tooLong"),
  authors: z.string().trim().min(1, "validation.required").max(1000, "validation.tooLong"),
  venue: z.string().trim().max(300, "validation.tooLong"),
  year: z
    .number({ error: "validation.invalidYear" })
    .int("validation.invalidYear")
    .min(1950, "validation.invalidYear")
    .max(2100, "validation.invalidYear"),
  url: z
    .string()
    .trim()
    .max(1000, "validation.tooLong")
    .refine((v) => v === "" || safeHref(v) !== undefined, "validation.invalidUrl"),
  pdf: mediaSchema.nullable(),
  projectId: z.string(),
  published: z.boolean(),
});

export type PublicationFormValues = z.infer<typeof publicationFormSchema>;

export function emptyPublicationForm(): PublicationFormValues {
  return {
    title: "",
    authors: "",
    venue: "",
    year: new Date().getFullYear(),
    url: "",
    pdf: null,
    projectId: NO_PROJECT,
    published: true,
  };
}

export function publicationToForm(publication: IPublication): PublicationFormValues {
  return {
    title: publication.title,
    authors: publication.authors,
    venue: publication.venue,
    year: publication.year,
    url: publication.url ?? "",
    pdf: publication.pdf,
    projectId: publication.projectId ? String(publication.projectId) : NO_PROJECT,
    published: publication.published,
  };
}

export function formToPublicationInput(values: PublicationFormValues): IPublicationInput {
  return {
    title: values.title.trim(),
    authors: values.authors.trim(),
    venue: values.venue.trim(),
    year: values.year,
    url: values.url.trim() || null,
    pdfMediaId: values.pdf?.id ?? null,
    projectId: values.projectId === NO_PROJECT ? null : Number(values.projectId),
    published: values.published,
  };
}
