# BrightMind

A learning platform for children aged 10 to 12 that builds reading, writing, focus and problem-solving skills, with a PIN-protected dashboard for parents.

Built with Next.js 16, React 19, TypeScript and Tailwind CSS 4. No backend: progress is stored in the browser (`localStorage`).

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm run start
```

## What is inside

| Area | Activities |
| --- | --- |
| Reading | 5 passages (science and story) with a word box, read-aloud, reading-speed tracking, and questions on detail, vocabulary, inference and main idea |
| Writing | 8 prompts (story, describe, explain, opinion) with a plan, draft, polish workflow, automatic readability checks, a craft checklist, and autosaved drafts. Spelling Studio with spoken words and memory tricks |
| Focus | Focus Sprint (real task timer that counts tab-leaving and self-reported lapses), Memory Sequence (up to 10 levels), Target Hunt (b/d, p/q style look-alikes) |
| Thinking | Pattern Lab (adaptive, generated sequences), Riddle Rooms (10 logic puzzles with 3 hint levels), Code Cracker (deduction game) |
| Progress | Player profiles, XP and levels, daily practice trail, streaks |
| Parents | PIN lock, weekly minutes chart, per-skill level and trend, reading speed, recent activity, daily goal, JSON backup, delete player |

## Project layout

```
src/
  app/                 routes (read, write, focus, think, parent, profiles)
  components/          Shell, UI kit, ResultCard, and one folder per skill area
  lib/
    store.ts           localStorage-backed store (useSyncExternalStore)
    skills.ts          levels, streaks, skill summaries, recommendations
    patterns.ts        number-sequence generator
    writingCheck.ts    readability checks for the writing studio
    content/           passages, writing prompts, spelling words, riddles
```

## Adding content

- New reading passage: add an object to `src/lib/content/passages.ts`.
- New writing prompt or spelling word: `src/lib/content/writing.ts`.
- New riddle: `src/lib/content/riddles.ts`.

Each file's types describe exactly what is needed. Pages and static routes pick new entries up automatically.

## Design notes

- Colour carries meaning: grape is reading, coral is writing, mint is focus, sun is thinking.
- Keyboard focus is visible everywhere, motion respects `prefers-reduced-motion`, and quiz feedback is announced to screen readers.
- Scores are practice feedback, not a diagnosis. Writing scores measure length, planning, self-checks and sentence mechanics, not the quality of ideas.

## Known limits and next steps

- Data lives on one device. Add accounts and a database (for example Postgres with Auth.js) to sync across devices and let several parents or teachers see the same child.
- The parent PIN is a simple lock stored in the browser, not security.
- Read-aloud and spelling audio use the browser's built-in speech voices, which vary by device.
- Content is a starter set. More passages across difficulty levels is the highest-value addition.
