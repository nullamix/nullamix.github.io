import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://nullamix.ir',
  markdown: {
    shikiConfig: {
      theme: 'github-dark'
    }
  }
});
