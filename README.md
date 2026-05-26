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

## How it works

The game logic is a pure, framework-free engine (`src/engine`) — state, card eligibility, event
chains, and the "danger" scalar — covered by Vitest and fully separate from the React UI. Cards are
plain data (`src/data/cards.ts`), so adding content needs no engine changes. Screen, danger, and
choice previews are all *derived* from state rather than stored, which keeps the render path simple.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS · Framer Motion · Vitest

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # engine test suite
npm run build    # type-check + production build
```
