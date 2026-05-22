---
type: noodle
key: press
slug: press
title: Press
excerpt: A nod to the launch press cycle around npmx — newspaper textures, gaffer tape, and a logo that looks like it survived a week of front-page coverage.
date: '2026-05-01'
dateTo: '2026-05-04'
timezone: auto
tagline: false
gallery:
  - /extra/npmx-light-press.png
  - /extra/npmx-dark-press.png
  - /extra/npmx-sticker.png
  - /extra/npmx-cute.svg
authors:
  - name: Alex Savelyev
    blueskyHandle: alexdln.com
  - name: Willow (GHOST)
    blueskyHandle: willow.sh
  - name: James
    blueskyHandle: 43081j.com
---

## The brief

For the npmx launch week we wanted a noodle that felt like it had **already** been
covered — as if you'd flipped past it in three different newspapers on the same morning.
Less "logo on a page", more "logo that survived the press cycle".

The constraints were tight: it had to read at favicon size, hold up against the existing
mono wordmark, and be obviously _temporary_. Noodles are not redesigns.

## Decisions

A few things we locked early:

- **Newsprint texture, not a newspaper illustration.** A real halftone scan layered behind
  the wordmark, not a clip-art front page.
- **Gaffer tape, not duct tape.** Slightly cleaner edges, a tiny red accent — closer to a
  press kit than a moving sale.
- **Keep the logo readable.** The wordmark sits on a small "clearzone" patch so the texture
  never eats the letters, even at 24px.

## Process

The first round leaned too hard into the "cute" direction — too soft, not enough chaos.
We pivoted into a stamp aesthetic, then layered in the press elements (tape, halftone,
slight rotation) over two iterations.

By v0.3 we had the structure right. The shipped version (v1.0) added the colored
"sticker" treatment so it pops in the header without competing with the search bar.

## What we kept out

We tried a "BREAKING" chyron, a fake byline, and a tilted clipping. All cut. Each one
pushed the noodle from _playful nod_ into _editorial set piece_, which is a different
project.
