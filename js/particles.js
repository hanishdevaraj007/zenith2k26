/**
 * ZENITH 2K26 - Particle System
 * Three.js-based particle background with scroll vortex
 */

window.ParticleSystem = (function() {
  'use strict';

  let scene = null;
  let camera = null;
  let renderer = null;
  let points = null;
  let geometry = null;
  let originalPositions = null;
  let mouseX = 0, mouseY = 0;
  let isVisible = true;
  let rafId = null;
  let scrollTrigger = null;
  let isMobile = false;

  function init() {
    // Guard: only run on desktop
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    // Guard: THREE.js must be loaded
    if (typeof THREE === 'undefined') {
      console.warn('Three.js not loaded, skipping particle system');
      return;
    }

    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const container = canvas.parentElement;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    try {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.z = 5;

      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setClearColor(0xffffff, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    } catch (e) {
      console.warn('Failed to initialize Three.js:', e);
      return;
    }

    // Create particles
    geometry = new THREE.BufferGeometry();
    const vertices = [];
    const radius = 4;

    for (let i = 0; i < 800; i++) {
      let x, y, z;
      // Distribute in sphere
      const phi = Math.acos(-1 + (2 * i) / 800);
      const theta = Math.sqrt(800 * Math.PI) * phi;
      
      x = radius * Math.cos(theta) * Math.sin(phi);
      y = radius * Math.sin(theta) * Math.sin(phi);
      z = radius * Math.cos(phi);
      
      vertices.push(x, y, z);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    originalPositions = new Float32Array(vertices);

    const material = new THREE.PointsMaterial({
      color: 0x0055FF,
      size: 0.025,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.6
    });

    points = new THREE.Points(geometry, material);
    scene.add(points);

    // Handle resize with debounce
    let resizeTimeout = null;
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      }, 250);
    });
    resizeObserver.observe(container);

    // Mouse tracking
    document.addEventListener('mousemove', onMouseMove);

    // Intersection observer to pause when not visible
    const visibilityObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!isVisible) {
            isVisible = true;
            animate();
          }
        } else {
          isVisible = false;
          if (rafId) cancelAnimationFrame(rafId);
        }
      });
    }, { threshold: 0 });

    const heroSection = document.getElementById('hero');
    if (heroSection) {
      visibilityObserver.observe(heroSection);
    }

    // Setup scroll vortex trigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      setupScrollVortex();
    }

    animate();
  }

  function onMouseMove(e) {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  function setupScrollVortex() {
    const heroSection = document.getElementById('hero');
    if (!heroSection) return;

    scrollTrigger = ScrollTrigger.create({
      trigger: heroSection,
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => {
        const progress = self.progress;
        
        // Only apply vortex effect in second half of scroll
        if (progress > 0.5) {
          const vortexProgress = (progress - 0.5) * 2;
          applyVortex(vortexProgress);
          
          // Fade out particles
          if (points && points.material) {
            points.material.opacity = 0.6 * (1 - vortexProgress);
          }
        }
      }
    });
  }

  function applyVortex(progress) {
    if (!geometry || !originalPositions) return;

    const positions = geometry.attributes.position.array;
    const count = positions.length / 3;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = originalPositions[i3];
      const y = originalPositions[i3 + 1];
      const z = originalPositions[i3 + 2];

      // Calculate distance from center
      const dist = Math.sqrt(x * x + y * y + z * z);
      
      // Create vortex inward pull
      const angle = Math.atan2(y, x);
      const speed = 1 + progress * 5;
      const inwardPull = progress * 0.9;

      positions[i3] = x * (1 - inwardPull) + Math.cos(angle + progress * 3) * dist * inwardPull * 0.5;
      positions[i3 + 1] = y * (1 - inwardPull) + Math.sin(angle + progress * 3) * dist * inwardPull * 0.5;
      positions[i3 + 2] = z * (1 - inwardPull * 0.5);
    }

    geometry.attributes.position.needsUpdate = true;
  }

  function animate() {
    if (!isVisible || !renderer || !scene || !camera) return;

    rafId = requestAnimationFrame(animate);

    // Rotate particles
    if (points) {
      points.rotation.y += 0.0003;
      points.rotation.x += 0.0001;
    }

    // Mouse parallax on camera
    if (camera) {
      const targetX = mouseX * 0.4;
      const targetY = mouseY * 0.2;
      
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);
    }

    renderer.render(scene, camera);
  }

  function cleanup() {
    if (rafId) cancelAnimationFrame(rafId);
    document.removeEventListener('mousemove', onMouseMove);
    if (scrollTrigger) scrollTrigger.kill();
    if (renderer) renderer.dispose();
    if (geometry) geometry.dispose();
    if (points && points.material) points.material.dispose();
  }

  return {
    init,
    cleanup
  };
})();
