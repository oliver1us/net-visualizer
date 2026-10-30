# Net Visualizer Project

This is a [Next.js](https://nextjs.org) application bootstrapped with `create-next-app`, using the App Router.

## Project Structure

- `src/app/` - Application routes and pages (App Router): `layout.tsx`, `page.tsx`, nested route folders, and `globals.css`
- `src/` - All application source code; import via the `@/*` path alias (e.g. `@/app/page`)
- `.agents/rules/` - Rules files for agents (e.g. `ui.md`); read and follow them
- `next.config.ts` - Next.js configuration (Turbopack, Tailwind CSS loader)
- `eslint.config.mjs` - ESLint configuration (`eslint-config-next`)
- `tsconfig.json` - TypeScript configuration (strict mode enabled)
- `public/` - Static assets

## Commands

- Requires Node.js 24 LTS, pinned in `.nvmrc`. Run `nvm use` before working on the project.
- `npm run dev` - Start the development server
- `npm run build` - Create a production build
- `npm run lint` - Run ESLint
- `npm run start` - Start the production server

## Code Standards

- Use TypeScript with strict mode enabled
- This project uses Next.js 16 with React 19 and Tailwind CSS v4 (via Turbopack)
- Follow the Next.js App Router patterns (server components by default)

## UI Rules

- All components must use [shadcn/ui](https://ui.shadcn.com) components. Do not create custom components.
- If no suitable shadcn/ui component is installed, check the shadcn/ui registry for an appropriate component and install it before proceeding.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
