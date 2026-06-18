import { getCollection } from 'astro:content';

const staticPages = ['/', '/notes/', '/projects/'];

function toSitemapUrl(site: URL, path: string, updated?: Date) {
  const lastmod = updated ? `\n    <lastmod>${updated.toISOString()}</lastmod>` : '';

  return `  <url>
    <loc>${new URL(path, site).toString()}</loc>${lastmod}
  </url>`;
}

export async function GET(context: { site?: URL }) {
  const site = context.site ?? new URL('https://nullamix.ir');
  const posts = (await getCollection('blog', ({ data }) => !data.draft))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  const tags = [...new Set(posts.flatMap((post) => post.data.tags))].sort();
  const urls = [
    ...staticPages.map((path) => toSitemapUrl(site, path)),
    ...posts.map((post) =>
      toSitemapUrl(site, `/notes/${post.id}/`, post.data.updatedDate ?? post.data.pubDate)
    ),
    ...tags.map((tag) => toSitemapUrl(site, `/tags/${tag}/`))
  ];

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`,
    {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8'
      }
    }
  );
}
