# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

One static page whose only job is to prove a deploy happened. Push a change, watch it
deploy, see it in a browser — that is the whole product. It is a signal, not an app.

# Rule #1: Keep It Simple, Stupid (KISS)

Every line here is a way for the signal to go red for reasons that have nothing to do
with the deploy chain being tested. Solve the problem that exists now. Before calling
it done: can this be less code?

## Edit this before every push

**`src/version.ts` — the `MARKERS` array.** It is the one thing in this repository you
are meant to change by hand. The page shows the **last** entry; the rest is the record of
previous pushes.

    const MARKERS = [
      '2026-09-17 first light',
      'Canaries got their own tiny oxygen bottles',
      "Bananas are berries; strawberries aren't",
    ] as const

**Append to the end. Never edit or reorder what is already there.**

The whole list is kept for a reason: it is the brief for whoever writes the next one.
Read the existing entries to pick up the register — a short, true, faintly diverting fact
— then add one in that spirit. Choose the subject at random and deliberately far from the
last few entries; if a theme is forming across them, jump somewhere else. Do not repeat a
fact already in the list, and keep it under about 45 characters, because it is set enormous and
a longer line stops being a headline.

Then commit, push, and load the deployed URL to look for the new text. If it is there, the
chain works. That is the test; everything else exists to make it possible.

**When you change the marker, print the new text in bold in your reply**, on its own line,
so the human can see at a glance what to look for on the page. For example:

> Marker is now **Bananas are berries; strawberries aren't**

The commit sha sits beside it on the page, baked in from `$DEPLOY_SHA`. That is what
separates "my edit landed" from "some build landed" — the case where you pushed but forgot
to add a marker.

## Commands

    npm run dev      # local dev server, hot reload
    npm run build    # tsc --noEmit && vite build  →  dist/
    npm start        # serve the built dist/

There are no tests, deliberately. The build *is* the test: `tsc --noEmit` runs first, so
a type error exits non-zero and fails the deploy. That is the build signal being
exercised. Adding a test suite reintroduces exactly the flakiness this repo replaced.

Building by hand has no `$DEPLOY_SHA`, and the page then reads `built by hand` rather
than inventing a sha. To rehearse a real build:

    DEPLOY_SHA=$(git rev-parse HEAD) npm run build

## Architecture

**Node is the toolchain, not a running process.** Vite compiles TypeScript, bundles, and
runs the Tailwind pipeline into `dist/`; a web server serves those files; nothing of ours
runs at request time. A live server would need a process to supervise, a restart path and
a port, and it can be down in ways a static site cannot — none of which serves the goal.
Keep `src/` structured so a `server.ts` *could* be added later, but do not add one.

**Build-time constants, not runtime fetches.** There is no server to ask, so
`vite.config.ts` bakes `__DEPLOY_SHA__` and `__BUILT_AT__` into the bundle via `define`,
declared in `src/vite-env.d.ts`. Anything the page needs to know is compiled in.

**The drain.** `src/main.ts` maps the age of the build to a `--freshness` number on
`:root`; `src/style.css` mixes the canary yellow toward a drained khaki by that amount
(`color-mix`). Full colour for the first hour, fully drained at fourteen days. So a stale
deploy looks stale from across the room, before you have read a word. It never means
"broken" — an old build that is meant to be old simply looks old.

**Dark mode inverts two tokens, not a third palette.** Light is ink on the canary field;
dark is the canary field as type on ink. The drain applies to whichever one carries the
colour.

**Fonts are self-hosted** in `public/fonts/` (OFL 1.1, see `OFL.md` there). The page
fetches nothing at request time from anyone — appropriate for a page whose job is to be
believed.

Dependencies are Vite, TypeScript and Tailwind, plus their plugins and `@types/node`.
Keep it that way.

## Deploying

`npm run build` writes a self-contained static site to `dist/`. Deploying is copying that
directory to wherever it is served from — any web server, any static host. `npm start`
serves the same build locally, and works as the run command on a host that expects one.

Two things a deploy should do:

- **`npm ci`, not `npm install`.** It fails when the lockfile and `package.json`
  disagree, which is a real build failure worth catching.
- **Pass `DEPLOY_SHA`** into the build environment, so the page can show which commit is
  live. Without it the page honestly reads `built by hand`.

A health check against the deployed URL is worth having even for a static site: it is the
difference between "the copy exited 0" and "the page actually answers", which is the only
question this repo exists to settle.

**Confirm a change behaviourally, not by reading config.** Load the page.
