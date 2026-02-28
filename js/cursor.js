/**
 * ZENITH 2K26 - Custom Cursor
 * Desktop-only custom cursor with dot and ring elements
 */

window.Cursor = (function() {
  'use strict';
  
  let dotEl = null;
  let ringEl = null;
  let dotX = 0, dotY = 0;
  let ringX = 0, ringY = 0;
  let isHovering = false;
  let mouseInWindow = true;
  let rafId = null;

  function init() {
    // Guard: mobile users should not reach here
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    dotEl = document.getElementById('cursor-dot');
    ringEl = document.getElementById('cursor-ring');

    if (!dotEl || !ringEl) return;

    // Set initial visibility
    dotEl.style.display = 'block';
    ringEl.style.display = 'block';

    // Apply will-change for performance
    dotEl.style.willChange = 'transform';
    ringEl.style.willChange = 'transform';

    // Track mouse movement
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mouseenter', onMouseEnter);
    window.addEventListener('mouseleave', onMouseLeave);

    // RAF loop for ring lerp
    updateRingPosition();
  }

  function onMouseMove(e) {
    dotX = e.clientX;
    dotY = e.clientY;

    if (dotEl && mouseInWindow) {
      dotEl.style.left = dotX + 'px';
      dotEl.style.top = dotY + 'px';
    }

    checkHoverState(e.target);
  }

  function onMouseDown() {
    if (dotEl) {
      gsap.to(dotEl, {
        scale: 0.4,
        duration: 0.15,
        overwrite: 'auto'
      });
    }
  }

  function onMouseUp() {
    if (dotEl) {
      gsap.to(dotEl, {
        scale: 1,
        duration: 0.15,
        overwrite: 'auto'
      });
    }
  }

  function onMouseEnter() {
    mouseInWindow = true;
    if (dotEl) dotEl.style.opacity = '1';
    if (ringEl) ringEl.style.opacity = '1';
  }

  function onMouseLeave() {
    mouseInWindow = false;
    if (dotEl) dotEl.style.opacity = '0';
    if (ringEl) ringEl.style.opacity = '0';
  }

  function updateRingPosition() {
    rafId = requestAnimationFrame(updateRingPosition);

    ringX += (dotX - ringX) * 0.12;
    ringY += (dotY - ringY) * 0.12;

    if (ringEl && mouseInWindow) {
      ringEl.style.left = ringX + 'px';
      ringEl.style.top = ringY + 'px';
    }
  }

  function checkHoverState(target) {
    const isInteractive = target.matches('a, button, .event-card, .hoverable, .member-card') ||
                         target.closest('a, button, .event-card, .hoverable, .member-card');

    if (isInteractive && !isHovering) {
      isHovering = true;
      if (ringEl && dotEl) {
        gsap.to(ringEl, {
          width: 56,
          height: 56,
          borderColor: 'rgba(0, 85, 255, 0.3)',
          backgroundColor: 'rgba(0, 85, 255, 0.1)',
          duration: 0.3,
          overwrite: 'auto'
        });
        gsap.to(dotEl, {
          opacity: 0,
          duration: 0.3,
          overwrite: 'auto'
        });
      }
    } else if (!isInteractive && isHovering) {
      isHovering = false;
      if (ringEl && dotEl) {
        gsap.to(ringEl, {
          width: 36,
          height: 36,
          borderColor: 'var(--blue)',
          backgroundColor: 'transparent',
          duration: 0.3,
          overwrite: 'auto'
        });
        gsap.to(dotEl, {
          opacity: 1,
          duration: 0.3,
          overwrite: 'auto'
        });
      }
    }
  }

  function cleanup() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mousedown', onMouseDown);
    document.removeEventListener('mouseup', onMouseUp);
    window.removeEventListener('mouseenter', onMouseEnter);
    window.removeEventListener('mouseleave', onMouseLeave);
    if (rafId) cancelAnimationFrame(rafId);
  }

  return {
    init,
    cleanup
  };
})();
