# HabitLab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the TanStack Start starter with HabitLab, a premium phone-first personal habit and reflection app using a glassy light-blue Liquid Calm UI.

**Architecture:** Build the app in two layers: pure habit/check-in domain logic with tests, then React route UI that consumes demo data through focused components. Add Supabase schema/client scaffolding after the main experience is functional so backend wiring has clear interfaces.

**Tech Stack:** TanStack Start, TanStack Router, React 19, TypeScript, Tailwind CSS v4, Vitest, lucide-react, Supabase, Netlify/Nitro.

---

## File Structure

- `src/features/habitlab/types.ts`: shared HabitLab domain types.
- `src/features/habitlab/demoData.ts`: local demo user, habits, logs, and check-ins for the first UI pass.
- `src/features/habitlab/domain.ts`: pure helpers for dates, habit status, progress, streaks, and weekly summaries.
- `src/features/habitlab/domain.test.ts`: Vitest tests for core helpers.
- `src/features/habitlab/components/AppShell.tsx`: responsive app chrome with mobile bottom navigation and desktop side navigation.
- `src/features/habitlab/components/GlassCard.tsx`: reusable glass panel wrapper.
- `src/features/habitlab/components/TodayView.tsx`: main daily check-in screen.
- `src/features/habitlab/components/HabitsView.tsx`: habit management screen.
- `src/features/habitlab/components/InsightsView.tsx`: insights and lightweight chart screen.
- `src/features/habitlab/components/JournalView.tsx`: daily reflection history.
- `src/features/habitlab/components/SettingsView.tsx`: personal settings and Supabase readiness panel.
- `src/routes/index.tsx`: guest/welcome entry that links to Today.
- `src/routes/today.tsx`, `src/routes/habits.tsx`, `src/routes/insights.tsx`, `src/routes/journal.tsx`, `src/routes/settings.tsx`: app routes.
- `src/routes/about.tsx`: either removed or replaced with product context.
- `src/routes/__root.tsx`: app metadata, document shell, no starter header/footer.
- `src/components/Header.tsx`, `src/components/Footer.tsx`: no longer used by root shell after app shell migration.
- `src/styles.css`: replace starter visual tokens with Liquid Calm blue glass design system.
- `supabase/migrations/202605120001_habitlab_schema.sql`: hosted Supabase schema and RLS policies.
- `.env.example`: required public Supabase environment variables.
- `netlify.toml`: Netlify build command and TanStack Start deployment notes.
- `README.md`: HabitLab setup, local dev, Supabase, and Netlify deployment.

---

### Task 1: Domain Logic With Tests

**Files:**
- Create: `src/features/habitlab/types.ts`
- Create: `src/features/habitlab/domain.ts`
- Create: `src/features/habitlab/domain.test.ts`
- Modify: `package.json`

- [ ] **Step 1: Add test script that has a real baseline**

Update `package.json` scripts:

```json
"test": "vitest run src/features/habitlab/domain.test.ts"
```

- [ ] **Step 2: Write failing tests**

Create `src/features/habitlab/domain.test.ts` with tests for `getTodayHabitRows`, `calculateCompletionPercent`, `calculateCurrentStreak`, and `buildWeeklySummary`. Expected first run: fails because modules do not exist.

- [ ] **Step 3: Run the failing tests**

Run: `npm test`

Expected: FAIL with module resolution errors for `./domain`.

- [ ] **Step 4: Implement domain types and helpers**

Create `types.ts` and `domain.ts` with minimal pure implementations for the tests.

- [ ] **Step 5: Verify tests pass**

Run: `npm test`

Expected: PASS for all domain tests.

---

### Task 2: Liquid Calm App Shell

