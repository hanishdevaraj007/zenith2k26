/**
 * ZENITH 2K26 - Ultra-Simple Loader
 * Foolproof progress bar animation with multiple hide mechanisms
 */

window.Loader = (function() {
  'use strict';

  let loader = null;
  let loaderBar = null;
  let loaderPercent = null;
  let isComplete = false;
  let startTime = 0;

  function start(callback) {
    // Get DOM elements
    loader = document.getElementById('loader');
    loaderBar = document.querySelector('.loader-bar');
    loaderPercent = document.querySelector('.loader-percent');

    // Safety: if no elements, call callback immediately
    if (!loader || !loaderBar || !loaderPercent) {
      console.warn('Loader elements missing, calling callback immediately');
      if (callback) callback();
      return;
    }

    console.log('Loader.start() called');
    
    startTime = Date.now();
    const startPercent = 0;
    const endPercent = 100;
    const duration = 1000; // 1 second for progress
    
    // Animate progress bar
    const animateProgress = () => {
      const elapsed = Date.now() - startTime;
      let percent = Math.min((elapsed / duration) * 100, 100);
      
      loaderBar.style.width = percent + '%';
      loaderPercent.textContent = Math.round(percent) + '%';
      
      if (percent < 100) {
        requestAnimationFrame(animateProgress);
      } else {
        // Progress complete - start hide sequence
        completeLoader(callback);
      }
    };
    
    animateProgress();
  }

  function completeLoader(callback) {
    if (isComplete) return;
    isComplete = true;

    console.log('Loader complete sequence starting');

    // Simple timeout-based fade out (no GSAP needed)
    setTimeout(() => {
      hideLoaderElement();
      console.log('Loader hidden');
      if (callback && typeof callback === 'function') {
        callback();
        console.log('Callback executed');
      }
    }, 500); // Give a small delay before hiding
  }

  function hideLoaderElement() {
    if (!loader) return;
    
    // Set display: none to completely remove from layout
    loader.style.display = 'none';
    loader.style.visibility = 'hidden';
    loader.style.opacity = '0';
    loader.style.pointerEvents = 'none';
    loader.setAttribute('aria-hidden', 'true');
    
    console.log('Loader element hidden with all strategies');
  }

  // Public API
  return {
    start: start,
    hide: hideLoaderElement
  };
})();
