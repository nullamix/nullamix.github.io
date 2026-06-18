import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string().trim().min(1).max(120),
    description: z.string().trim().min(20).max(180),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z
      .array(z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/))
      .max(8)
      .default([]),
    language: z.enum(['en', 'fa']).default('en'),
    draft: z.boolean().default(false)
  })
});

export const collections = { blog };
