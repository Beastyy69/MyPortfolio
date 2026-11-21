import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

/* ─────────────────────────────────────────────────────────────
   SEO helper. Set VITE_SITE_URL to the live domain (for example in
   Render → Environment: VITE_SITE_URL=https://harshitshaw.com) and the
   build fills in the canonical link, Open Graph / Twitter URLs and the
   JSON‑LD url, and writes robots.txt + sitemap.xml. Without it, those
   absolute URLs are left out (relative ones still work) and robots.txt
   is written without a sitemap line.
   ───────────────────────────────────────────────────────────── */
function seo(siteUrl) {
  const url = (siteUrl || '').replace(/\/+$/, '');
  const today = new Date().toISOString().slice(0, 10);
  const needsAbsolute = /rel="canonical"|property="og:url"/;
  return {
    name: 'portfolio-seo',
    // runs before Vite parses the HTML, so the placeholder never reaches its URL checks
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        if (url) return html.replaceAll('%SITE_URL%', url);
        // no domain configured: drop the tags that need an absolute URL, keep the rest
        return html
          .split(/\r?\n/)
          .filter((line) => !(line.includes('%SITE_URL%') && needsAbsolute.test(line)))
          .join('\n')
          .replaceAll('%SITE_URL%', '');
      },
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n${url ? `\nSitemap: ${url}/sitemap.xml\n` : ''}`,
      });
      if (url) {
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${url}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n`,
        });
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), seo(env.VITE_SITE_URL)],
    server: { port: 5173 },
  };
});
