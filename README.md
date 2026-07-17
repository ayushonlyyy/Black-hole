# COSMORA — Into the Black Hole

A single-page cinematic documentary built with plain HTML, CSS, and JavaScript.

## How it flows now
1. The page loads straight into a **looping, muted, 13-second intro video** — no quote screen.
2. A **Continue →** button fades in after 4 seconds, while the video keeps looping underneath.
3. Clicking Continue **removes the video element from the DOM entirely** and fades in the documentary.
4. The documentary opens with a centered **COSMORA / by Ayush** title, then the full black-hole story.
5. Background music starts automatically (or on first tap, if the browser blocks autoplay) and keeps
   playing across both the video and the documentary. A small mute/unmute button sits top-right at all times.

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
