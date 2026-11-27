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

## New in this update
- **Intro paragraph** — Ayush's welcome note now sits directly under the "COSMORA / by Ayush" heading.
- **Featured video** (`assets/videos/featured.mp4`) — a responsive, rounded, native-controls player under the intro. If the file has its own audio track (and isn't muted), pressing play ducks the background music and pausing/ending it resumes the music from the exact spot it left off. Silent/muted featured videos never touch the music.
- **Promo banner** — a black, rounded, fixed **4:3** frame at the top of the documentary (same ratio on every screen size, media filled with `object-fit: cover`, no stretching). It shows `assets/videos/promo.mp4` (autoplay, muted, looped, no controls — behaves like an animated banner) if that file exists, otherwise falls back to `assets/images/sections/promo.jpg`, otherwise stays an empty black banner. Swap either file any time — no code changes needed. A small 20–32px gap now separates it from the nav below.
- Portfolio link now points to `https://ayushonlyyy.github.io/`.
- **Media protection** — see the dedicated section below.

## Media protection
Applied site-wide to deter casual copying of images and video:
- **Images**: right-click/context menu disabled, drag-and-drop disabled, iOS/Android long-press "save image" callout suppressed, text/image selection disabled on media.
- **Videos**: native download button removed from controls (`controlsList="nodownload noplaybackrate nofullscreen"`), Picture-in-Picture hidden (`disablePictureInPicture`), remote playback/casting hidden (`disableRemotePlayback`), fullscreen blocked where the browser allows it (auto-exits if triggered), right-click and drag disabled.
- Implemented via a `protectMediaElement()` pass over every `<img>`/`<video>` in `script.js`, plus a document-level fallback listener for the promo banner's media (which is swapped in dynamically), plus supporting CSS (`user-select`, `-webkit-touch-callout`, `-webkit-user-drag` all set to none on media).
- **Honest limit**: this stops the easy, accidental paths (right-click, drag, long-press, native download UI). It is not DRM — anything rendered in a browser can still be captured by a determined user (screen recording, dev tools, etc.).

## Assets you need to supply
Drop these files in exactly to make the page complete — everything else already points at them:

- `assets/videos/black-hole-intro.mp4` — ~13 seconds, muted-friendly, loops seamlessly.
- `assets/audio/background-music.mp3` — a track that loops cleanly for the whole session.
- `assets/videos/featured.mp4` — the featured video shown under the intro.
- `assets/videos/promo.mp4` (optional) — looping muted banner clip; takes priority over the image below when present.
- `assets/images/sections/promo.jpg` (optional) — fallback banner image if no promo video is present.
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

## Update 2 — Part A: interactive tools
Both tools are dependency-free, mobile-first (44px touch targets, 16px inputs so iOS doesn't zoom) and respect `prefers-reduced-motion`.

- **Schwarzschild radius calculator** (`#rs-calc`, placed after *Event Horizon*). Enter a mass in kg, Earth masses or Solar masses, or tap a preset (Earth, Sun, Sagittarius A* ≈ 4.3 million M☉, M87* ≈ 6.5 billion M☉, or "My body weight", which uses the kg field below it). It shows r = 2GM/c², the diameter in an auto-scaled unit (m-scientific, mm, m, km, AU, light-years) and a one-line size comparison. The SVG circle is log-scaled. Constants: G = 6.674e-11, c = 299792458, M☉ = 1.989e30 kg, M⊕ = 5.972e24 kg. Empty, zero, negative or overflowing input shows a message instead of a result.
- **Time dilation simulator** (`#td-sim`, placed before *Spaghettification*, in the Physics chapter). A log-scaled slider runs from 10 Rs down to 1.0001 Rs and shows √(1 − Rs/r), a live "1 hour for you = X outside" readout, and two clocks (the near clock's hand slows as the factor drops). The factor is floored, so there is no divide-by-zero or Infinity; at the extreme it reads about 100 hours (≈4 days). It models a non-rotating black hole viewed from far away.

Files changed: `index.html`, `style.css`, `script.js`. Parts B (UI) and C (quality/PWA) are not yet implemented.
