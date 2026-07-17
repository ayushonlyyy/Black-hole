/* =====================================================
   COSMORA — "Into the Black Hole"
   Vanilla JS: screen sequencing, scroll reveals,
   progress bar, responsive nav, FAQ accordion.
   ===================================================== */

(() => {
  'use strict';

  const body = document.body;

  /* ---------------------------------------------------
     0. Lock scrolling while the gate / intro video
        screens are showing.
     --------------------------------------------------- */
  body.classList.add('lock-scroll');

  /* ---------------------------------------------------
     1. SCREEN 1 → SCREEN 2
        "Begin Journey" fades the gate out and reveals
        the fullscreen intro video, which autoplays muted.
     --------------------------------------------------- */
  const gate = document.getElementById('gate');
  const beginBtn = document.getElementById('beginBtn');
  const videoScreen = document.getElementById('videoScreen');
  const introVideo = document.getElementById('introVideo');
  const skipBtn = document.getElementById('skipBtn');
  const continueBtn = document.getElementById('continueBtn');
  const mainEl = document.getElementById('main');

  function startJourney() {
    gate.classList.add('is-leaving');

    // Reveal the video screen once the gate has faded.
    window.setTimeout(() => {
      gate.hidden = true;
      videoScreen.hidden = false;

      // Attempt playback; browsers allow muted autoplay.
      const playPromise = introVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay was blocked for some reason — show Continue
          // immediately so the user is never stuck on a static frame.
          showContinue();
        });
      }
    }, 650);
  }

  beginBtn.addEventListener('click', startJourney);

  /* ---------------------------------------------------
     2. SCREEN 2 → SCREEN 3
        When the 23s video ends (or the user skips),
        show a centered "Continue →" button. Clicking it
        reveals the documentary without a page reload.
     --------------------------------------------------- */
  function showContinue() {
    skipBtn.hidden = true;
    continueBtn.hidden = false;
    continueBtn.focus({ preventScroll: true });
  }

  introVideo.addEventListener('ended', showContinue);

  // Manual skip — treat it the same as the video finishing.
  skipBtn.addEventListener('click', () => {
    introVideo.pause();
    showContinue();
  });

  continueBtn.addEventListener('click', () => {
    videoScreen.style.transition = 'opacity 0.8s cubic-bezier(0.22,0.61,0.36,1)';
    videoScreen.style.opacity = '0';

    window.setTimeout(() => {
      videoScreen.hidden = true;
      mainEl.hidden = false;
      body.classList.remove('lock-scroll');

      // Kick off the reveal-on-scroll observer now that content is visible.
      initScrollReveal();
      window.scrollTo({ top: 0, behavior: 'auto' });
    }, 800);
  });

  /* ---------------------------------------------------
     3. READING PROGRESS BAR
        Fills as the user scrolls through the documentary.
     --------------------------------------------------- */
  const progressFill = document.getElementById('progressFill');

  function updateProgressBar() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressFill.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  }

  window.addEventListener('scroll', updateProgressBar, { passive: true });
  window.addEventListener('resize', updateProgressBar);

  /* ---------------------------------------------------
     4. SCROLL-TRIGGERED REVEAL ANIMATIONS
        Fade + slide each .reveal element into place the
        first time it enters the viewport.
     --------------------------------------------------- */
  let revealObserver;

  function initScrollReveal() {
    const targets = document.querySelectorAll('.reveal');

    if (!('IntersectionObserver' in window)) {
      // Fallback: just show everything.
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );

    targets.forEach((el) => revealObserver.observe(el));
  }

  /* ---------------------------------------------------
     5. RESPONSIVE NAVIGATION
     --------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  function closeNav() {
    navMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  }

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  // Close the mobile menu after selecting a link.
  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  /* ---------------------------------------------------
     6. FAQ ACCORDION
        Single-panel expand/collapse with smooth height
        transition and correct ARIA state.
     --------------------------------------------------- */
  const accordion = document.getElementById('accordion');

  if (accordion) {
    accordion.querySelectorAll('.accordion__trigger').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const panel = trigger.nextElementSibling;
        const isOpen = trigger.getAttribute('aria-expanded') === 'true';

        trigger.setAttribute('aria-expanded', String(!isOpen));
        panel.style.maxHeight = isOpen ? null : `${panel.scrollHeight}px`;
      });
    });
  }

  /* ---------------------------------------------------
     7. Keep the video's controls/scroll fully disabled
        and prevent the page from scrolling while the
        video screen is active (belt-and-braces beyond
        the CSS lock).
     --------------------------------------------------- */
  ['keydown'].forEach((evt) => {
    window.addEventListener(evt, (e) => {
      const scrollKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Space'];
      if (!videoScreen.hidden && scrollKeys.includes(e.code)) {
        e.preventDefault();
      }
    });
  });

})();
