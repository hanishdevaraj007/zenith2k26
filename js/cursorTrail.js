/**
 * ZENITH 2K26 - Cursor Trail
 * Canvas-based trailing effect with zap burst on click
 */

window.CursorTrail = (function() {
  'use strict';
  
  const TRAIL_LENGTH = 28;
  let canvas = null;
  let ctx = null;
  let positions = [];
  let lastMouseTime = 0;
  let lastX = 0, lastY = 0;
  let velocity = 0;
  let rafId = null;

  function init() {
    // Guard: mobile users should not reach here
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    canvas = document.getElementById('cursor-trail-canvas');
    if (!canvas) return;

    try {
      ctx = canvas.getContext('2d');
      if (!ctx) return;
    } catch (e) {
      console.warn('Canvas 2D context not available:', e);
      return;
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Handle resize
    const resizeHandler = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeHandler);

    // Track mouse movement
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);

    // Animation loop
    animate();
  }

  function onMouseMove(e) {
    const now = Date.now();
    lastMouseTime = now;

    // Calculate velocity
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    velocity = Math.sqrt(dx * dx + dy * dy);
    lastX = e.clientX;
    lastY = e.clientY;

    // Add position to trail
    positions.unshift({ x: e.clientX, y: e.clientY, time: now });
    if (positions.length > TRAIL_LENGTH) {
      positions.pop();
    }
  }

  function onMouseDown(e) {
    if (canvas && ctx && window.SoundSystem) {
      zapBurst(e.clientX, e.clientY);
    }
  }

  function animate() {
    rafId = requestAnimationFrame(animate);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate fade based on time since last movement
    const now = Date.now();
    const timeSinceMove = now - lastMouseTime;
    let opacity = 1 - Math.min(timeSinceMove / 300, 1);
    opacity = Math.max(0, opacity);

    // Scale brightness by velocity
    const velocityScale = Math.min(velocity / 5, 1);
    opacity *= velocityScale;

    if (positions.length > 1 && opacity > 0) {
      // Draw trail with three passes for depth
      // Outer glow
      ctx.strokeStyle = `rgba(0, 85, 255, ${0.08 * opacity})`;
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      drawTrail();

      // Main body
      ctx.strokeStyle = `rgba(0, 100, 255, ${0.35 * opacity})`;
      ctx.lineWidth = 2;
      drawTrail();

      // Bright core
      ctx.strokeStyle = `rgba(200, 220, 255, ${0.9 * opacity})`;
      ctx.lineWidth = 0.8;
      drawTrail();
    }
  }

  function drawTrail() {
    ctx.beginPath();
    for (let i = 0; i < positions.length; i++) {
      const pos = positions[i];
      // Add slight jitter to intermediate points for alive effect
      const jitterX = i > 0 && i < positions.length - 1 ? (Math.random() - 0.5) * 2 : 0;
      const jitterY = i > 0 && i < positions.length - 1 ? (Math.random() - 0.5) * 2 : 0;
      const x = pos.x + jitterX;
      const y = pos.y + jitterY;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  }

  function zapBurst(x, y) {
    const numArms = 8;
    const maxDistance = 140;
    const minDistance = 80;
    const startTime = Date.now();
    const zapDuration = 200;

    function drawZaps() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / zapDuration, 1);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < numArms; i++) {
        const angle = (i / numArms) * Math.PI * 2;
        const distance = minDistance + Math.random() * (maxDistance - minDistance);
        const endX = x + Math.cos(angle) * distance * progress;
        const endY = y + Math.sin(angle) * distance * progress;

        drawZapBolt(x, y, endX, endY);
      }

      if (progress < 1) {
        requestAnimationFrame(drawZaps);
      }
    }

    drawZaps();

    if (window.SoundSystem && window.SoundSystem.playZapBurst) {
      window.SoundSystem.playZapBurst();
    }
  }

  function drawZapBolt(startX, startY, endX, endY) {
    const steps = 20;
    let currentX = startX;
    let currentY = startY;

    ctx.strokeStyle = 'rgba(0, 85, 255, 0.7)';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(currentX, currentY);

    for (let i = 0; i < steps; i++) {
      const t = (i + 1) / steps;
      const targetX = startX + (endX - startX) * t;
      const targetY = startY + (endY - startY) * t;

      // Random offset for jagged effect
      const offsetX = (Math.random() - 0.5) * 8;
      const offsetY = (Math.random() - 0.5) * 8;

      currentX = targetX + offsetX;
      currentY = targetY + offsetY;

      ctx.lineTo(currentX, currentY);
    }

    ctx.stroke();
  }

  function cleanup() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mousedown', onMouseDown);
    window.removeEventListener('resize', arguments.callee);
    if (rafId) cancelAnimationFrame(rafId);
  }

  return {
    init,
    cleanup,
    triggerZap: zapBurst
  };
})();
