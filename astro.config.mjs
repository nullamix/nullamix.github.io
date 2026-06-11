import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://nullamix.github.io',
  markdown: {
    shikiConfig: {
      theme: 'github-dark'
    }
  }
});
