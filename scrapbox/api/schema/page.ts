import { z } from "zod";

const linkshopSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    titleLc: z.string(),
    image: z.string().nullable(),
    descriptions: z.array(z.string()),
    linksLc: z.array(z.string()),
    linked: z.number(),
    updated: z.number(),
    accessed: z.number(),
  })
  .array();

export const pageSchema = z.object({
  id: z.string(),
  title: z.string(),
  image: z.string().nullable(),
  descriptions: z.array(z.string()),
  user: z.object({
    id: z.string(),
    name: z.string(),
    displayName: z.string(),
    photo: z.string(),
  }),
  pin: z.number(),
  views: z.number(),
  linked: z.number(),
  commitId: z.string().optional(),
  created: z.number(),
  updated: z.number(),
  accessed: z.number(),
  snapshotCreated: z.number().nullable(),
  pageRank: z.number(),
  lastAccessed: z.null(),
  persistent: z.boolean(),
  lines: z
    .object({
      id: z.string(),
      text: z.string(),
      created: z.number(),
      updated: z.number(),
      userId: z.string(),
    })
    .array(),
  links: z.array(z.string()),
  projectLinks: z.array(z.unknown()),
  icons: z.array(z.unknown()),
  files: z.array(z.unknown()),
  relatedPages: z.object({
    links1hop: linkshopSchema,
    links2hop: linkshopSchema,
    projectLinks1hop: z.array(z.unknown()),
    hasBackLinksOrIcons: z.boolean(),
  }),
  collaborators: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      displayName: z.string(),
      photo: z.string(),
    })
  ),
});

export type Page = z.infer<typeof pageSchema>;
