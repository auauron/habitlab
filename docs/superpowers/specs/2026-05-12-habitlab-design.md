# HabitLab Design Spec

## Summary

HabitLab is a private, personal habit and reflection app built with TanStack Start, React, Supabase, and Netlify. The product should feel like a premium phone-first daily ritual rather than a generic productivity dashboard.

The app opens to a calm daily check-in where the user completes habits, records mood and energy, and writes a short reflection. Deeper habit management, insights, and journal history support that daily flow without competing with it.

## Goals

- Build a real TanStack Start project that exercises routing, server functions, data loading, mutations, forms, protected routes, and deployment.
- Use Supabase for authentication and persisted personal data.
- Make the app responsive from the start, with phone layouts treated as the primary experience.
- Deliver a modern glassy blue/light-blue "Liquid Calm" interface with premium spacing, depth, and tactile interaction states.
- Keep the first version focused on personal use only.

## Non-Goals

- No social features, teams, followers, sharing, comments, or accountability groups in v1.
- No public habit marketplace or template community in v1.
- No heavy admin dashboard layout.
- No native mobile app in v1; the web app should still feel excellent on phone browsers.

## Target Experience

HabitLab should feel calm, personal, and polished. The UI direction is Liquid Calm: light blue atmospheric backgrounds, translucent glass panels, soft borders, subtle blur, refined shadows, crisp typography, and restrained motion.

Blue should be the product atmosphere, not a single-color wash. Surfaces should remain readable and accessible, with dark ink text, clear focus states, and enough contrast for mobile use.

## Core User Flow

The main daily flow is Today Check-In:

1. The user opens the app and lands on Today.
2. The user sees a greeting, current date, daily progress, and today's habits.
3. The user marks habits complete, skipped, or leaves them pending.
4. The user records mood and energy.
5. The user writes a short reflection from a gentle prompt.
6. The app saves the check-in and shows progress feedback.

This flow is the product spine. Other screens should support it.

## Routes

- `/` redirects to `/today` for authenticated users and shows a polished welcome/auth entry for guests.
- `/today` is the main daily check-in screen.
- `/habits` manages habit creation, editing, frequency, color/icon, and archive state.
- `/insights` shows weekly habit completion, streaks, mood trends, and gentle pattern summaries.
- `/journal` lists and filters reflections by date, mood, and habit context.
- `/settings` handles profile, theme preference, account actions, and Supabase sign out.

## App Shell

Mobile uses a bottom tab bar with Today, Habits, Insights, Journal, and Settings. The tab bar should be glassy, thumb-friendly, and fixed near the bottom safe area.

Desktop uses an expanded app shell with a calm side navigation and wider content panels. The desktop experience should still feel like the same product, not a separate admin UI.

## Data Model

Supabase tables should support:

- `profiles`: user profile data connected to Supabase Auth.
- `habits`: user-owned habit definitions.
- `habit_logs`: per-day habit completion state.
- `daily_checkins`: one user-owned daily mood, energy, and reflection record per date.

The v1 journal is built from `daily_checkins`; separate long-form journal entries are intentionally out of scope.

Every exposed user-data table must use Row Level Security. Policies should restrict each user to their own rows using `auth.uid()`.

## Feature Scope For V1

V1 should include:

- Supabase Auth with sign up, sign in, sign out, and protected app routes.
- Today screen with habit completion, mood, energy, and reflection.
- Habit management with create, edit, archive, and frequency fields.
- Journal history based on daily check-ins.
- Insights with completion rate, current streaks, weekly summary, and mood trend.
- Responsive Liquid Calm UI across phone and desktop.
- Netlify-ready deployment configuration and environment variable documentation.
- Supabase hosted project setup via environment variables and SQL migration files.

## Error Handling

- Auth errors should appear inline near the relevant form.
- Save failures should preserve user input and offer retry.
- Empty states should feel calm and specific, especially for new users with no habits.
- Loading states should use skeletons or soft shimmer panels, not blocking full-screen spinners unless the whole app is initializing.

## Testing And Verification

Implementation should include focused tests for:

- Habit completion state calculations.
- Streak and weekly completion helpers.
- Form validation for habit creation and check-ins.
- Route protection behavior where practical.

Manual verification should include:

- Phone viewport layout.
- Desktop viewport layout.
- Auth flow.
- Creating a habit.
- Completing today's check-in.
- Reviewing journal and insights.

## Implementation Defaults

- Auth UI copy should stay calm, concise, and personal.
- V1 insights should use lightweight React/SVG/CSS visuals instead of adding a charting dependency.
- Supabase integration should target a hosted Supabase project configured through environment variables, with SQL migrations checked into the repo.
