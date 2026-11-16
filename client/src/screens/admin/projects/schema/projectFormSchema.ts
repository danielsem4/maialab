import { z } from "zod";
import type { IMedia } from "@/common/types/Media";
import type { IProject, IProjectInput } from "@/common/types/Project";
import { SLUG_PATTERN } from "@/common/utils/slugify";
import { fromDateInputValue, toDateInputValue } from "@/common/utils/formatDate";

const mediaSchema = z.custom<IMedia>((value) => typeof value === "object" && value !== null && "id" in value);

export const projectFormSchema = z
  .object({
    title: z.string().trim().min(1, "validation.required").max(200, "validation.tooLong"),
    slug: z
      .string()
      .trim()
      .max(80, "validation.tooLong")
      .refine((v) => v === "" || SLUG_PATTERN.test(v), "validation.invalidSlug"),
    summary: z.string().max(1000, "validation.tooLong"),
    description: z.string().max(50000, "validation.tooLong"),
    status: z.enum(["ACTIVE", "COMPLETED", "PLANNED"]),
    tagsText: z.string().max(800, "validation.tooLong"),
    startDate: z.string(),
    endDate: z.string(),
    cover: mediaSchema.nullable(),
    featured: z.boolean(),
    published: z.boolean(),
    images: z.array(z.object({ media: mediaSchema, caption: z.string().max(300, "validation.tooLong") })),
    members: z.array(z.object({ memberId: z.number(), role: z.string().max(100, "validation.tooLong") })),
  })
  .refine((v) => !v.startDate || !v.endDate || v.endDate >= v.startDate, {
    message: "validation.endBeforeStart",
    path: ["endDate"],
  });

export type ProjectFormValues = z.infer<typeof projectFormSchema>;

export const EMPTY_PROJECT_FORM: ProjectFormValues = {
  title: "",
  slug: "",
  summary: "",
  description: "",
  status: "ACTIVE",
  tagsText: "",
  startDate: "",
  endDate: "",
  cover: null,
  featured: false,
  published: false,
  images: [],
  members: [],
};

export function projectToForm(project: IProject): ProjectFormValues {
  return {
    title: project.title,
    slug: project.slug,
    summary: project.summary,
    description: project.description,
    status: project.status,
    tagsText: project.tags.join(", "),
    startDate: toDateInputValue(project.startDate),
    endDate: toDateInputValue(project.endDate),
    cover: project.cover,
    featured: project.featured,
    published: project.published,
    images: project.images.map((img) => ({ media: img.media, caption: img.caption })),
    members: project.members.map((m) => ({ memberId: m.memberId, role: m.role })),
  };
}

export function formToProjectInput(values: ProjectFormValues): IProjectInput {
  return {
    title: values.title.trim(),
    slug: values.slug.trim() || undefined,
    summary: values.summary,
    description: values.description,
    status: values.status,
    tags: values.tagsText
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    startDate: fromDateInputValue(values.startDate),
    endDate: fromDateInputValue(values.endDate),
    coverMediaId: values.cover?.id ?? null,
    featured: values.featured,
    published: values.published,
    images: values.images.map((img) => ({ mediaId: img.media.id, caption: img.caption })),
    members: values.members,
  };
}
