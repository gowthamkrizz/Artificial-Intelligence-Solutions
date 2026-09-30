/*!
 * home-sections.js — STACKLY
 * Premium GSAP 3 + ScrollTrigger Animation Engine
 */
(function () {
  'use strict';

  function initStacklyAnimations() {
    // Check if GSAP and ScrollTrigger are available
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP or ScrollTrigger not loaded. Content displayed in standard layout.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isMobile = window.innerWidth < 768;

    /* ─── 1. HEADING REVEAL ANIMATIONS ─── */
    if (!prefersReduced) {
      document.querySelectorAll('[data-gsap-split]').forEach(function (heading) {
        var nodes = Array.prototype.slice.call(heading.childNodes);
        heading.innerHTML = '';
        var wordWrappers = [];

        nodes.forEach(function (node) {
          if (node.nodeType === Node.TEXT_NODE) {
            var words = node.textContent.split(/(\s+)/);
            words.forEach(function (word) {
              if (/^\s+$/.test(word) || word === '') {
                heading.appendChild(document.createTextNode(word));
              } else {
                var outer = document.createElement('span');
                outer.style.display = 'inline-block';
                outer.style.overflow = 'hidden';
                outer.style.verticalAlign = 'bottom';

                var inner = document.createElement('span');
                inner.style.display = 'inline-block';
                inner.textContent = word;

                outer.appendChild(inner);
                heading.appendChild(outer);
                wordWrappers.push(inner);
              }
            });
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === 'BR') {
              heading.appendChild(document.createElement('br'));
            } else {
              var outer = document.createElement('span');
              outer.style.display = 'inline-block';
              outer.style.overflow = 'hidden';
              outer.style.verticalAlign = 'bottom';

              var inner = document.createElement('span');
              inner.style.display = 'inline-block';
              inner.appendChild(node.cloneNode(true));

              outer.appendChild(inner);
              heading.appendChild(outer);
              wordWrappers.push(inner);
            }
          }
        });

        if (wordWrappers.length > 0) {
          gsap.fromTo(wordWrappers, 
            { y: '100%', opacity: 0 },
            {
              y: '0%',
              opacity: 1,
              duration: 0.7,
              ease: 'power3.out',
              stagger: 0.05,
              scrollTrigger: {
                trigger: heading,
                start: 'top 90%',
                once: true
              }
            }
          );
        }
      });
    }

    /* ─── 2. CAPABILITY CARDS STAGGER ─── */
    var capCards = gsap.utils.toArray('.cap-card');
    if (capCards.length > 0 && !prefersReduced) {
      gsap.fromTo(capCards,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.capabilities-grid',
            start: 'top 90%',
            once: true
          }
        }
      );
    }

    /* ─── 3. SOLUTIONS SECTION REVEALS ─── */
    var solImage = document.querySelector('.solutions-img-wrapper');
    if (solImage && !prefersReduced && !isMobile) {
      gsap.fromTo(solImage,
        { scale: 0.95, opacity: 0.8 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.solutions-section',
            start: 'top 85%',
            once: true
          }
        }
      );
    }

    var solPoints = gsap.utils.toArray('.sol-point');
    if (solPoints.length > 0 && !prefersReduced) {
      gsap.fromTo(solPoints,
        { x: 30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: '.solutions-points',
            start: 'top 90%',
            once: true
          }
        }
      );
    }

    /* ─── 4. WORKFLOW LINE & NODES ACTIVATION ─── */
    var wfSteps = document.querySelectorAll('.wf-step');
    var wfLine = document.getElementById('wfLineFill');

    if (wfSteps.length > 0) {
      if (!prefersReduced && window.innerWidth > 900) {
        ScrollTrigger.create({
          trigger: '#workflowTrack',
          start: 'top 75%',
          end: 'bottom 55%',
          scrub: 0.6,
          onUpdate: function (self) {
            var progress = self.progress;
            if (wfLine) {
              wfLine.style.strokeDashoffset = 1200 * (1 - progress);
            }
            var total = wfSteps.length;
            wfSteps.forEach(function (step, i) {
              var threshold = i / (total - 1);
              if (progress >= threshold - 0.05) {
                step.classList.add('active');
              } else {
                step.classList.remove('active');
              }
            });
          }
        });
      } else {
        // Mobile or reduced motion: make all steps active
        wfSteps.forEach(function (s) {
          s.classList.add('active');
        });
      }
    }

    /* ─── 5. TECH SHOWCASE COUNTERS ─── */
    document.querySelectorAll('[data-count]').forEach(function (counterEl) {
      var target = parseFloat(counterEl.dataset.count) || 0;
      var prefix = counterEl.dataset.prefix || '';
      var suffix = counterEl.dataset.suffix || '';
      var isDecimal = target % 1 !== 0;
      var state = { val: 0 };

      ScrollTrigger.create({
        trigger: counterEl,
        start: 'top 92%',
        once: true,
        onEnter: function () {
          gsap.to(state, {
            val: target,
            duration: 1.6,
            ease: 'power2.out',
            onUpdate: function () {
              counterEl.textContent = prefix + (isDecimal ? state.val.toFixed(1) : Math.round(state.val)) + suffix;
            },
            onComplete: function () {
              counterEl.textContent = prefix + (isDecimal ? target.toFixed(1) : target) + suffix;
            }
          });
        }
      });
    });

    /* ─── 6. INDUSTRIES CARDS HOVER ─── */
    if (!prefersReduced) {
      document.querySelectorAll('.ind-card').forEach(function (card) {
        var img = card.querySelector('.ind-card-img');
        var body = card.querySelector('.ind-card-body');
        var arrow = card.querySelector('.ind-arrow');

        card.addEventListener('mouseenter', function () {
          if (img) gsap.to(img, { scale: 1.08, duration: 0.4, ease: 'power2.out' });
          if (body) gsap.to(body, { y: -4, duration: 0.3, ease: 'power2.out' });
          if (arrow) gsap.to(arrow, { x: 5, color: '#00f2fe', duration: 0.25 });
        });

        card.addEventListener('mouseleave', function () {
          if (img) gsap.to(img, { scale: 1, duration: 0.4, ease: 'power2.out' });
          if (body) gsap.to(body, { y: 0, duration: 0.3, ease: 'power2.out' });
          if (arrow) gsap.to(arrow, { x: 0, color: '#64748b', duration: 0.25 });
        });
      });
    }

    /* ─── 7. PROCESS TIMELINE PROGRESS ─── */
    var timelineFill = document.getElementById('timelineFill');
    if (timelineFill && !prefersReduced) {
      ScrollTrigger.create({
        trigger: '#processTimeline',
        start: 'top 75%',
        end: 'bottom 50%',
        scrub: 1,
        onUpdate: function (self) {
          timelineFill.style.height = (self.progress * 100) + '%';
        }
      });
    }

    /* ─── 8. PERFORMANCE GRAPH ANIMATION ─── */
    var perfLine = document.querySelector('.perf-line');
    if (perfLine) {
      ScrollTrigger.create({
        trigger: '.perf-graph-wrapper',
        start: 'top 85%',
        once: true,
        onEnter: function () {
          perfLine.classList.add('animate');
          var areaFill = document.querySelector('.perf-area-fill');
          var glowDot = document.getElementById('perfDot');
          if (areaFill) areaFill.classList.add('animate');
          if (glowDot) glowDot.classList.add('animate');
        }
      });
    }

    /* ─── 9. CANVAS BACKGROUND PARTICLES ─── */
    function initCanvasParticles(canvasId, count, color) {
      var canvas = document.getElementById(canvasId);
      if (!canvas || prefersReduced) return;
      var ctx = canvas.getContext('2d');
      var parent = canvas.parentElement;

      function resize() {
        if (!parent) return;
        canvas.width = parent.offsetWidth || 800;
        canvas.height = parent.offsetHeight || 500;
      }
      resize();
      window.addEventListener('resize', resize);

      var particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.5 + 0.5,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          alpha: Math.random() * 0.5 + 0.2
        });
      }

      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(function (p) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(' + color + ',' + p.alpha + ')';
          ctx.fill();
        });
        requestAnimationFrame(draw);
      }
      draw();
    }

    initCanvasParticles('solutionsCanvas', 24, '0,242,254');
    initCanvasParticles('perfParticleCanvas', 36, '0,242,254');

    // Refresh ScrollTrigger on resize
    window.addEventListener('resize', function () {
      ScrollTrigger.refresh();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStacklyAnimations);
  } else {
    initStacklyAnimations();
  }
})();
