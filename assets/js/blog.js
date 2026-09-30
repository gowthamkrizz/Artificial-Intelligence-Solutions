/* ==========================================================================
   STACKLY AI - BLOG PAGE JAVASCRIPT
   Interaction & Animation Engine (GSAP 3 + ScrollTrigger + AOS)
   ========================================================================== */

(function () {
  'use strict';

  // 1. Initialize AOS
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50
    });
    window.addEventListener('load', () => AOS.refresh());
  }

  // 2. Register GSAP Plugins
  const gsapReady = typeof gsap !== 'undefined';
  const stReady = typeof ScrollTrigger !== 'undefined';
  if (gsapReady && stReady) {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ──────────────────────────────────────────
     SECTION 1 — FEATURED ARTICLE CLIP-PATH REVEAL
  ────────────────────────────────────────── */
  function initFeaturedAnimation() {
    if (!gsapReady) return;

    const featuredSection = document.querySelector('.featured-intel-section');
    if (!featuredSection) return;

    const imgFrame = featuredSection.querySelector('.featured-img-frame');
    const img = featuredSection.querySelector('.featured-img');
    const title = featuredSection.querySelector('.featured-title');

    if (imgFrame) {
      gsap.fromTo(
        imgFrame,
        { clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' },
        {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          duration: 1.2,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: featuredSection,
            start: 'top 75%'
          }
        }
      );
    }

    if (img) {
      gsap.fromTo(
        img,
        { scale: 1.15 },
        {
          scale: 1,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: featuredSection,
            start: 'top 75%'
          }
        }
      );
    }
  }

  /* ──────────────────────────────────────────
     SECTION 2 — CATEGORY FILTER SWITCHER
  ────────────────────────────────────────── */
  function initFilterSwitcher() {
    const filterBtns = document.querySelectorAll('.insight-filter-btn');
    const cards = document.querySelectorAll('.editorial-card');

    if (!filterBtns.length || !cards.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter') || 'all';

        cards.forEach(card => {
          const category = card.getAttribute('data-category') || '';
          if (filter === 'all' || category.includes(filter)) {
            card.style.display = 'flex';
            if (gsapReady) {
              gsap.fromTo(card, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
            }
          } else {
            card.style.display = 'none';
          }
        });

        if (typeof AOS !== 'undefined') AOS.refresh();
      });
    });
  }

  /* ──────────────────────────────────────────
     SECTION 3 — RESEARCH DEEP-DIVE PARALLAX & HUD ANIMATIONS
  ────────────────────────────────────────── */
  function initDeepDiveParallax() {
    if (!gsapReady || !stReady) return;

    const deepSection = document.querySelector('.deep-dive-section');
    if (!deepSection) return;

    const deepImg = deepSection.querySelector('.deep-img');
    const floatTop = deepSection.querySelector('.deep-float-panel.top-left');
    const floatBottom = deepSection.querySelector('.deep-float-panel.bottom-right');
    const floatChip = deepSection.querySelector('.deep-float-panel.top-right-chip');
    const topicCards = deepSection.querySelectorAll('.deep-topic-card');

    if (deepImg) {
      gsap.to(deepImg, {
        yPercent: 10,
        scale: 1.06,
        ease: 'none',
        scrollTrigger: {
          trigger: deepSection,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    // Floating Sinusoidal Oscillations
    if (floatTop) {
      gsap.to(floatTop, {
        y: '-=12',
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }

    if (floatBottom) {
      gsap.to(floatBottom, {
        y: '+=14',
        duration: 3.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.5
      });
    }

    if (floatChip) {
      gsap.to(floatChip, {
        y: '-=10',
        duration: 4.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1
      });
    }

    // Scroll parallax adjustments
    if (floatTop && floatBottom) {
      gsap.to(floatTop, {
        y: -35,
        ease: 'none',
        scrollTrigger: {
          trigger: deepSection,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2
        }
      });

      gsap.to(floatBottom, {
        y: 40,
        ease: 'none',
        scrollTrigger: {
          trigger: deepSection,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2
        }
      });
    }

    // Subtle Topic Cards hover lift & entrance guarantee
    if (topicCards.length) {
      topicCards.forEach(card => {
        card.style.opacity = '1';
        card.style.visibility = 'visible';
      });
    }
  }



  /* ──────────────────────────────────────────
     SECTION 4 — TRENDING PERSPECTIVES (HORIZONTAL CYBER CAROUSEL)
  ────────────────────────────────────────── */
  function initPerspectivesAnimation() {
    const panels = document.querySelectorAll('.trending-panel');
    const scrollTrack = document.getElementById('trending-scroll-track');
    const prevBtn = document.getElementById('trend-prev');
    const nextBtn = document.getElementById('trend-next');
    const progressFill = document.getElementById('trend-progress-fill');
    const counterElem = document.getElementById('trend-counter');
    const dots = document.querySelectorAll('.trend-dot');

    if (!panels.length || !scrollTrack) return;

    panels.forEach(p => {
      p.style.opacity = '1';
      p.style.visibility = 'visible';
    });

    function updateActiveState() {
      const maxScroll = scrollTrack.scrollWidth - scrollTrack.clientWidth;
      const currentScroll = scrollTrack.scrollLeft;
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, currentScroll / maxScroll)) : 0;
      
      if (progressFill) {
        const percent = Math.max(12.5, Math.min(100, 12.5 + progress * 87.5));
        progressFill.style.width = percent + '%';
      }

      // Calculate which panel is closest to viewport center
      const trackCenter = scrollTrack.scrollLeft + (scrollTrack.clientWidth / 2);
      let closestIdx = 0;
      let minDiff = Infinity;

      panels.forEach((p, idx) => {
        const pCenter = p.offsetLeft + (p.offsetWidth / 2);
        const diff = Math.abs(trackCenter - pCenter);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = idx;
        }
      });

      if (counterElem) {
        const numStr = (closestIdx + 1).toString().padStart(2, '0');
        const totalStr = panels.length.toString().padStart(2, '0');
        counterElem.textContent = `DISPATCH ${numStr} / ${totalStr}`;
      }

      dots.forEach((dot, dIdx) => {
        dot.classList.toggle('active', dIdx === closestIdx);
      });

      panels.forEach((p, pIdx) => {
        p.classList.toggle('is-active', pIdx === closestIdx);
      });
    }

    // Horizontal Scroll Event Listener
    scrollTrack.addEventListener('scroll', updateActiveState, { passive: true });

    // Initial state update
    setTimeout(updateActiveState, 100);

    // Mouse Wheel Horizontal Scroll Listener
    scrollTrack.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > 5) {
        const maxScroll = scrollTrack.scrollWidth - scrollTrack.clientWidth;
        // If track can still scroll in the given direction, scroll it horizontally
        if ((e.deltaY > 0 && scrollTrack.scrollLeft < maxScroll - 5) || (e.deltaY < 0 && scrollTrack.scrollLeft > 5)) {
          e.preventDefault();
          scrollTrack.scrollBy({
            left: e.deltaY * 1.5,
            behavior: 'auto'
          });
        }
      }
    }, { passive: false });

    // Navigation Buttons (Prev / Next)
    if (prevBtn) {
      prevBtn.onclick = (e) => {
        e.preventDefault();
        const step = (panels[0] ? panels[0].offsetWidth : 350) + 26;
        scrollTrack.scrollBy({ left: -step, behavior: 'smooth' });
      };
    }

    if (nextBtn) {
      nextBtn.onclick = (e) => {
        e.preventDefault();
        const step = (panels[0] ? panels[0].offsetWidth : 350) + 26;
        scrollTrack.scrollBy({ left: step, behavior: 'smooth' });
      };
    }

    // Dot Navigation Jump
    dots.forEach((dot, dIdx) => {
      dot.onclick = (e) => {
        e.preventDefault();
        if (panels[dIdx]) {
          const targetLeft = panels[dIdx].offsetLeft - scrollTrack.offsetLeft - 10;
          scrollTrack.scrollTo({ left: targetLeft, behavior: 'smooth' });
        }
      };
    });

    // Drag-To-Scroll Physics with Momentum
    let isDown = false;
    let startX = 0;
    let startScrollLeft = 0;

    scrollTrack.addEventListener('mousedown', (e) => {
      if (e.target.closest('a') || e.target.closest('button')) return;
      isDown = true;
      scrollTrack.classList.add('is-dragging');
      startX = e.pageX - scrollTrack.offsetLeft;
      startScrollLeft = scrollTrack.scrollLeft;
    });

    window.addEventListener('mouseup', () => {
      if (!isDown) return;
      isDown = false;
      scrollTrack.classList.remove('is-dragging');
    });

    scrollTrack.addEventListener('mouseleave', () => {
      if (!isDown) return;
      isDown = false;
      scrollTrack.classList.remove('is-dragging');
    });

    scrollTrack.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - scrollTrack.offsetLeft;
      const walk = (x - startX) * 1.8;
      scrollTrack.scrollLeft = startScrollLeft - walk;
    });
  }





  /* ──────────────────────────────────────────
     SECTION 5 — KNOWLEDGE HUB PARALLAX & REVEAL
  ────────────────────────────────────────── */
  function initHubAnimations() {
    if (!gsapReady || !stReady) return;

    const hubCards = document.querySelectorAll('.hub-card');
    if (!hubCards.length) return;

    hubCards.forEach((card, idx) => {
      const bgImg = card.querySelector('.hub-bg-img');
      const topHud = card.querySelector('.hub-top-hud');
      const content = card.querySelector('.hub-card-content');

      if (bgImg) {
        gsap.fromTo(
          bgImg,
          { scale: 1.2, yPercent: -5 },
          {
            scale: 1,
            yPercent: 5,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.5
            }
          }
        );
      }

      if (topHud) {
        gsap.from(topHud, {
          opacity: 0,
          y: -15,
          duration: 0.8,
          delay: 0.2 + idx * 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%'
          }
        });
      }

      if (content) {
        gsap.from(content, {
          opacity: 0,
          y: 25,
          duration: 0.9,
          delay: 0.3 + idx * 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%'
          }
        });
      }
    });
  }

  /* ──────────────────────────────────────────
     SECTION 6 — NEWSLETTER 3D SINGULARITY PARALLAX
  ────────────────────────────────────────── */
  function initNewsletterAnimation() {
    if (!gsapReady || !stReady) return;

    const newsSection = document.querySelector('.blog-newsletter-section');
    if (!newsSection) return;

    const orbCore = newsSection.querySelector('.news-orb-core');
    const orbContainer = newsSection.querySelector('.news-orb-container');
    const satellites = newsSection.querySelectorAll('.news-satellite');

    if (orbContainer) {
      // Slow sinusoidal floating wobble
      gsap.to(orbContainer, {
        y: -14,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Scroll parallax rotation & scale
      gsap.to(orbContainer, {
        rotate: 15,
        scale: 1.08,
        ease: 'none',
        scrollTrigger: {
          trigger: newsSection,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5
        }
      });
    }

    if (satellites.length) {
      satellites.forEach((sat, i) => {
        gsap.to(sat, {
          y: i % 2 === 0 ? '-=10' : '+=12',
          duration: 3 + i * 0.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.4
        });
      });
    }
  }

  // Initializer
  function initAll() {
    initFeaturedAnimation();
    initFilterSwitcher();
    initDeepDiveParallax();
    initPerspectivesAnimation();
    initHubAnimations();
    initNewsletterAnimation();

    if (typeof ScrollTrigger !== 'undefined') {
      setTimeout(() => ScrollTrigger.refresh(), 200);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  window.addEventListener('load', () => {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  });

})();

