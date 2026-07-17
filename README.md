# COSMORA — Into the Black Hole

A single-page cinematic documentary built with plain HTML, CSS, and JavaScript.

## How it flows now
1. The page opens on a **pure black quote screen** — no nav, no video, no other UI — with the line
   "Every journey has a point of no return." fading in, followed by a single **Start Journey** button.
2. Tapping **Start Journey** starts the background music immediately (inside the click handler, so it
   lands within the browser's user-gesture window and sails past autoplay restrictions), reveals the
   music control top-right, and crossfades into the **looping, muted, fullscreen intro video**.
3. A **Continue →** button fades in 7 seconds after the video begins, while the video keeps looping.
4. Clicking Continue **removes the video element from the DOM entirely** (not hidden, not scrolled past)
   and fades in the documentary. The background music is never touched during this transition, so it
   keeps playing seamlessly throughout.
5. The documentary opens with a centered **COSMORA / by Ayush** title, then the full black-hole story.
6. A small floating circular **music control** sits top-right throughout the video and documentary,
   with a crossfading music-note icon and a tap micro-interaction (scale, slight rotation, soft glow/ripple).

## Structure
```
index.html   — markup for the intro video screen and the documentary
style.css    — full design system (black/white, Inter type, mobile-first, animations)
script.js    — video/Continue flow, background music, scroll reveals, nav, FAQ accordion
assets/
  videos/black-hole-intro.mp4       — 13s, muted, looping intro (add your file here)
  audio/background-music.mp3        — continuous background score (add your file here)
  images/sections/*.jpg             — one placeholder image per section (add your files here)
  images/social/og-cover.jpg        — Open Graph preview image
```

## Assets you need to supply
Drop these files in exactly to make the page complete — everything else already points at them:

- `assets/videos/black-hole-intro.mp4` — ~13 seconds, muted-friendly, loops seamlessly.
- `assets/audio/background-music.mp3` — a track that loops cleanly for the whole session.
- `assets/images/sections/what-is-a-black-hole.jpg`
- `assets/images/sections/history.jpg`
- `assets/images/sections/formation.jpg`
- `assets/images/sections/types.jpg`
- `assets/images/sections/event-horizon.jpg`
- `assets/images/sections/singularity.jpg`
- `assets/images/sections/accretion-disk.jpg`
- `assets/images/sections/gravitational-lensing.jpg`
- `assets/images/sections/hawking-radiation.jpg`
- `assets/images/sections/time-dilation.jpg`
- `assets/images/sections/spaghettification.jpg`
- `assets/images/sections/sagittarius-a.jpg`
- `assets/images/sections/m87.jpg`
- `assets/images/sections/black-holes-and-galaxies.jpg`
- `assets/images/sections/myths-vs-facts.jpg`
- `assets/images/sections/faq.jpg`
- `assets/images/sections/references.jpg`
- `assets/images/social/og-cover.jpg`

## Notes
- Only the intro video is preloaded (`<link rel="preload" as="video">`); all section images use native `loading="lazy"`.
- The reading progress bar, scroll-reveal + image-zoom animations, and mute button are all dependency-free vanilla JS.
- `prefers-reduced-motion` is respected globally.
- The mobile nav no longer uses a hamburger — the menu is a compact, horizontally-scrollable strip with no toggle icon, by design.
- Update the "Know About the Developer" link in `index.html` (currently a placeholder) to your real portfolio URL.
