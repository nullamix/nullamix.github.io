export function GET(context: { site?: URL }) {
  const site = context.site ?? new URL('https://nullamix.ir');

  return new Response(
    `User-agent: *
Allow: /

Sitemap: ${new URL('/sitemap.xml', site).toString()}
`,
    {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8'
      }
    }
  );
}
