/**
 * ZENITH 2K26 - Main Orchestration
 * Initializes all modules and starts the site
 */

document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  console.log('=== ZENITH 2K26 - Main Initialization Starting ===');

  // Immediate fallback: hide loader after 4 seconds NO MATTER WHAT
  const absoluteTimeout = setTimeout(function() {
    const loader = document.getElementById('loader');
    if (loader) {
      console.warn('Absolute timeout reached, force hiding loader');
      loader.style.transition = 'none';
      loader.style.visibility = 'hidden';
      loader.style.opacity = '0';
      loader.style.pointerEvents = 'none';
    }
  }, 4000);

  // -- MOBILE DETECTION --
  const isMobile = window.matchMedia('(pointer: coarse)').matches;
  if (isMobile) {
    document.body.classList.add('is-mobile');
    console.log('Mobile device detected');
  } else {
    console.log('Desktop device detected');
  }

  // -- LENIS SMOOTH SCROLL (desktop only) --
  if (!isMobile && typeof Lenis !== 'undefined') {
    try {
      console.log('Initializing Lenis...');
      window.lenis = new Lenis({
        smooth: true,
        direction: 'vertical',
        gestureDirection: 'vertical',
        lerp: 0.1
      });

      if (typeof gsap !== 'undefined') {
        gsap.ticker.add(function(time) {
          if (window.lenis) window.lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
        window.lenis.on('scroll', function() {
          if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.update();
          }
        });
        console.log('Lenis initialized');
      }
    } catch (e) {
      console.warn('Lenis failed:', e.message);
    }
  }

  // -- GSAP INITIALIZATION --
  if (typeof gsap !== 'undefined') {
    try {
      console.log('Initializing GSAP plugins...');
      gsap.registerPlugin(ScrollTrigger, SplitText);
      ScrollTrigger.defaults({ invalidateOnRefresh: true });
      console.log('GSAP plugins registered');
    } catch (e) {
      console.warn('GSAP plugin registration failed:', e.message);
    }
  } else {
    console.warn('GSAP is undefined!');
  }

  // -- INITIALIZE MODULES --
  
  // Button crack effect (must be before card rendering)
  if (window.ButtonCrack && typeof window.ButtonCrack.init === 'function') {
    try {
      console.log('Initializing ButtonCrack...');
      window.ButtonCrack.init();
      console.log('ButtonCrack initialized');
    } catch (e) {
      console.warn('ButtonCrack init failed:', e.message);
    }
  }

  // Render event cards
  if (window.renderEventCards) {
    if (window.techEvents) {
      try {
        console.log('Rendering tech events...');
        window.renderEventCards(window.techEvents, 'tech-grid', 'tech');
        console.log('Tech events rendered: ' + window.techEvents.length);
      } catch (e) {
        console.error('renderEventCards tech failed:', e.message);
      }
    }
    if (window.nonTechEvents) {
      try {
        console.log('Rendering non-tech events...');
        window.renderEventCards(window.nonTechEvents, 'nontech-grid', 'nontech');
        console.log('Non-tech events rendered: ' + window.nonTechEvents.length);
      } catch (e) {
        console.error('renderEventCards nontech failed:', e.message);
      }
    }
    if (window.funEvents) {
      try {
        console.log('Rendering fun events...');
        window.renderEventCards(window.funEvents, 'fun-grid', 'fun');
        console.log('Fun events rendered: ' + window.funEvents.length);
      } catch (e) {
        console.error('renderEventCards fun failed:', e.message);
      }
    }
  } else {
    console.warn('renderEventCards not found');
  }

  // Render team
  if (window.renderTeam && typeof window.renderTeam === 'function') {
    try {
      console.log('Rendering team...');
      window.renderTeam();
      console.log('Team rendered');
    } catch (e) {
      console.error('renderTeam failed:', e.message);
    }
  } else {
    console.warn('renderTeam not found');
  }

  // Initialize navbar
  if (window.Navbar && typeof window.Navbar.init === 'function') {
    try {
      console.log('Initializing Navbar...');
      window.Navbar.init();
      console.log('Navbar initialized');
    } catch (e) {
      console.warn('Navbar init failed:', e.message);
    }
  } else {
    console.warn('Navbar not found');
  }

  // Desktop-only features
  if (!isMobile) {
    // Custom cursor
    if (window.Cursor && typeof window.Cursor.init === 'function') {
      try {
        console.log('Initializing Cursor...');
        window.Cursor.init();
        console.log('Cursor initialized');
      } catch (e) {
        console.warn('Cursor init failed:', e.message);
      }
    }

    // Cursor trail
    if (window.CursorTrail && typeof window.CursorTrail.init === 'function') {
      try {
        console.log('Initializing CursorTrail...');
        window.CursorTrail.init();
        console.log('CursorTrail initialized');
      } catch (e) {
        console.warn('CursorTrail init failed:', e.message);
      }
    }

    // Particles
    if (window.ParticleSystem && typeof window.ParticleSystem.init === 'function') {
      try {
        console.log('Initializing ParticleSystem...');
        window.ParticleSystem.init();
        console.log('ParticleSystem initialized');
      } catch (e) {
        console.warn('ParticleSystem init failed:', e.message);
      }
    }
  }

  // Animations (GSAP-based)
  if (typeof gsap !== 'undefined' && window.Animations) {
    try {
      console.log('Initializing Animations...');
      if (typeof window.Animations.initPortals === 'function') {
        window.Animations.initPortals();
      }
      if (typeof window.Animations.initCardAnimations === 'function') {
        window.Animations.initCardAnimations();
      }
      if (typeof window.Animations.initTeamAnimations === 'function') {
        window.Animations.initTeamAnimations();
      }
      if (typeof window.Animations.initFooterObserver === 'function') {
        window.Animations.initFooterObserver();
      }
      if (typeof window.Animations.initSectionTitles === 'function') {
        window.Animations.initSectionTitles();
      }
      console.log('Animations initialized');

      // About pin after slight delay
      gsap.delayedCall(0.5, function() {
        if (typeof window.Animations.initAboutPin === 'function') {
          try {
            window.Animations.initAboutPin();
          } catch (e) {
            console.warn('About pin init failed:', e.message);
          }
        }
      });
    } catch (e) {
      console.warn('Animations init failed:', e.message);
    }
  } else {
    if (typeof gsap === 'undefined') {
      console.warn('GSAP is undefined, skipping animations');
    }
    if (!window.Animations) {
      console.warn('Animations module not found');
    }
  }

  // Initialize RegisterPanel
  if (window.RegisterPanel && typeof window.RegisterPanel.init === 'function') {
    try {
      console.log('Initializing RegisterPanel...');
      window.RegisterPanel.init();
      console.log('RegisterPanel initialized');
    } catch (e) {
      console.warn('RegisterPanel init failed:', e.message);
    }
  }

  // -- START LOADER --
  console.log('Starting loader...');
  if (window.Loader && typeof window.Loader.start === 'function') {
    window.Loader.start(function() {
      clearTimeout(absoluteTimeout);
      console.log('Loader callback fired');
      // Loader complete callback
      if (window.Animations && typeof window.Animations.heroEntry === 'function') {
        try {
          console.log('Starting hero entry animation...');
          window.Animations.heroEntry();
        } catch (e) {
          console.warn('Hero entry animation failed:', e.message);
        }
      }
    });
  } else {
    console.error('Loader module not found! This is critical.');
  }

  // -- REFRESH SCROLLTRIGGER --
  if (typeof gsap !== 'undefined') {
    gsap.delayedCall(0.5, function() {
      if (typeof ScrollTrigger !== 'undefined') {
        try {
          console.log('Refreshing ScrollTrigger...');
          ScrollTrigger.refresh();
        } catch (e) {
          console.warn('ScrollTrigger refresh failed:', e.message);
        }
      }
    });
  }

  console.log('=== Main initialization complete ===');
});
