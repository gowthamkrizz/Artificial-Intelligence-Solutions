/* ==========================================================================
   STACKLY — Enhancements JS v2.0
   Scroll reveal, counter animations, particle dots, magnetic buttons
   ========================================================================== */

(function () {
  'use strict';

  /* ── 1. Intersection Observer: scroll reveal ──────────────────────────── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  // Auto-apply data-reveal to key sections on load
  function setupRevealElements() {
    const selectors = [
      '.cap-card',
      '.ind-card',
      '.perf-card',
      '.perf-graph-wrapper',
      '.tl-item',
      '.sol-point',
      '.ts-metric',
      '.review-card',
      '.hud-internal-card',
      '.animated-feature-pill',
      '.capabilities-heading',
      '.solutions-heading',
      '.workflow-heading',
      '.techshow-heading',
      '.industries-heading',
      '.process-heading',
      '.performance-heading',
      '.capabilities-sub',
      '.workflow-sub',
      '.industries-sub',
      '.performance-sub',
      '.section-eyebrow',
    ];

    selectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el, i) => {
        if (!el.hasAttribute('data-reveal')) {
          el.setAttribute('data-reveal', '');
          // Stagger delay based on sibling index (capped at 6)
          const delay = Math.min(i % 6 + 1, 6);
          el.setAttribute('data-delay', delay);
          revealObserver.observe(el);
        }
      });
    });
  }

  /* ── 2. Animated counter for numeric elements ────────────────────────── */
  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-count') || el.textContent);
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800;
    const start = performance.now();
    const isDecimal = target % 1 !== 0;

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;
      el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  function setupCounters() {
    const counterEls = document.querySelectorAll('[data-count]');
    if (!counterEls.length) return;

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counterEls.forEach((el) => counterObserver.observe(el));
  }

  /* ── 3. CSS particle dots in hero section ────────────────────────────── */
  function spawnHeroParticles() {
    const hero = document.querySelector('.hero-ai-master');
    if (!hero) return;

    const colors = ['#00f2fe', '#a855f7', '#3b82f6', '#ff007a', '#00ff87'];
    const count = 18;

    for (let i = 0; i < count; i++) {
      const dot = document.createElement('div');
      dot.className = 'particle-dot';

      const size = Math.random() * 3 + 1.5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const duration = Math.random() * 8 + 6;
      const delay = Math.random() * 6;

      dot.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        box-shadow: 0 0 ${size * 3}px ${color};
        left: ${left}%;
        top: ${top}%;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
      `;

      hero.appendChild(dot);
    }
  }

  /* ── 4. Magnetic button effect on primary CTAs ───────────────────────── */
  function setupMagneticButtons() {
    const buttons = document.querySelectorAll(
      '.btn-hero-primary, .btn-sol-primary, .btn-tech-primary, .btn-contact-pill'
    );

    buttons.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const strength = 0.25;
        btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => (btn.style.transition = ''), 400);
      });
    });
  }

  /* ── 5. Tilt on cards ────────────────────────────────────────────────── */
  function setupCardTilt() {
    const cards = document.querySelectorAll('.cap-card, .ind-card, .perf-card');

    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        card.style.transform = `
          perspective(800px)
          rotateX(${-y * 6}deg)
          rotateY(${x * 6}deg)
          translateY(-10px)
          scale(1.01)
        `;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => (card.style.transition = ''), 500);
      });
    });
  }

  /* ── 5.1 Performance Progress Meters ─────────────────────────────────── */
  function setupPerformanceMeters() {
    const fills = document.querySelectorAll('.perf-meter-fill');
    if (!fills.length) return;

    const meterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            meterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    fills.forEach((fill) => meterObserver.observe(fill));
  }

  /* ── 6. Active nav link highlight on scroll ──────────────────────────── */
  function setupActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.neuro-nav-item');
    if (!sections.length || !navItems.length) return;

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navItems.forEach((item) => {
              item.classList.remove('active');
              if (item.getAttribute('href')?.includes(id)) {
                item.classList.add('active');
              }
            });
          }
        });
      },
      { threshold: 0.4, rootMargin: '-100px 0px -60% 0px' }
    );

    sections.forEach((sec) => sectionObserver.observe(sec));
  }

  /* ── 7. Fixed header on scroll ───────────────────────────────────────── */
  function setupHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    function handleScroll() {
      const y = window.scrollY;
      if (y > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* ── 8. Glowing cursor trail (subtle) ───────────────────────────────── */
  function setupCursorGlow() {
    const trail = document.createElement('div');
    trail.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(0,242,254,0.3), transparent);
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      transition: left 0.08s ease, top 0.08s ease;
    `;
    document.body.appendChild(trail);

    document.addEventListener('mousemove', (e) => {
      trail.style.left = e.clientX + 'px';
      trail.style.top = e.clientY + 'px';
    });

    // Hide on mobile
    if ('ontouchstart' in window) {
      trail.style.display = 'none';
    }
  }

  /* ── 9. Stagger children animation on sections ───────────────────────── */
  function staggerAnimations() {
    const grids = document.querySelectorAll(
      '.capabilities-grid, .industries-grid, .techshow-metric-grid, .perf-cards-row'
    );

    grids.forEach((grid) => {
      const children = Array.from(grid.children);
      const gridObserver = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            children.forEach((child, i) => {
              setTimeout(() => {
                child.style.opacity = '1';
                child.style.transform = 'translateY(0)';
              }, i * 120);
            });
            gridObserver.unobserve(grid);
          }
        },
        { threshold: 0.1 }
      );

      // Initially hide children
      children.forEach((child) => {
        child.style.opacity = '0';
        child.style.transform = 'translateY(30px)';
        child.style.transition = 'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)';
      });

      gridObserver.observe(grid);
    });
  }

  /* ── 9.1 Graph HUD Interactive Telemetry Simulation ─────────────────── */
  function setupGraphHudInteractions() {
    const hud = document.getElementById('perfGraphHud');
    if (!hud) return;

    // 1. Live Jitter Simulator for TPS and P99
    const tpsEl = document.getElementById('liveTps');
    const p99El = document.getElementById('liveP99');

    if (tpsEl && p99El) {
      setInterval(() => {
        const baseTps = 184.2;
        const jitterTps = (baseTps + (Math.random() * 2.4 - 1.2)).toFixed(1);
        tpsEl.textContent = `${jitterTps} t/s`;

        const baseP99 = 11.4;
        const jitterP99 = (baseP99 + (Math.random() * 0.6 - 0.3)).toFixed(1);
        p99El.textContent = `${jitterP99}ms`;
      }, 1200);
    }

    // 2. Interactive Milestone Hotspots & Bottom Cards
    const nodes = hud.querySelectorAll('.perf-node-circle');
    const labelCards = hud.querySelectorAll('.perf-label-card');
    const dot = document.getElementById('perfDot');
    const tooltip = document.getElementById('perfActiveTooltip');

    const milestones = [
      { x: '7.5%', y: '172px', title: 'Q1 BASELINE', stat: '32 t/s · 48ms' },
      { x: '25%', y: '138px', title: 'Q2 FP8 QUANT', stat: '74 t/s · 31ms' },
      { x: '42.5%', y: '95px', title: 'Q3 SWARM MESH', stat: '115 t/s · 22ms' },
      { x: '60%', y: '70px', title: 'Q4 AIR-GAP VPC', stat: '142 t/s · 16ms' },
      { x: '77.5%', y: '45px', title: 'Q5 EDGE NODES', stat: '168 t/s · 13ms' },
      { x: '95%', y: '18px', title: 'Q6 PEAK SCALE', stat: '184.2 t/s · 11.4ms (99.99% SLA)' }
    ];

    function activateMilestone(idx) {
      if (idx < 0 || idx >= milestones.length) return;
      const m = milestones[idx];

      nodes.forEach((n, i) => n.classList.toggle('active', i === idx));
      labelCards.forEach((c, i) => c.classList.toggle('active', i === idx));

      if (dot && tooltip) {
        dot.style.left = m.x;
        dot.style.top = m.y;
        tooltip.innerHTML = `
          <span class="tooltip-badge">${m.title}</span>
          <span class="tooltip-body">${m.stat}</span>
        `;
      }
    }

    nodes.forEach((node, idx) => {
      node.addEventListener('mouseenter', () => activateMilestone(idx));
      node.addEventListener('click', () => activateMilestone(idx));
    });

    labelCards.forEach((card, idx) => {
      card.addEventListener('mouseenter', () => activateMilestone(idx));
      card.addEventListener('click', () => activateMilestone(idx));
    });

    // 3. Tab Switcher
    const tabs = hud.querySelectorAll('.perf-tab');
    const line = document.getElementById('perfGraphLine');
    const area = hud.querySelector('.perf-area-fill');
    const latencyLine = hud.querySelector('.perf-latency-line');

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        const trace = tab.getAttribute('data-trace');
        if (trace === 'latency') {
          if (line) line.style.opacity = '0.25';
          if (area) area.style.opacity = '0.15';
          if (latencyLine) {
            latencyLine.style.opacity = '1';
            latencyLine.style.strokeWidth = '4';
          }
        } else if (trace === 'swarm') {
          if (line) {
            line.style.opacity = '1';
            line.style.stroke = 'url(#latencyLineGrad)';
          }
          if (area) area.style.opacity = '0.6';
          if (latencyLine) latencyLine.style.opacity = '0.8';
        } else {
          // Throughput (default)
          if (line) {
            line.style.opacity = '1';
            line.style.stroke = 'url(#lineGrad)';
          }
          if (area) area.style.opacity = '0.9';
          if (latencyLine) {
            latencyLine.style.opacity = '0.6';
            latencyLine.style.strokeWidth = '2.2';
          }
        }
      });
    });
  }

  /* ── 10. Init ─────────────────────────────────────────────────────────── */
  function init() {
    setupRevealElements();
    setupCounters();
    spawnHeroParticles();
    setupMagneticButtons();
    setupCardTilt();
    setupPerformanceMeters();
    setupGraphHudInteractions();
    setupActiveNavOnScroll();
    setupHeaderScroll();
    setupCursorGlow();
    staggerAnimations();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
