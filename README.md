# COSMORA — Into the Black Hole

A single-page cinematic documentary built with plain HTML, CSS, and JavaScript.

## Structure
```
index.html   — markup for all three screens (gate, intro video, documentary)
style.css    — full design system (black/white, Inter type, animations)
script.js    — screen sequencing, scroll reveals, nav, FAQ accordion, progress bar
assets/
  videos/black-hole-intro.mp4       — 23s, 9:16, muted autoplay intro (add your file here)
  images/sections/*.jpg             — one placeholder image per section (add your files here)
  images/social/og-cover.jpg        — Open Graph preview image
```

## Assets you need to supply
Drop these files in exactly to make the page complete — everything else already points at them:

- `assets/videos/black-hole-intro.mp4` — 9:16 vertical, ~23 seconds, muted-friendly.
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
- The reading progress bar, scroll-reveal animations, and mobile nav are all dependency-free vanilla JS.
- `prefers-reduced-motion` is respected globally.
- Update the "Know About the Developer" link in `index.html` (currently a placeholder) to your real portfolio URL.
