import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: { site?: URL }) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: 'nullamix',
    description: 'Practical DevOps notes on Linux, containers, CI/CD, security, and observability.',
    site: context.site ?? new URL('https://nullamix.github.io'),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/notes/${post.slug}/`,
      categories: post.data.tags
    })),
    customData: '<language>fa-IR</language>'
  });
}
