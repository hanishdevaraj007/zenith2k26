/**
 * ZENITH 2K26 - Button Crack Effect
 * SVG-based crack animation on button interaction
 */

window.ButtonCrack = (function() {
  'use strict';

  const processedButtons = new WeakSet();
  let observer = null;

  function createCrackEffect(button) {
    if (processedButtons.has(button)) return;
    processedButtons.add(button);

    let svg = null;
    let isAnimating = false;

    button.addEventListener('mouseenter', onMouseEnter);
    button.addEventListener('mouseleave', onMouseLeave);
    button.addEventListener('mousedown', onMouseDown);

    function onMouseEnter() {
      if (isAnimating || svg) return;

      const rect = button.getBoundingClientRect();
      svg = createSVGElement(rect);
      button.style.position = 'relative';
      button.appendChild(svg);

      // Draw crack lines
      const crackLines = generateCracks(rect.width, rect.height, 5);
      crackLines.forEach((line, i) => {
        const path = createPathElement();
        path.setAttribute('d', generatePathData(line));
        
        const totalLength = path.getTotalLength();
        path.style.strokeDasharray = totalLength;
        path.style.strokeDashoffset = totalLength;

        svg.appendChild(path);

        if (typeof gsap !== 'undefined') {
          gsap.to(path.style, {
            strokeDashoffset: 0,
            duration: 0.4,
            ease: 'power2.out',
            delay: i * 0.05
          });
        }
      });

      // Glow effect
      if (typeof gsap !== 'undefined') {
        gsap.to(button, {
          boxShadow: '0 0 20px rgba(0, 85, 255, 0.8)',
          duration: 0.3
        });
      }
    }

    function onMouseLeave() {
      if (svg && !isAnimating && typeof gsap !== 'undefined') {
        gsap.to(svg, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            if (svg && svg.parentNode) {
              svg.parentNode.removeChild(svg);
              svg = null;
            }
          }
        });

        gsap.to(button, {
          boxShadow: '0 0 0px rgba(0, 85, 255, 0)',
          duration: 0.3
        });
      }
    }

    function onMouseDown() {
      if (!svg || isAnimating) return;
      isAnimating = true;

      // Snap cracks to full extent
      const paths = svg.querySelectorAll('path');
      paths.forEach((path) => {
        if (typeof gsap !== 'undefined') {
          gsap.set(path.style, { strokeDashoffset: 0 });
        }
      });

      // Create and animate shards
      const rect = button.getBoundingClientRect();
      const shards = generateShards(rect.width, rect.height, 12);

      shards.forEach((shard) => {
        const polygon = createPolygonElement(shard);
        svg.appendChild(polygon);

        if (typeof gsap !== 'undefined') {
          gsap.to(polygon, {
            x: shard.vx,
            y: shard.vy,
            opacity: 0,
            rotation: shard.rotation,
            duration: 0.38,
            ease: 'power2.out'
          });
        }
      });

      // Play sound and reset after animation
      setTimeout(() => {
        isAnimating = false;
        if (window.SoundSystem && window.SoundSystem.playButtonActivate) {
          window.SoundSystem.playButtonActivate();
        }
      }, 380);
    }
  }

  function createSVGElement(rect) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', rect.width);
    svg.setAttribute('height', rect.height);
    svg.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = '10';

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', `glow-${Date.now()}`);
    const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    feGaussianBlur.setAttribute('stdDeviation', '2');
    filter.appendChild(feGaussianBlur);
    defs.appendChild(filter);
    svg.appendChild(defs);

    return svg;
  }

  function createPathElement() {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('stroke', 'rgba(0, 85, 255, 0.6)');
    path.setAttribute('stroke-width', '0.5');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    return path;
  }

  function createPolygonElement(shard) {
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', shard.points);
    polygon.setAttribute('fill', 'rgba(0, 85, 255, 0.4)');
    polygon.setAttribute('stroke', 'rgba(0, 85, 255, 0.8)');
    polygon.setAttribute('stroke-width', '0.5');
    polygon.style.position = 'absolute';
    polygon.style.pointerEvents = 'none';
    return polygon;
  }

  function generateCracks(width, height, numLines) {
    const lines = [];
    for (let i = 0; i < numLines; i++) {
      const startX = Math.random() * width;
      const startY = Math.random() * height;
      const angle = Math.random() * Math.PI * 2;
      const length = 30 + Math.random() * 50;
      const endX = startX + Math.cos(angle) * length;
      const endY = startY + Math.sin(angle) * length;
      lines.push({ x1: startX, y1: startY, x2: endX, y2: endY });
    }
    return lines;
  }

  function generatePathData(line) {
    return `M${line.x1},${line.y1} L${line.x2},${line.y2}`;
  }

  function generateShards(width, height, count) {
    const shards = [];
    for (let i = 0; i < count; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const angle = (i / count) * Math.PI * 2;
      const distance = 80 + Math.random() * 100;
      const vx = Math.cos(angle) * distance;
      const vy = Math.sin(angle) * distance;
      const size = 5 + Math.random() * 10;
      const rotation = Math.random() * 360;

      const points = `${-size},${-size} ${size},${-size} ${size},${size}`;

      shards.push({
        x,
        y,
        points,
        vx,
        vy,
        rotation
      });
    }
    return shards;
  }

  function init() {
    // Guard: skip if no buttons present
    if (!document.querySelector('.btn-crack')) return;

    // Set up mutation observer for dynamic buttons
    if (!observer) {
      observer = new MutationObserver(() => {
        const allButtons = document.querySelectorAll('.btn-crack');
        allButtons.forEach((btn) => {
          createCrackEffect(btn);
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }

    // Initialize existing buttons
    const buttons = document.querySelectorAll('.btn-crack');
    buttons.forEach((btn) => {
      createCrackEffect(btn);
    });
  }

  function cleanup() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  return {
    init,
    cleanup
  };
})();
