# Term

A Reigns-style swipe game of political survival. You're the president; each turn one person
brings one question and two answers. Swipe — or use ← / → — to decide. Keep **Approval,
Treasury, Military, and Media** all between 0 and 100; hit either extreme and your term ends.

**▶ [Play it live](https://tenure-delta.vercel.app/)**

## Features

- A danger-reactive atmosphere that intensifies as you near collapse
- Event chains and state-triggered cards (a small quality-based narrative)
- Succession, lifetime achievements, and a one-time contingency shield
- A pure, unit-tested game engine kept separate from the React UI

## Stack

React 19 · TypeScript · Vite · Tailwind CSS · Framer Motion · Vitest

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # engine test suite
npm run build    # type-check + production build
```
