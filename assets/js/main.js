/* ==========================================================================
   STACKLY - AI Agency & Technology Theme
   Main Interaction & UI Logic (with Animated Typing Text)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Fixed Header with Smooth Scroll Blur & Background Transition
  const header = document.querySelector('.site-header');
  const mobileToggle = document.getElementById('neuroMobileToggle');
  const mobileMenu = document.getElementById('neuroMobileMenu');

  function updateHeaderOnScroll() {
    if (!header) return;
    const isScrolled = window.scrollY > 20;

    if (isScrolled) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });
  updateHeaderOnScroll();

  // Mobile Menu Toggle Interaction
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen);
      document.body.classList.toggle('menu-open', isOpen);
      document.documentElement.classList.toggle('menu-open', isOpen);

      if (isOpen && typeof gsap !== 'undefined') {
        gsap.fromTo(mobileMenu.querySelectorAll('.neuro-mobile-nav-item, .btn-mobile-auth'), 
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out' }
        );
      }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (mobileMenu.classList.contains('open') && !header.contains(e.target)) {
        mobileMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
        document.documentElement.classList.remove('menu-open');
      }
    });

    // Close mobile menu when clicking any nav item
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
        document.documentElement.classList.remove('menu-open');
      });
    });
  }

  // 2. Dynamic Rotating Typing Text Animation for Hero
  const typedTarget = document.getElementById('animated-typed-text');
  if (typedTarget) {
    const phrases = [
      "Today’s AI",
      "Sovereign LLMs",
      "Neural Swarms",
      "Cognitive Agents",
      "Edge Vision AI"
    ];
    let phraseIndex = 0;
    let charIndex = phrases[0].length;
    let isDeleting = false;
    let typeSpeed = 100;

    function typeLoop() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        typedTarget.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
      } else {
        typedTarget.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 110;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        // Pause at end of word
        isDeleting = true;
        typeSpeed = 2200;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 400;
      }

      setTimeout(typeLoop, typeSpeed);
    }

    // Start typing after initial pause
    setTimeout(typeLoop, 2500);
  }

  // 3. Mobile Menu Toggle (Fallback handler)
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      const isOpen = navMenu.classList.toggle('open');
      document.body.classList.toggle('menu-open', isOpen);
      document.documentElement.classList.toggle('menu-open', isOpen);
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('open')) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('open');
        document.body.classList.remove('menu-open');
        document.documentElement.classList.remove('menu-open');
      }
    });

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('open');
        document.body.classList.remove('menu-open');
        document.documentElement.classList.remove('menu-open');
      });
    });
  }

  // 4. Scroll Reveal Observer
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  }

  // 5. Number Counters
  const counterElements = document.querySelectorAll('.stat-count');
  let counted = false;

  function runCounters() {
    if (counted) return;
    const statsBar = document.querySelector('.hero-stats-bar, .stats-counter-grid');
    if (!statsBar) return;

    const rect = statsBar.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom >= 0) {
      counted = true;
      counterElements.forEach((counter) => {
        const target = parseFloat(counter.getAttribute('data-target') || '0');
        const duration = 1800;
        const stepTime = 25;
        const totalSteps = duration / stepTime;
        const isDecimal = target % 1 !== 0;
        let current = 0;
        const increment = target / totalSteps;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.textContent = isDecimal ? target.toFixed(1) : Math.floor(target);
            clearInterval(timer);
          } else {
            counter.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
          }
        }, stepTime);
      });
    }
  }

  window.addEventListener('scroll', runCounters);
  runCounters();

  // 6. Interactive AI Playground Engine
  const promptInput = document.getElementById('playground-prompt');
  const runAiBtn = document.getElementById('btn-run-ai');
  const outputConsole = document.getElementById('playground-output');
  const presetChips = document.querySelectorAll('.preset-chip');
  const modelTabs = document.querySelectorAll('.model-tab');

  const modelResponses = {
    'stackly-4.5': [
      "⚡ [Stackly-4.5 Neural Output]\nExecuting enterprise workflow synthesis...\n- Synthesized 4-layer autonomous agent graph.\n- Token throughput: 164 tokens/sec (Latency: 14.2ms).\n- Model Status: Sovereign parameters active.\n\nResult:\n'System initialized with high-precision embeddings and zero hallucinations. Enterprise pipeline ready.'",
      "⚡ [Stackly-4.5 Neural Output]\nAnalyzing market prediction telemetry...\n- Confidence rating: 99.8%\n- Predictive anomaly vector: Null\n- Action recommended: Deploy automated scaling routine across edge cluster nodes.",
    ],
    'omni-vision': [
      "👁️ [OmniVision 3D Engine]\n- Processed 4K Multi-Spectral Stream.\n- Detected: 14 High-Value Objects (Bounding Box Precision: 99.8%).\n- Spatial Depth Map: 128-point LiDAR mesh aligned.\n- Inference latency: 8.4ms per frame.",
    ],
    'neural-code': [
      "💻 [Stackly Code Matrix]\n```typescript\nimport { StacklyAgent, AutonomousMesh } from '@stackly/core';\n\nexport async function deployAgentMesh() {\n  const mesh = new AutonomousMesh({ cluster: 'edge-global-us1' });\n  const agent = await mesh.spawn('reasoner-v3', { temperature: 0.2 });\n  return agent.executeTask('optimize-neural-cache');\n}\n```\nStatus: Synthesized and verified across 12 unit tests in 42ms.",
    ],
  };

  let activeModel = 'stackly-4.5';

  modelTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      modelTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      activeModel = tab.getAttribute('data-model') || 'stackly-4.5';
    });
  });

  presetChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      if (promptInput) {
        promptInput.value = chip.getAttribute('data-prompt') || chip.innerText;
        triggerAiGeneration();
      }
    });
  });

  function triggerAiGeneration() {
    if (!outputConsole) return;
    const promptText = promptInput ? promptInput.value.trim() : 'Optimize enterprise agent mesh';
    outputConsole.innerHTML = `<span style="color:#94a3b8">Processing neural weights for prompt: "${promptText || 'Custom Query'}"...</span>\n<span class="cursor-blink"></span>`;

    let responseList = modelResponses[activeModel] || modelResponses['stackly-4.5'];
    let chosenResponse = responseList[Math.floor(Math.random() * responseList.length)];

    let i = 0;
    setTimeout(() => {
      outputConsole.innerHTML = '';
      const interval = setInterval(() => {
        if (i < chosenResponse.length) {
          outputConsole.textContent += chosenResponse[i];
          i++;
          outputConsole.scrollTop = outputConsole.scrollHeight;
        } else {
          clearInterval(interval);
          outputConsole.innerHTML += '<span class="cursor-blink"></span>';
        }
      }, 12);
    }, 400);
  }

  if (runAiBtn) {
    runAiBtn.addEventListener('click', triggerAiGeneration);
  }

  // 7. Portfolio Filter Tabs
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter') || 'all';

      portfolioItems.forEach((item) => {
        const cat = item.getAttribute('data-category') || '';
        if (filter === 'all' || cat.includes(filter)) {
          item.style.display = 'block';
          item.style.animation = 'slide-in-toast 0.4s ease';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // 8. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const headerEl = item.querySelector('.faq-header');
    headerEl?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach((other) => other.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 9. Pricing Switcher
  const pricingToggle = document.getElementById('pricing-toggle');
  const priceValues = document.querySelectorAll('.price-val');

  if (pricingToggle) {
    pricingToggle.addEventListener('click', () => {
      pricingToggle.classList.toggle('yearly');
      const isYearly = pricingToggle.classList.contains('yearly');

      priceValues.forEach((val) => {
        const monthly = val.getAttribute('data-monthly');
        const yearly = val.getAttribute('data-yearly');
        val.textContent = isYearly ? yearly : monthly;
      });

      const periods = document.querySelectorAll('.pricing-price .period');
      periods.forEach((p) => {
        p.textContent = isYearly ? '/ billed annually' : '/ per month';
      });
    });
  }

  /* 10. Dynamic Cursor Spotlight & 3D Tilt Engine */
  const interactiveCards = document.querySelectorAll(
    '.cyber-spotlight, .bento-card, .modern-phil-card, .matrix-card, .sol-card, .srv-card, .srv-step-card, .eco-pillar-card, .action-pod, .telemetry-deck, .glass-card, .cyber-card'
  );

  interactiveCards.forEach((card) => {
    let bounds;
    let isHovering = false;

    function onMouseEnter(e) {
      bounds = card.getBoundingClientRect();
      isHovering = true;
    }

    function onMouseMove(e) {
      if (!bounds) bounds = card.getBoundingClientRect();
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;
      
      // Update CSS spotlight coordinates
      card.style.setProperty('--mouse-x', `${mouseX}px`);
      card.style.setProperty('--mouse-y', `${mouseY}px`);

      // Gentle 3D Tilt
      const centerX = bounds.width / 2;
      const centerY = bounds.height / 2;
      const deltaX = (mouseX - centerX) / centerX;
      const deltaY = (mouseY - centerY) / centerY;
      
      const tiltX = -deltaY * 5; // max 5 deg
      const tiltY = deltaX * 5;

      card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-4px)`;
    }

    function onMouseLeave() {
      isHovering = false;
      card.style.transform = '';
      bounds = null;
    }

    card.addEventListener('mouseenter', onMouseEnter, { passive: true });
    card.addEventListener('mousemove', onMouseMove, { passive: true });
    card.addEventListener('mouseleave', onMouseLeave, { passive: true });
  });

  /* 11. Cyber Text Scramble Decoder Animation */
  const scrambleElements = document.querySelectorAll(
    '.cyber-scramble, .sec-badge-text, .badge-pill, .telemetry-tag, .jtl-num, .bento-num'
  );

  const chars = '!<>-_\\/[]{}—=+*^?#________0101';
  
  function scrambleText(element) {
    const originalText = element.getAttribute('data-original-text') || element.textContent.trim();
    if (!element.getAttribute('data-original-text')) {
      element.setAttribute('data-original-text', originalText);
    }
    
    let iteration = 0;
    const maxIterations = originalText.length * 2;
    element.classList.add('scrambler-active');

    const interval = setInterval(() => {
      element.textContent = originalText
        .split('')
        .map((char, index) => {
          if (index < iteration / 2) {
            return originalText[index];
          }
          if (char === ' ' || char === '\n') return char;
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      if (iteration >= maxIterations) {
        clearInterval(interval);
        element.textContent = originalText;
        element.classList.remove('scrambler-active');
      }
      iteration += 1;
    }, 28);
  }

  if ('IntersectionObserver' in window && scrambleElements.length > 0) {
    const scrambleObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          scrambleText(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    scrambleElements.forEach((el) => scrambleObserver.observe(el));
  }

  /* 12. Cyber Button Ripple & Magnetic Pull */
  const cyberBtns = document.querySelectorAll(
    '.cta-btn-primary, .services-cta-btn, .btn-cyber, .btn-primary, .cta-btn-ghost, .btn-neon'
  );

  cyberBtns.forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.className = 'cyber-ripple';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.width = ripple.style.height = `${Math.max(rect.width, rect.height) * 2}px`;

      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });

    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  /* 13. Cyber Scroll Laser Progress Bar */
  let scrollProgressBar = document.getElementById('cyber-scroll-progress');
  if (!scrollProgressBar) {
    scrollProgressBar = document.createElement('div');
    scrollProgressBar.id = 'cyber-scroll-progress';
    document.body.appendChild(scrollProgressBar);
  }

  function updateScrollProgress() {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (window.scrollY / totalHeight) * 100;
      scrollProgressBar.style.width = `${progress}%`;
    }
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();
});



// Helper for Global Toasts
window.showToast = function (message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  const icon = type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation';
  const iconColor = type === 'success' ? 'var(--primary)' : 'var(--accent-pink)';

  toast.innerHTML = `
    <i class="fa-solid ${icon}" style="color: ${iconColor}; font-size: 1.2rem;"></i>
    <div>
      <strong>${type === 'success' ? 'Success' : 'Notice'}</strong>
      <p style="font-size: 0.85rem; color: #94a3b8; margin-top: 2px;">${message}</p>
    </div>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};
