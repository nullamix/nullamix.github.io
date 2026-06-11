# nullamix.github.io

Personal DevOps and infrastructure blog built with Astro and published at
[nullamix.github.io](https://nullamix.github.io).

This repository is a GitHub User Site. Astro is configured with the production
`site` URL and intentionally has no `base` path.

## Requirements

- Node.js 20 or newer
- npm

## Local Development

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Astro serves the site at `http://localhost:4321` by default.

## Production Build

Run the same validation and static build used in CI:

```bash
npm run build
```

The command runs `astro check` first, then writes the static site to `dist/`.
Preview that output locally with:

```bash
npm run preview
```

## Writing Posts

Posts are Markdown files in `src/content/blog/`. Their frontmatter is validated
by the `blog` content collection in `src/content/config.ts`.

```md
---
title: "Post title"
description: "A specific summary between 20 and 180 characters."
pubDate: 2026-06-11
updatedDate: 2026-06-12
tags: ["docker", "security"]
draft: false
---
```

`updatedDate` is optional. Tags use lowercase, URL-safe names. Draft posts are
excluded from the home page, blog index, tag pages, RSS feed, and generated post
routes. Published posts are sorted by `pubDate` in descending order.

The RSS feed is generated at `/rss.xml`.

## GitHub Pages Deployment

Deployment is defined in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).
On every push to `main`, GitHub Actions:

1. installs the locked dependencies with `npm ci`;
2. runs `npm run build`;
3. uploads `dist/` as the Pages artifact;
4. deploys it with the official GitHub Pages action.

Repository setup:

1. Use a repository named exactly `nullamix.github.io`.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Push the project to the `main` branch.

No custom domain, path prefix, or Astro adapter is required for this User Site.
