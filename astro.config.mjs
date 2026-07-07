// @ts-check
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

// Vercel serves the site at '/', GitHub Pages serves it under '/Escape-Room/'.
// The default (Vercel + local dev) is '/'; override for the Pages build with:
//   BASE_PATH=/Escape-Room/ npm run build
const base = process.env.BASE_PATH || '/';

const publicDir = new URL('./public/', import.meta.url);

// Static hosts (Vercel, GitHub Pages) resolve "/foo/" to "/foo/index.html" and
// "/" to "/index.html". Astro's dev server does not, so the verbatim dashboard
// and games living in public/ would 404 under `astro dev`. This dev-only
// middleware restores that resolution — but only when a matching public/ file
// exists, so real Astro page routes (e.g. /astro-check/) are left alone.
/** @returns {import('astro').AstroIntegration} */
function devPublicDirectoryIndex() {
  return {
    name: 'dev-public-directory-index',
    hooks: {
      'astro:server:setup': ({ server }) => {
        server.middlewares.use((req, _res, next) => {
          const url = req.url || '';
          const [path, query] = url.split('?');
          if (path.endsWith('/')) {
            const candidate = fileURLToPath(new URL('.' + path + 'index.html', publicDir));
            if (existsSync(candidate)) {
              req.url = path + 'index.html' + (query ? '?' + query : '');
            }
          }
          next();
        });
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://daniel-lamb.github.io',
  base,
  output: 'static',
  integrations: [react(), devPublicDirectoryIndex()],

  vite: {
    plugins: [tailwindcss()],
  },
});
