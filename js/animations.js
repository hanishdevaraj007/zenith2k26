/**
 * ZENITH 2K26 - Animations
 * ScrollTrigger-based animations for all sections
 */

window.Animations = (function() {
  'use strict';

  function initAboutPin() {
    // Guard against missing dependencies
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      return;
    }

    try {
      var aboutSection = document.getElementById('about');
      if (!aboutSection) return;

      gsap.delayedCall(0.5, function() {
        // Simple scroll-triggered animations without pinning
        var label = aboutSection.querySelector('.section-label');
        if (label) {
          ScrollTrigger.create({
            trigger: aboutSection,
            start: 'top 80%',
            onEnter: function() {
              gsap.fromTo(label, { x: -60, opacity: 0 }, 
                { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' });
            },
            once: true
          });
        }

        var stats = aboutSection.querySelectorAll('.stat-num');
        if (stats.length > 0) {
          ScrollTrigger.create({
            trigger: aboutSection,
            start: 'top 80%',
            onEnter: function() {
              stats.forEach(function(stat, i) {
                var target = parseInt(stat.getAttribute('data-target')) || 0;
                gsap.fromTo(stat, { textContent: 0 },
                  { textContent: target, duration: 1.5, delay: i * 0.1, 
                    snap: { textContent: 1 },
                    ease: 'power2.out',
                    onUpdate: function() {
                      stat.textContent = Math.round(this.targets()[0].textContent);
                    }
                  });
              });
            },
            once: true
          });
        }
      });
    } catch (e) {
      console.warn('initAboutPin failed:', e);
    }
  }

  function initCardAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      return;
    }

    try {
      var grids = ['tech-grid', 'nontech-grid', 'fun-grid'];
      grids.forEach(function(gridId) {
        var grid = document.getElementById(gridId);
        if (!grid) return;

        ScrollTrigger.create({
          trigger: grid,
          start: 'top 80%',
          onEnter: function() {
            var cards = grid.querySelectorAll('.event-card');
            if (cards.length > 0) {
              gsap.from(cards, {
                y: 80,
                opacity: 0,
                stagger: 0.1,
                duration: 0.6,
                ease: 'power3.out',
                clearProps: 'all'
              });
            }
          },
          once: true
        });
      });
    } catch (e) {
      console.warn('initCardAnimations failed:', e);
    }
  }

  function initTeamAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      return;
    }

    try {
      var tiers = document.querySelectorAll('.team-tier');
      tiers.forEach(function(tier) {
        try {
          var label = tier.querySelector('.tier-label');
          if (label) {
            ScrollTrigger.create({
              trigger: tier,
              start: 'top 80%',
              onEnter: function() {
                gsap.from(label, {
                  x: -60,
                  opacity: 0,
                  duration: 0.6,
                  ease: 'power3.out',
                  clearProps: 'all'
                });
              },
              once: true
            });
          }

          var cards = tier.querySelectorAll('.member-card');
          if (cards.length > 0) {
            ScrollTrigger.create({
              trigger: tier,
              start: 'top 80%',
              onEnter: function() {
                gsap.from(cards, {
                  y: 20,
                  opacity: 0,
                  stagger: 0.08,
                  duration: 0.6,
                  ease: 'power3.out',
                  clearProps: 'all'
                });
              },
              once: true
            });
          }
        } catch (e) {
          console.warn('Team tier animation failed:', e);
        }
      });
    } catch (e) {
      console.warn('initTeamAnimations failed:', e);
    }
  }

  function initFooterObserver() {
    try {
      var footer = document.getElementById('footer');
      if (!footer) return;

      var hasPlayed = false;
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting && !hasPlayed) {
            hasPlayed = true;
            // Play footer ambient if sound system available
            if (window.SoundSystem && window.SoundSystem.playFooterAmbient) {
              window.SoundSystem.playFooterAmbient();
            }
          }
        });
      });
      observer.observe(footer);
    } catch (e) {
      console.warn('initFooterObserver failed:', e);
    }
  }

  function initPortals() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      return;
    }
    // Portal animations can be added here later if needed
  }

  function initSectionTitles() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || typeof SplitText === 'undefined') {
      return;
    }
    var sections = document.querySelectorAll('section');
    sections.forEach(function(sec) {
      var title = sec.querySelector('h2, h1');
      if (!title) return;
      try {
        var split = new SplitText(title, { type: 'words,chars' });
        gsap.from(split.chars, {
          opacity: 0,
          y: 30,
          stagger: 0.04,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sec,
            start: 'top 80%',
            once: true
          }
        });
      } catch (e) {
        console.warn('initSectionTitles failed:', e);
      }
    });
  }

  function heroEntry() {
    if (typeof gsap === 'undefined') {
      return;
    }

    try {
      var heroTitle = document.querySelector('.hero-title');
      var heroSub = document.querySelector('.hero-sub');

      if (heroTitle) {
        gsap.fromTo(heroTitle, 
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
      }

      if (heroSub) {
        gsap.fromTo(heroSub,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, delay: 0.1, ease: 'power3.out' });
      }

      var cta = document.querySelector('.hero-cta');
      if (cta) {
        gsap.fromTo(cta,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.6, delay: 0.3, ease: 'back.out(1.7)' });
      }
    } catch (e) {
      console.warn('heroEntry failed:', e);
    }
  }

  return {
    initAboutPin: initAboutPin,
    initCardAnimations: initCardAnimations,
    initTeamAnimations: initTeamAnimations,
    initFooterObserver: initFooterObserver,
    initPortals: initPortals,
    initSectionTitles: initSectionTitles,
    heroEntry: heroEntry
  };
})();
