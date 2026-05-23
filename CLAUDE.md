# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Next.js 16 e-commerce storefront** for a seasonal fruit farm selling premium organic mangoes. The application features product selection, mix-box ordering, and dynamic pricing.

## Tech Stack & Versions

- **Next.js**: 16.2.6 (breaking changes from prior versions — see AGENTS.md)
- **React**: 19.2.4
- **TypeScript**: ^5
- **Styling**: Tailwind CSS ^4 with PostCSS
- **Testing**: Jest ^29 with React Testing Library
- **Linting**: ESLint ^9 with Next.js configuration
- **Runtime**: Node.js 22+
- **Backend Services**: Supabase for data/auth, MaxMind GeoIP2 for geolocation

## ⚠️ Critical: Next.js 16 Breaking Changes

**Read AGENTS.md before writing code.** This version has breaking changes to APIs, conventions, and file structure. If unsure about a Next.js feature or pattern, check the docs in `node_modules/next/dist/docs/` before implementing.

## Project Structure

```
app/                      # Next.js app directory (App Router)
├── page.tsx              # Home page (main storefront)
├── layout.tsx            # Root layout with metadata
└── globals.css           # Global Tailwind styles

components/               # React components
├── MangoVarietyGrid.tsx  # Grid display of individual mango varieties
├── MangoCard.tsx         # Card component for mango product
├── MixBoxSelector.tsx    # Component for preset mix-box selections
└── PricingToggle.tsx     # Dynamic pricing calculator for weight-based orders

lib/                      # Utilities and data
├── types.ts              # TypeScript interfaces (MangoVariety, MixBox)
├── mangoes.ts            # Mango variety data and constants
└── mixBoxes.ts           # Mix-box preset data
```

### Architecture Notes

- **Client-side state**: The homepage (`app/page.tsx`) manages selection state for individual mangoes and mix boxes via `useState`
- **Component design**: Components are isolated, reusable, and pass callbacks for parent state updates
- **Data structure**: Product data (mangoes, mix boxes) is defined in `lib/` and imported as constants
- **Styling**: Tailwind utility classes; no CSS modules needed due to modern Tailwind integration
- **External integrations**: Supabase (database/auth) and MaxMind GeoIP2 (geolocation) are configured via environment variables

## Environment Variables

Create a `.env.local` file in the project root with:

```
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_key>
MAXMIND_ACCOUNT_ID=<your_maxmind_account_id>
MAXMIND_LICENSE_KEY=<your_maxmind_license_key>
```

- `NEXT_PUBLIC_*` variables are accessible in the browser; never put secrets in these
- Supabase credentials enable real-time data and authentication
- MaxMind GeoIP2 credentials enable geolocation lookup (used for region-specific pricing or inventory)

## Common Commands

### Development
```bash
npm run dev              # Start Next.js dev server (localhost:3000)
npm run build            # Build for production
npm run start            # Start production server
```

### Testing
```bash
npm test                 # Run Jest tests (all files matching **/*.test.{ts,tsx})
npm run test:watch       # Run tests in watch mode
```

### Code Quality
```bash
npm run lint             # Run ESLint on all files (enforces Next.js config rules)
```

### Running a Single Test
```bash
npm test -- ComponentName.test.tsx   # Run a specific test file
```

## Key Development Patterns

### React 19 with Next.js 16
- Use `'use client'` directive for client components (required for `useState` and event handlers)
- Server components by default in the `app/` directory
- Next.js automatically optimizes image loading and font subsetting

### TypeScript
- `tsconfig.json` includes path alias `@/*` for absolute imports from the root
- All components and utilities use strict type checking (`"strict": true`)

### Styling with Tailwind 4
- PostCSS is configured via `postcss.config.mjs`
- Tailwind classes are applied directly to JSX elements
- Global styles in `app/globals.css`

## Testing Strategy

- Tests should follow the **Jest + React Testing Library** pattern
- Test component interactions, not implementation details
- Use `jest.config.ts` setup (JSdom environment) for testing React components
- Configure additional setup in `jest.setup.ts` if needed (already imports `@testing-library/jest-dom`)

## File Paths & Imports

Always use the `@/` alias for imports:
```tsx
// ✓ Correct
import { MangoVariety } from '@/lib/types';
import { MangoCard } from '@/components/MangoCard';

// ✗ Avoid
import { MangoVariety } from '../lib/types';
```

## ESLint Configuration

- Uses `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- Built-in rules enforce React best practices and Next.js conventions
- Ignores: `.next/`, `out/`, `build/`, `next-env.d.ts`

Run `npm run lint` to check all files.

## External Service Integrations

### Supabase
- Used for database and authentication
- Client initialized via `@supabase/supabase-js`
- Requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`

### MaxMind GeoIP2
- Used for IP-based geolocation (region detection, pricing adjustments)
- Requires account credentials: `MAXMIND_ACCOUNT_ID` and `MAXMIND_LICENSE_KEY`
- May have rate limits or quota restrictions — check MaxMind console if geolocation requests fail

## Package Management

- Use `npm` (not `yarn` or `pnpm`)
- All dependencies are in `package.json`
- Keep dev dependencies (testing, linting, TypeScript types) in `devDependencies`

## Before Writing Code

1. **Check `node_modules/next/dist/docs/`** for Next.js 16 documentation if trying a pattern outside your knowledge.
2. **Verify TypeScript compilation** — strict mode enforces type safety, which prevents runtime errors.
3. **Run tests before committing** — ensure no regressions with `npm test`.
