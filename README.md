# HabitLab

HabitLab is a personal habit and reflection app built with TanStack Start, React, Supabase, and Netlify.

The app is currently in its first implementation pass: a polished phone-first demo experience with tested habit domain logic, route structure, Supabase schema scaffolding, and deployment configuration.

## Stack

- TanStack Start + TanStack Router
- React 19
- TypeScript
- Tailwind CSS v4
- Supabase Auth/Postgres
- Netlify
- Vitest

## Local Development

```bash
npm install
npm run dev
```

The dev server runs on:

```txt
http://localhost:3000
```

## Tests

```bash
npm test
```

The current tests cover HabitLab's pure domain helpers for daily habit rows, completion percent, streaks, and weekly summaries.

## Supabase Setup

Create a hosted Supabase project, then copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set:

```txt
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_KEY=your-supabase-publishable-key
```

Apply the schema in:

```txt
supabase/migrations/202605120001_habitlab_schema.sql
```

The migration creates:

- `profiles`
- `habits`
- `habit_logs`
- `daily_checkins`

All user data tables enable Row Level Security and use owner-only policies based on `auth.uid()`.

## Netlify Deployment

This project follows Netlify's current TanStack Start guidance:

- `@netlify/vite-plugin-tanstack-start` in `vite.config.ts`
- `netlify.toml` build command: `npm run build`
- `netlify.toml` publish directory: `dist/client`

Add the same Supabase environment variables in Netlify project settings before deploying.

## Production Build

```bash
npm run build
```

## Notes

HabitLab is intentionally personal-first. There are no social, team, or sharing features in v1.
