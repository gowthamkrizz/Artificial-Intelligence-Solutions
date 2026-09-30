/* ==========================================================================
   STACKLY AI - ABOUT PAGE JAVASCRIPT
   Clean, performant animation controller (GSAP + AOS + Canvas FX)
   ========================================================================== */

(function () {
  'use strict';

  // 1. Initialize AOS (Animate On Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
      disableMutationObserver: false
    });
    window.addEventListener('load', () => AOS.refresh());
  }

  // 2. Register GSAP Plugins if available
  const gsapReady = typeof gsap !== 'undefined';
  const stReady = typeof ScrollTrigger !== 'undefined';
  if (gsapReady && stReady) {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ──────────────────────────────────────────
     SECTION 3 — STAGE STATION RAIL INTERACTION
  ────────────────────────────────────────── */
  function initTimeline() {
    const stationNodes = document.querySelectorAll('.station-node');
    const matrixCards = document.querySelectorAll('.matrix-card');

    if (!stationNodes.length || !matrixCards.length) return;

    stationNodes.forEach((node, idx) => {
      node.addEventListener('mouseenter', () => {
        stationNodes.forEach(n => n.classList.remove('active'));
        node.classList.add('active');
        if (matrixCards[idx]) {
          matrixCards[idx].style.transform = 'translateY(-10px) scale(1.02)';
          matrixCards[idx].style.borderColor = 'var(--cyan)';
        }
      });

      node.addEventListener('mouseleave', () => {
        if (matrixCards[idx]) {
          matrixCards[idx].style.transform = '';
          matrixCards[idx].style.borderColor = '';
        }
      });
    });
  }

  /* ──────────────────────────────────────────
     NUMBER COUNTER ANIMATION
  ────────────────────────────────────────── */
  function initCounters() {
    const counterElements = document.querySelectorAll('.gsap-counter, .gsap-counter-float, .gsap-counter-action');
    if (!counterElements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetVal = parseFloat(el.getAttribute('data-val') || el.textContent);
          const isFloat = el.classList.contains('gsap-counter-float') || targetVal % 1 !== 0;
          const duration = 2000;
          const startTime = performance.now();

          function updateCount(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            const currentVal = targetVal * ease;

            el.textContent = isFloat ? currentVal.toFixed(1) : Math.round(currentVal);

            if (progress < 1) {
              requestAnimationFrame(updateCount);
            } else {
              el.textContent = isFloat ? targetVal.toFixed(1) : targetVal;
            }
          }

          requestAnimationFrame(updateCount);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    counterElements.forEach(el => observer.observe(el));
  }

  /* ──────────────────────────────────────────
     CANVAS PARTICLE BACKGROUNDS
  ────────────────────────────────────────── */
  function initCanvases() {
    // Canvas 1: Journey Timeline Data Stream
    const jtlCanvas = document.getElementById('jtlCanvas');
    if (jtlCanvas) {
      const ctx = jtlCanvas.getContext('2d');
      let W, H;

      function resize() {
        W = jtlCanvas.width = jtlCanvas.offsetWidth;
        H = jtlCanvas.height = jtlCanvas.offsetHeight;
      }
      resize();
      window.addEventListener('resize', resize);

      const lines = Array.from({ length: 20 }, () => ({
        x: Math.random() * (W || 1200),
        y: Math.random() * (H || 800),
        len: Math.random() * 80 + 40,
        speed: Math.random() * 0.8 + 0.3,
        color: Math.random() > 0.5 ? 'rgba(0, 242, 254, 0.15)' : 'rgba(168, 85, 247, 0.15)'
      }));

      function render() {
        ctx.clearRect(0, 0, W, H);
        lines.forEach(l => {
          l.y += l.speed;
          if (l.y > H + l.len) l.y = -l.len;
          ctx.fillStyle = l.color;
          ctx.fillRect(l.x, l.y, 1, l.len);
        });
        requestAnimationFrame(render);
      }
      render();
    }
  }

  // Run initializers on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initTimeline();
      initCounters();
      initCanvases();
    });
  } else {
    initTimeline();
    initCounters();
    initCanvases();
  }

})();
