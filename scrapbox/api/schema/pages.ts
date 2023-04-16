import { z } from "zod";

export const pagesSchema = z.object({
  projectName: z.string(),
  skip: z.number(),
  limit: z.number(),
  count: z.number(),
  pages: z
    .object({
      id: z.string(),
      title: z.string(),
      image: z.string().nullable(),
      descriptions: z.array(z.string()),
      user: z.object({ id: z.string() }),
      pin: z.number(),
      views: z.number(),
      linked: z.number(),
      commitId: z.string().optional(),
      created: z.number(),
      updated: z.number(),
      accessed: z.number(),
      snapshotCreated: z.number().nullable(),
      pageRank: z.number(),
    })
    .array(),
});
