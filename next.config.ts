import type { NextConfig } from 'next';
const githubPages = process.env.TONY_GITHUB_PAGES === 'true';
// Web básica is published apart from the original site, under its own sub-path. TONY_PAGES_BASE overrides it:
// empty or unset keeps '/TonySportBasica', '/' publishes at the domain root. Same rule in scripts/prepare-pages.mjs.
function pagesBase(value = process.env.TONY_PAGES_BASE): string {
  const raw = value?.trim();
  if (!raw) return '/TonySportBasica';
  const path = raw.replace(/^\/+|\/+$/g, '');
  if (!/^[\w.~-]+(\/[\w.~-]+)*$/.test(path) && path !== '') throw new Error(`TONY_PAGES_BASE no es una ruta válida: "${value}".`);
  return path ? `/${path}` : '';
}
const basePath = pagesBase();
if(process.env.NEXT_PUBLIC_TONY_AUTH_ENABLED==='true'&&!process.env.NEXT_PUBLIC_TONY_API_BASE)throw new Error('Account login requires NEXT_PUBLIC_TONY_API_BASE. Configure PHP email before enabling accounts.');
const nextConfig: NextConfig = {
  poweredByHeader: false,
  devIndicators: false,
  ...(githubPages ? { output: 'export' as const, basePath, trailingSlash: true } : {}),
  env: { TONY_ASSET_BASE: githubPages ? basePath : '' },
  images: { qualities: [75,85,90], ...(githubPages ? { unoptimized: true } : {}) },
};
export default nextConfig;
