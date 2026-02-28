/**
 * ZENITH 2K26 - Page Transitions
 * Wipe transition effect between pages/sections
 */

window.Transitions = (function() {
  'use strict';

  let wipeEl = null;
  let wordmark = null;
  let isTransitioning = false;

  function init() {
    wipeEl = document.getElementById('page-wipe');
    if (wipeEl) {
      wordmark = wipeEl.querySelector('.wipe-wordmark');
    }
  }

  function wipe(targetId, callback) {
    // Guard: prevent overlapping transitions
    if (isTransitioning || !wipeEl) return;
    isTransitioning = true;

    // Slide in from left
    gsap.to(wipeEl, {
      x: 0,
      duration: 0.38,
      ease: 'power4.out',
      onStart: () => {
        if (window.SoundSystem && window.SoundSystem.playNavWipe) {
          window.SoundSystem.playNavWipe();
        }
      }
    });

    // Fade in wordmark
    if (wordmark) {
      gsap.to(wordmark, {
        opacity: 1,
        duration: 0.38,
        ease: 'power4.out'
      });
    }

    // When covering the screen, perform action
    gsap.delayedCall(0.38, () => {
      if (callback) {
        // Use provided callback
        callback();
      } else if (targetId) {
        // Scroll to target section
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          if (window.lenis && window.lenis.scrollTo) {
            window.lenis.scrollTo(targetSection, { immediate: true });
          } else {
            targetSection.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }

      // Slide out to right
      gsap.to(wipeEl, {
        x: '100vw',
        duration: 0.38,
        ease: 'power4.out',
        onComplete: () => {
          // Reset for next use
          gsap.set(wipeEl, { x: '-100vw' });
          isTransitioning = false;
        }
      });

      // Fade out wordmark
      if (wordmark) {
        gsap.to(wordmark, {
          opacity: 0,
          duration: 0.38,
          ease: 'power4.out'
        });
      }
    });
  }

  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    wipe,
    init
  };
})();
