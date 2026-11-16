import { z } from "zod";
import type { IMedia } from "@/common/types/Media";
import type { ILabInfo, ILabInfoInput } from "@/common/types/LabInfo";

const mediaSchema = z.custom<IMedia>((value) => typeof value === "object" && value !== null && "id" in value);

const optionalUrl = z
  .string()
  .trim()
  .max(500, "validation.tooLong")
  .refine((v) => v === "" || /^https?:\/\/\S+$/i.test(v), "validation.invalidUrl");

const optionalEmail = z
  .string()
  .trim()
  .max(200, "validation.tooLong")
  .refine((v) => v === "" || z.email().safeParse(v).success, "validation.invalidEmail");

export const SOCIAL_KEYS = ["website", "github", "linkedin", "twitter", "youtube"] as const;

export const labInfoFormSchema = z.object({
  name: z.string().trim().min(1, "validation.required").max(150, "validation.tooLong"),
  tagline: z.string().max(300, "validation.tooLong"),
  about: z.string().max(20000, "validation.tooLong"),
  mission: z.string().max(10000, "validation.tooLong"),
  contactEmail: optionalEmail,
  address: z.string().max(500, "validation.tooLong"),
  mapUrl: optionalUrl,
  socialLinks: z.object({
    website: optionalUrl,
    github: optionalUrl,
    linkedin: optionalUrl,
    twitter: optionalUrl,
    youtube: optionalUrl,
  }),
  logo: mediaSchema.nullable(),
  hero: mediaSchema.nullable(),
});

export type LabInfoFormValues = z.infer<typeof labInfoFormSchema>;

export const EMPTY_LAB_INFO_FORM: LabInfoFormValues = {
  name: "",
  tagline: "",
  about: "",
  mission: "",
  contactEmail: "",
  address: "",
  mapUrl: "",
  socialLinks: { website: "", github: "", linkedin: "", twitter: "", youtube: "" },
  logo: null,
  hero: null,
};

export function labInfoToForm(info: ILabInfo | null): LabInfoFormValues {
  if (!info) return EMPTY_LAB_INFO_FORM;
  const links = info.socialLinks ?? {};
  return {
    name: info.name,
    tagline: info.tagline,
    about: info.about,
    mission: info.mission,
    contactEmail: info.contactEmail,
    address: info.address,
    mapUrl: info.mapUrl,
    socialLinks: {
      website: links.website ?? "",
      github: links.github ?? "",
      linkedin: links.linkedin ?? "",
      twitter: links.twitter ?? "",
      youtube: links.youtube ?? "",
    },
    logo: info.logo,
    hero: info.hero,
  };
}

export function formToLabInfoInput(values: LabInfoFormValues): ILabInfoInput {
  const socialLinks = Object.fromEntries(
    SOCIAL_KEYS.map((key) => [key, values.socialLinks[key].trim()]).filter(([, url]) => url !== ""),
  );
  return {
    name: values.name.trim(),
    tagline: values.tagline.trim(),
    about: values.about,
    mission: values.mission,
    contactEmail: values.contactEmail.trim(),
    address: values.address.trim(),
    mapUrl: values.mapUrl.trim(),
    socialLinks,
    logoMediaId: values.logo?.id ?? null,
    heroMediaId: values.hero?.id ?? null,
  };
}
