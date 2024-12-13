import type { RollupReplaceOptions } from '@rollup/plugin-replace';
import replace from '@rollup/plugin-replace';
import react from '@vitejs/plugin-react-swc';
import autoprefixer from 'autoprefixer';
import process from 'node:process';
import { visualizer } from 'rollup-plugin-visualizer';
import tailwind from 'tailwindcss';
import { defineConfig, type PluginOption } from 'vite';
import type { ManifestOptions, VitePWAOptions } from 'vite-plugin-pwa';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';

const pwaOptions: Partial<VitePWAOptions> = {
  base: '/',
  mode: process.env.SW_DEV === 'true' ? 'development' : 'production',
  includeAssets: ['*.ico', '*.svg', '*.png'],
  manifest: {
    name: 'Trọ đây! - Hệ thống Quản lý Nhà trọ',
    short_name: 'Trọ đây!',
    description: 'Hệ thống Quản lý Nhà trọ',
    theme_color: '#ffffff',
    icons: [
      {
        src: 'pwa-64x64.png',
        sizes: '64x64',
        type: 'image/png',
      },
      {
        src: 'pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: 'maskable-icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    display_override: ['window-controls-overlay'],
  },
  devOptions: {
    enabled: process.env.SW_DEV === 'true',
    type: process.env.SW === 'true' ? 'module' : 'classic',
    navigateFallbackAllowlist: [/^index.html$/],
  },
  workbox: {
    globDirectory: '/dev-dist',
    globPatterns: [
      '**/*.{html,css,js,json,txt,ico,svg,jpg,png,webp,woff,woff2,ttf,eot,otf,wasm}',
    ],
    globIgnores: ['/node_modules/**/*', 'sw.js', 'workbox-*.js'],
  },
};

const claims = process.env.CLAIMS === 'true';
const replaceOptions: RollupReplaceOptions = {
  __DATE__: new Date().toISOString(),
  preventAssignment: true,
};

if (process.env.SW === 'true') {
  pwaOptions.srcDir = 'src';
  pwaOptions.strategies = 'injectManifest';
  pwaOptions.filename = claims ? 'claims-sw.ts' : 'prompt-sw.ts';
  (pwaOptions.manifest as Partial<ManifestOptions>).name =
    'PWA Inject Manifest';
  (pwaOptions.manifest as Partial<ManifestOptions>).short_name = 'PWA Inject';
}

if (claims) pwaOptions.registerType = 'autoUpdate';
if (process.env.SW_DESTROY === 'true') pwaOptions.selfDestroying = true;
if (process.env.RELOAD_SW === 'true') replaceOptions.__RELOAD_SW__ = 'true';

export default defineConfig({
  server: {
    port: 3456,
  },
  preview: {
    port: 3456,
  },
  build: {
    sourcemap: process.env.SOURCE_MAP === 'true',
    rollupOptions: {
      input: {
        main: './index.html',
        'firebase-messaging-sw': './src/firebase-messaging-sw.js',
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === 'firebase-messaging-sw'
            ? '[name].js' // Output service worker in root
            : 'assets/[name]-[hash].js'; // Others in `assets/`
        },
      },
    },
  },
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
  plugins: [
    replace(replaceOptions) as unknown as PluginOption,
    tsconfigPaths({ loose: true }),
    react(),
    visualizer({
      filename: 'html/visualizer-stats.html',
    }) as unknown as PluginOption,
    VitePWA(pwaOptions),
  ],
});
