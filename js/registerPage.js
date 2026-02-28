/**
 * ZENITH 2K26 - Register Panel
 * Registration panel overlay with smooth transitions
 */

window.RegisterPanel = (function() {
  'use strict';

  let panel = null;
  let panelInner = null;
  let panelBack = null;
  let regFormBtn = null;
  let isOpen = false;

  function init() {
    panel = document.getElementById('register-panel');
    panelInner = document.getElementById('register-panel-inner');
    panelBack = panel ? panel.querySelector('.panel-back') : null;
    regFormBtn = document.getElementById('reg-form-btn');

    if (panelBack) {
      panelBack.addEventListener('click', close);
    }

    if (regFormBtn) {
      regFormBtn.addEventListener('click', handleFormButtonClick);
    }

    document.addEventListener('keydown', handleEscape);

    // Nav register button
    const navRegisterBtn = document.getElementById('nav-register-btn');
    if (navRegisterBtn) {
      navRegisterBtn.addEventListener('click', open);
    }

    // Hero CTA button
    const heroCta = document.getElementById('hero-cta');
    if (heroCta) {
      heroCta.addEventListener('click', open);
    }
  }

  function handleFormButtonClick(e) {
    e.preventDefault();
    if (window.siteConfig && window.siteConfig.registrationFormURL) {
      window.open(window.siteConfig.registrationFormURL, '_blank', 'noopener,noreferrer');
    }
  }

  function handleEscape(e) {
    if (e.key === 'Escape' && isOpen) {
      close();
    }
  }

  function open() {
    if (!panel || isOpen) return;
    isOpen = true;

    // Use wipe transition
    if (window.Transitions && window.Transitions.wipe) {
      window.Transitions.wipe(null, onWipeComplete);
    } else {
      // Fallback without transitions
      openPanel();
    }
  }

  function onWipeComplete() {
    openPanel();
  }

  function openPanel() {
    if (!panel) return;

    panel.classList.add('open');
    document.body.style.overflow = 'hidden';

    if (typeof gsap !== 'undefined') {
      if (panelBack) {
        gsap.to(panelBack, {
          opacity: 1,
          pointerEvents: 'auto',
          duration: 0.3,
          delay: 0.2
        });
      }

      if (panelInner) {
        gsap.to(panelInner, {
          opacity: 1,
          duration: 0.3
        });
      }
    } else {
      if (panelBack) {
        panelBack.style.opacity = '1';
        panelBack.style.pointerEvents = 'auto';
      }
      if (panelInner) {
        panelInner.style.opacity = '1';
      }
    }

    if (window.SoundSystem && window.SoundSystem.playPanelOpen) {
      window.SoundSystem.playPanelOpen();
    }
  }

  function close() {
    if (!panel || !isOpen) return;
    isOpen = false;

    if (typeof gsap !== 'undefined') {
      if (panelBack) {
        gsap.to(panelBack, {
          opacity: 0,
          pointerEvents: 'none',
          duration: 0.2
        });
      }

      if (panelInner) {
        gsap.to(panelInner, {
          opacity: 0,
          duration: 0.2
        });
      }

      gsap.delayedCall(0.2, () => {
        if (panel) {
          panel.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    } else {
      // Fallback without GSAP
      if (panelBack) {
        panelBack.style.opacity = '0';
        panelBack.style.pointerEvents = 'none';
      }
      if (panelInner) {
        panelInner.style.opacity = '0';
      }
      if (panel) {
        panel.classList.remove('open');
        document.body.style.overflow = '';
      }
    }

    if (window.SoundSystem && window.SoundSystem.playPanelClose) {
      window.SoundSystem.playPanelClose();
    }
  }

  function cleanup() {
    if (panelBack) panelBack.removeEventListener('click', close);
    if (regFormBtn) regFormBtn.removeEventListener('click', handleFormButtonClick);
    document.removeEventListener('keydown', handleEscape);
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    init,
    open,
    close,
    cleanup
  };
})();