**Files:**
- Create: `src/features/habitlab/components/GlassCard.tsx`
- Create: `src/features/habitlab/components/AppShell.tsx`
- Modify: `src/routes/__root.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Replace starter shell**

Remove starter `Header` and `Footer` from `__root.tsx`, set title to `HabitLab`, and keep `HeadContent`, `Scripts`, and devtools.

- [ ] **Step 2: Add reusable glass card**

Create `GlassCard` as a small wrapper that applies `glass-card` classes and accepts `className`.

- [ ] **Step 3: Add app navigation shell**

Create `AppShell` with nav items: Today, Habits, Insights, Journal, Settings. Use lucide icons. Mobile gets fixed bottom navigation; desktop gets a left rail.

- [ ] **Step 4: Replace CSS tokens**

Replace the existing green starter theme with blue/light-blue Liquid Calm tokens and responsive shell utilities.

- [ ] **Step 5: Build check**

Run: `npm run build`

Expected: PASS or actionable TypeScript errors to fix before continuing.

---

### Task 3: Today Route

**Files:**
- Create: `src/features/habitlab/demoData.ts`
- Create: `src/features/habitlab/components/TodayView.tsx`
- Modify: `src/routes/index.tsx`
- Create: `src/routes/today.tsx`

- [ ] **Step 1: Add demo data**

Create realistic demo habits, logs, and a daily check-in for the current product shape.

- [ ] **Step 2: Build Today UI**

Create `TodayView` with greeting, date, progress ring, habit check cards, mood/energy selector, reflection prompt, and calm completion state.

- [ ] **Step 3: Wire routes**

Make `/today` render `TodayView` inside `AppShell`. Make `/` a polished welcome/entry screen with a link to `/today`.

- [ ] **Step 4: Verify**

Run: `npm run build`

Expected: PASS.

---

### Task 4: Supporting Screens

**Files:**
- Create: `src/features/habitlab/components/HabitsView.tsx`
- Create: `src/features/habitlab/components/InsightsView.tsx`
- Create: `src/features/habitlab/components/JournalView.tsx`
- Create: `src/features/habitlab/components/SettingsView.tsx`
- Create: `src/routes/habits.tsx`
- Create: `src/routes/insights.tsx`
- Create: `src/routes/journal.tsx`
- Create: `src/routes/settings.tsx`

- [ ] **Step 1: Add Habits screen**

Show habit cards, frequencies, streaks, tags, and a glassy create-habit panel mock.

- [ ] **Step 2: Add Insights screen**

Use pure CSS/SVG bars and summary cards for completion, streaks, and mood trend.

- [ ] **Step 3: Add Journal screen**

Show daily reflections from demo check-ins with mood and habit context.

- [ ] **Step 4: Add Settings screen**

Show profile, theme preference, Supabase status, and account actions placeholder.

- [ ] **Step 5: Verify**

Run: `npm run build`

Expected: PASS.

---

### Task 5: Supabase And Deployment Scaffolding

**Files:**
- Create: `supabase/migrations/202605120001_habitlab_schema.sql`
- Create: `src/lib/supabase.ts`
- Create: `.env.example`
- Create: `netlify.toml`
- Modify: `package.json`
- Modify: `README.md`
- Modify: `vite.config.ts`

- [ ] **Step 1: Install Supabase client**

Run: `npm install @supabase/supabase-js`

- [ ] **Step 2: Add Supabase browser client**

Create `src/lib/supabase.ts` using `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.

- [ ] **Step 3: Add SQL migration**

Create `profiles`, `habits`, `habit_logs`, and `daily_checkins` tables with RLS enabled and owner-only policies. Avoid service-role exposure and do not put security-definer functions in exposed schemas.

- [ ] **Step 4: Add Netlify config**

Set Netlify build command to `npm run build`; configure Nitro preset if required by current TanStack/Netlify setup.

- [ ] **Step 5: Document setup**

Update README with local dev, env vars, Supabase SQL migration, and Netlify deployment instructions.

- [ ] **Step 6: Verify**

Run: `npm test` and `npm run build`

Expected: PASS.

---

## Self-Review

- Spec coverage: Today flow, mobile-first Liquid Calm UI, routes, Supabase schema/RLS, Netlify setup, and tests all map to tasks.
- Placeholder scan: No TBD/TODO/fill-in placeholders; route and file names are explicit.
- Type consistency: Domain type names are centralized in Task 1 and reused by later UI tasks.
