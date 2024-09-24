# Application Overview

The application built with:

- `vite` + `typescript` -> development productivity
- `biome` -> fast linter and formatter
- `@playwright/test` -> e2e test
- `tailwindcss` + `tailwindcss-animate` + `tailwind-merge` + `class-variance-authority` -> easy styling
- `@formkit/auto-animate` -> automate transition animation when component mount/unmount
- `@iconify/react` -> SVG icon on demand
- `react-aria` + `react-aria-components` + `react-stately` + `sonner` -> accessible and robust unstyled UI components
- `zod` -> runtime schema validation
- `ts-pattern` -> better pattern matching
- `ky` + `@tanstack/react-query` -> server state manager + data fetching
- `react-hook-form` -> form manager
- `zustand` -> global state manager
- `type-fest` -> type helpers
- `@rifandani/nxact-yutiriti` -> object/array/string helpers
- `@internationalized/date` -> date helpers
- `vite-plugin-pwa` + `@vite-pwa/assets-generator` + `@rollup/plugin-replace` + `https-localhost` + `workbox-core` + `workbox-precaching` + `workbox-routing` + `workbox-window` -> Progressive Web App (PWA)


# Get Started

```bash
# rename the example env files
cp .env.development.example .env.development
cp .env.staging.example .env.staging
cp .env.production.example .env.production

# install dependencies
bun
```

# Development

```bash
# start the development server
bun dev
```