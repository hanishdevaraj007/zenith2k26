/**
 * ZENITH 2K26 - Navigation Bar
 * Handles scroll detection, section highlighting, and mobile menu
 */

window.Navbar = (function() {
  'use strict';

  let navbar = null;
  let hamburger = null;
  let mobileNav = null;
  let mobileClose = null;
  let mobileOverlay = null;
  let isOpen = false;

  function init() {
    navbar = document.getElementById('navbar');
    hamburger = document.getElementById('hamburger');
    mobileNav = document.getElementById('mobile-nav');
    mobileClose = document.getElementById('mobile-close');
    mobileOverlay = document.querySelector('[data-role="mobile-nav-overlay"]') || 
                    document.createElement('div');

    if (!navbar) return;

    // Setup mobile menu
    if (hamburger && mobileNav) {
      hamburger.addEventListener('click', openMobileNav);
      if (mobileClose) mobileClose.addEventListener('click', closeMobileNav);
      if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileNav);

      // Close on link click
      const mobileLinks = mobileNav.querySelectorAll('a[data-nav-mobile]');
      mobileLinks.forEach(link => {
        link.addEventListener('click', handleNavLink);
      });
    }

    // Add keyboard escape handler
    document.addEventListener('keydown', handleEscape);

    // Scroll handler for .scrolled class
    window.addEventListener('scroll', handleScroll);

    // Set up IntersectionObserver for active links
    setupIntersectionObserver();
  }

  function handleScroll() {
    if (navbar) {
      if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  }

  function setupIntersectionObserver() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll(
      '.nav-links a[data-nav], #mobile-nav a[data-nav-mobile]'
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
            const sectionId = entry.target.id;

            // Remove active class from all links
            navLinks.forEach(link => {
              link.classList.remove('active');
            });

            // Find and activate matching link
            const activeLink = document.querySelector(
              `a[href="#${sectionId}"][data-nav], a[href="#${sectionId}"][data-nav-mobile]`
            );
            if (activeLink) {
              activeLink.classList.add('active');
            }
          }
        });
      },
      { threshold: 0.4 }
    );

    sections.forEach(section => {
      observer.observe(section);
    });
  }

  function handleNavLink(e) {
    const link = e.currentTarget;
    const href = link.getAttribute('href');
    
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      
      // Close mobile nav
      if (isOpen) closeMobileNav();
      
      // Use transitions if available
      if (window.Transitions && window.Transitions.wipe) {
        window.Transitions.wipe(targetId);
      } else {
        // Fallback: direct scroll
        const target = document.getElementById(targetId);
        if (target && window.lenis) {
          window.lenis.scrollTo(target);
        }
      }
    }
  }

  function handleEscape(e) {
    if (e.key === 'Escape' && isOpen) {
      closeMobileNav();
    }
  }

  function openMobileNav() {
    isOpen = true;
    if (mobileNav) {
      mobileNav.classList.add('open');
      gsap.to(mobileNav, {
        x: 0,
        duration: 0.4,
        ease: 'power3.out'
      });
    }
    if (mobileOverlay) {
      mobileOverlay.style.display = 'block';
    }
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    isOpen = false;
    if (mobileNav) {
      mobileNav.classList.remove('open');
      gsap.to(mobileNav, {
        x: '100%',
        duration: 0.4,
        ease: 'power3.out'
      });
    }
    if (mobileOverlay) {
      mobileOverlay.style.display = 'none';
    }
    document.body.style.overflow = '';
  }

  function cleanup() {
    if (hamburger) hamburger.removeEventListener('click', openMobileNav);
    if (mobileClose) mobileClose.removeEventListener('click', closeMobileNav);
    if (mobileOverlay) mobileOverlay.removeEventListener('click', closeMobileNav);
    document.removeEventListener('keydown', handleEscape);
    window.removeEventListener('scroll', handleScroll);
  }

  return {
    init,
    cleanup
  };
})();
