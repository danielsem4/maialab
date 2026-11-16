import { z } from "zod";
import { safeHref } from "@/common/utils/safeHref";
import type { IMedia } from "@/common/types/Media";
import type { IMember, IMemberInput, IMemberLinks } from "@/common/types/Member";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const mediaSchema = z.custom<IMedia>((value) => typeof value === "object" && value !== null && "id" in value);

const linkSchema = z
  .string()
  .trim()
  .max(500, "validation.tooLong")
  .refine((v) => v === "" || safeHref(v) !== undefined, "validation.invalidUrl");

export const LINK_KEYS = ["website", "scholar", "linkedin", "github"] as const;

export const memberFormSchema = z.object({
  name: z.string().trim().min(1, "validation.required").max(150, "validation.tooLong"),
  title: z.string().trim().max(200, "validation.tooLong"),
  bio: z.string().max(20000, "validation.tooLong"),
  email: z
    .string()
    .trim()
    .max(200, "validation.tooLong")
    .refine((v) => v === "" || EMAIL_PATTERN.test(v), "validation.invalidEmail"),
  category: z.enum(["PI", "STAFF", "PHD", "MSC", "BSC", "ALUMNI"]),
  photo: mediaSchema.nullable(),
  published: z.boolean(),
  links: z.object({ website: linkSchema, scholar: linkSchema, linkedin: linkSchema, github: linkSchema }),
});

export type MemberFormValues = z.infer<typeof memberFormSchema>;

export const EMPTY_MEMBER_FORM: MemberFormValues = {
  name: "",
  title: "",
  bio: "",
  email: "",
  category: "STAFF",
  photo: null,
  published: true,
  links: { website: "", scholar: "", linkedin: "", github: "" },
};

export function memberToForm(member: IMember): MemberFormValues {
  return {
    name: member.name,
    title: member.title,
    bio: member.bio,
    email: member.email ?? "",
    category: member.category,
    photo: member.photo,
    published: member.published,
    links: {
      website: member.links.website ?? "",
      scholar: member.links.scholar ?? "",
      linkedin: member.links.linkedin ?? "",
      github: member.links.github ?? "",
    },
  };
}

export function formToMemberInput(values: MemberFormValues): IMemberInput {
  const links: IMemberLinks = {};
  for (const key of LINK_KEYS) {
    const value = values.links[key].trim();
    if (value) links[key] = value;
  }
  return {
    name: values.name.trim(),
    title: values.title.trim(),
    bio: values.bio,
    email: values.email.trim() || null,
    links,
    photoMediaId: values.photo?.id ?? null,
    category: values.category,
    published: values.published,
  };
}
