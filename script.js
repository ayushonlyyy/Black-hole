/* =====================================================
   COSMORA — "Into the Black Hole"
   Vanilla JS: immediate looping intro video, Continue
   flow, background music, scroll reveals, nav, FAQ.
   ===================================================== */

(() => {
  'use strict';

  const body = document.body;

  /* ---------------------------------------------------
     0. Lock scrolling while the quote/video screens are
        showing. The music control stays hidden until the
        journey begins (quote screen has no other UI).
     --------------------------------------------------- */
  body.classList.add('lock-scroll');
  body.classList.add('pre-start');

  /* ---------------------------------------------------
     1. ELEMENTS
     --------------------------------------------------- */
  const quoteScreen = document.getElementById('quoteScreen');
  const startBtn = document.getElementById('startBtn');
  const videoScreen = document.getElementById('videoScreen');
  const introVideo = document.getElementById('introVideo');
  const continueBtn = document.getElementById('continueBtn');
  const mainEl = document.getElementById('main');
  const bgMusic = document.getElementById('bgMusic');

  /* ---------------------------------------------------
     2. BACKGROUND MUSIC
        Started directly inside the "Start Journey" click
        handler so it lands within the user-gesture window
        browsers require — this is what defeats autoplay
        restrictions. Plays continuously afterwards across
        the intro video and the documentary.
     --------------------------------------------------- */
  function startMusic() {
    const p = bgMusic.play();
    if (p !== undefined) {
      p.catch(() => {
        // Extremely rare fallback — retry on the next interaction.
        const resume = () => {
          bgMusic.play().catch(() => {});
          ['pointerdown', 'keydown', 'touchstart'].forEach((evt) =>
            window.removeEventListener(evt, resume)
          );
        };
        ['pointerdown', 'keydown', 'touchstart'].forEach((evt) =>
          window.addEventListener(evt, resume, { once: true, passive: true })
        );
      });
    }
  }

  /* ---------------------------------------------------
     3. START JOURNEY
        Black quote screen -> tap "Start Journey" -> music
        begins immediately -> smooth crossfade into the
        fullscreen looping intro video.
     --------------------------------------------------- */
  startBtn.addEventListener('click', () => {
    // Music starts immediately, inside the click handler.
    startMusic();

    // Reveal the music control now that the journey has begun.
    body.classList.remove('pre-start');

    // Bring the video screen into the DOM flow and start playback.
    videoScreen.hidden = false;
    void videoScreen.offsetWidth; // force reflow for the transition
    videoScreen.classList.add('is-visible');

    const playPromise = introVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        /* If playback is ever blocked, still reveal Continue
           on schedule so the user is never stuck. */
      });
    }

    // Crossfade the quote screen out.
    quoteScreen.classList.add('is-leaving');
    window.setTimeout(() => {
      quoteScreen.hidden = true;
    }, 850);

    // "Continue →" appears 7 seconds after the video begins.
    window.setTimeout(() => {
      continueBtn.hidden = false;
    }, 7000);
  });

  continueBtn.addEventListener('click', () => {
    videoScreen.classList.add('is-leaving');

    window.setTimeout(() => {
      // Fully remove the video element from the DOM — not just
      // hidden or scrolled past. Background music is untouched,
      // so it keeps playing seamlessly through this transition.
      introVideo.pause();
      introVideo.removeAttribute('src');
      introVideo.load();
      videoScreen.remove();

      // Reveal the documentary with a smooth fade.
      mainEl.hidden = false;
      body.classList.remove('lock-scroll');
      // Force a reflow so the transition below is picked up.
      void mainEl.offsetWidth;
      mainEl.classList.add('is-visible');

      initScrollReveal();
      window.scrollTo({ top: 0, behavior: 'auto' });
    }, 850);
  });

  /* ---------------------------------------------------
     4. MUSIC CONTROL
        Premium circular toggle with tap micro-interactions
        (scale, slight rotation, glow/ripple) and a smooth
        crossfade between the on/off icon states.
     --------------------------------------------------- */
  const muteBtn = document.getElementById('muteBtn');
  let userMuted = false;
  let tapTimeout;

  function updateMuteIcon() {
    muteBtn.setAttribute('aria-pressed', String(userMuted));
    muteBtn.setAttribute('aria-label', userMuted ? 'Unmute music' : 'Mute music');
  }

  muteBtn.addEventListener('click', () => {
    userMuted = !userMuted;
    bgMusic.muted = userMuted;
    updateMuteIcon();

    // Retrigger the tap micro-interaction (scale/rotate + glow).
    muteBtn.classList.remove('is-tapped');
    void muteBtn.offsetWidth; // force reflow so the animation replays
    muteBtn.classList.add('is-tapped');
    window.clearTimeout(tapTimeout);
    tapTimeout = window.setTimeout(() => {
      muteBtn.classList.remove('is-tapped');
    }, 650);
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
        Fade + slide each .reveal element into place, and
        let content-section__media images zoom out slightly
        (handled via the .is-visible class in CSS), the
        first time it enters the viewport.
     --------------------------------------------------- */
  let revealObserver;

  function initScrollReveal() {
    const targets = document.querySelectorAll('.reveal, .content-section__media');

    if (!('IntersectionObserver' in window)) {
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
     6. FEATURED VIDEO — background-music ducking
        Playing the featured video pauses bgMusic (if it
        has an audio track and isn't muted); pausing or
        ending the video resumes bgMusic from the exact
        point it was left at. A silent/muted featured
        video never touches the music.
     --------------------------------------------------- */
  const featuredVideo = document.getElementById('featuredVideo');

  if (featuredVideo) {
    let duckedMusic = false;

    function featuredHasAudio() {
      if (featuredVideo.muted) return false;
      if (typeof featuredVideo.mozHasAudio === 'boolean') {
        return featuredVideo.mozHasAudio;
      }
      if (typeof featuredVideo.webkitAudioDecodedByteCount === 'number') {
        return featuredVideo.webkitAudioDecodedByteCount > 0;
      }
      if (featuredVideo.audioTracks) {
        return featuredVideo.audioTracks.length > 0;
      }
      // Can't determine yet — assume it may have audio so we don't
      // let two audio sources overlap; corrected shortly after play.
      return true;
    }

    function resumeMusicIfDucked() {
      if (duckedMusic) {
        duckedMusic = false;
        if (!userMuted) bgMusic.play().catch(() => {});
      }
    }

    featuredVideo.addEventListener('play', () => {
      const wasPlaying = !bgMusic.paused;

      if (wasPlaying && featuredHasAudio()) {
        bgMusic.pause();
        duckedMusic = true;
      }

      // Re-check shortly after (webkit needs a moment to report
      // decoded byte counts) in case a silent track was assumed
      // to have audio above — resume music if it turns out silent.
      window.setTimeout(() => {
        if (duckedMusic && !featuredHasAudio()) {
          resumeMusicIfDucked();
        }
      }, 300);
    });

    featuredVideo.addEventListener('pause', resumeMusicIfDucked);
    featuredVideo.addEventListener('ended', resumeMusicIfDucked);
  }

  /* ---------------------------------------------------
     7. PROMO BANNER — video if present, else image,
        else an empty black frame. Drop-in replaceable:
        assets/videos/promo.mp4 takes priority over
        assets/images/sections/promo.jpg.
     --------------------------------------------------- */
  const promoVideo = document.getElementById('promoVideo');
  const promoImage = document.getElementById('promoImage');

  if (promoVideo && promoImage) {
    const PROMO_VIDEO_SRC = 'assets/videos/promo.mp4';
    const PROMO_IMAGE_SRC = 'assets/images/sections/promo.jpg';

    function showPromoImage() {
      promoImage.addEventListener('error', () => {
        // No image either — leave the empty black frame.
        promoImage.hidden = true;
      }, { once: true });
      promoImage.addEventListener('load', () => {
        promoImage.hidden = false;
      }, { once: true });
      promoImage.src = PROMO_IMAGE_SRC;
    }

    promoVideo.addEventListener('loadeddata', () => {
      promoVideo.hidden = false;
      promoVideo.play().catch(() => {});
    }, { once: true });

    promoVideo.addEventListener('error', showPromoImage, { once: true });

    promoVideo.src = PROMO_VIDEO_SRC;
    promoVideo.load();
  }

  /* ---------------------------------------------------
     8. FAQ ACCORDION
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

})();
