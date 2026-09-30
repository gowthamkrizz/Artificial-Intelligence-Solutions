/* ==========================================================================
   STACKLY AI - CONTACT PAGE JAVASCRIPT
   Interactive Map Command Center, 3D Tilt Cards, Real-time Clock,
   Cluster Visualizer, SLA Routing Channels & Scope Estimator
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
  }

  // 2. Register GSAP Plugins
  const gsapReady = typeof gsap !== 'undefined';
  const stReady = typeof ScrollTrigger !== 'undefined';
  if (gsapReady && stReady) {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ──────────────────────────────────────────
     LOCATION MAP COMMAND CENTER DATA & SWITCHER
  ────────────────────────────────────────── */
  let activeNodeTimezone = 'America/Los_Angeles';

  const officeNodes = {
    sf: {
      city: 'MMR Complex, Chinna Thirupathi, Near Chinna Muniyappan Kovil, Salem - 636 003',
      coords: '11.6854° N, 78.1685° E',
      address: 'MMR Complex, Chinna Thirupathi, Near Chinna Muniyappan Kovil, Salem - 636 003',
      latency: '< 1.2ms Ping',
      racks: '128 Tensor Racks // 100% SLA',
      tz: 'Asia/Kolkata',
      embedUrl: 'https://maps.google.com/maps?q=MMR%20Complex,%20Chinna%20Thirupathi,%20Near%20Chinna%20Muniyappan%20Kovil,%20Salem%20-%20636%20003&t=&z=16&ie=UTF8&iwloc=&output=embed'
    },
    london: {
      city: 'London, UK',
      coords: '51.5225° N, 0.0862° W',
      address: '25 Finsbury Circus, Level 8, London EC2M 7EE, UK',
      latency: '14.2ms Ping',
      racks: '64 Tensor Racks // Zero Egress',
      tz: 'Europe/London',
      embedUrl: 'https://maps.google.com/maps?q=25%20Finsbury%20Circus,%20London&t=&z=14&ie=UTF8&iwloc=&output=embed'
    },
    tokyo: {
      city: 'Tokyo, Japan',
      coords: '35.6762° N, 139.6503° E',
      address: 'Roppongi Hills Mori Tower 32F, Minato City, Tokyo 106-6132',
      latency: '28.4ms Ping',
      racks: '96 Tensor Racks // Robotics Edge',
      tz: 'Asia/Tokyo',
      embedUrl: 'https://maps.google.com/maps?q=Roppongi%20Hills,%20Tokyo&t=&z=14&ie=UTF8&iwloc=&output=embed'
    },
    singapore: {
      city: 'Singapore',
      coords: '1.2838° N, 103.8591° E',
      address: '1 Marina Boulevard, #28-00, Singapore 018989',
      latency: '31.1ms Ping',
      racks: '48 Tensor Racks // APAC Gateway',
      tz: 'Asia/Singapore',
      embedUrl: 'https://maps.google.com/maps?q=1%20Marina%20Boulevard,%20Singapore&t=&z=14&ie=UTF8&iwloc=&output=embed'
    },
    zurich: {
      city: 'Zurich, Switzerland',
      coords: '47.3769° N, 8.5417° E',
      address: 'Gotthardstrasse 26, 8002 Zürich, Switzerland',
      latency: '18.9ms Ping',
      racks: '32 Quantum Hybrid Racks',
      tz: 'Europe/Zurich',
      embedUrl: 'https://maps.google.com/maps?q=Gotthardstrasse%2026,%20Zurich&t=&z=14&ie=UTF8&iwloc=&output=embed'
    }
  };

  function initMapSwitcher() {
    const tabBtns = document.querySelectorAll('.map-node-btn');
    const mapIframe = document.getElementById('map-embed-iframe');
    const cityElem = document.getElementById('map-hud-city-text');
    const coordsElem = document.getElementById('map-hud-coords-text');
    const latencyElem = document.getElementById('map-hud-latency-text');
    const racksElem = document.getElementById('map-hud-racks-text');
    const routeBtn = document.getElementById('map-route-btn');

    if (!tabBtns.length || !mapIframe) return;

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const nodeKey = btn.getAttribute('data-node') || 'sf';
        const nodeData = officeNodes[nodeKey] || officeNodes.sf;
        activeNodeTimezone = nodeData.tz;

        // Smoothly fade map
        mapIframe.style.opacity = '0';
        setTimeout(() => {
          mapIframe.src = nodeData.embedUrl;
          mapIframe.style.opacity = '1';
        }, 200);

        if (cityElem) cityElem.textContent = nodeData.city;
        if (coordsElem) coordsElem.textContent = nodeData.coords;
        if (latencyElem) latencyElem.innerHTML = `<i class="fa-solid fa-bolt text-cyan"></i> ${nodeData.latency}`;
        if (racksElem) racksElem.innerHTML = `<i class="fa-solid fa-server text-purple"></i> ${nodeData.racks}`;
        if (routeBtn) routeBtn.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(nodeData.address)}`;

        const clusterChip = document.getElementById('map-chip-cluster');
        if (clusterChip) clusterChip.textContent = `${nodeData.racks}`;

        if (gsapReady) {
          gsap.fromTo('.map-hud-overlay', { y: 15, opacity: 0.8 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' });
          gsap.fromTo('.map-reticle-overlay', { scale: 0.6, opacity: 0.4 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(2)' });
        }
      });
    });
  }

  /* ──────────────────────────────────────────
     REAL-TIME NODE CLOCK & JITTER SIMULATION
  ────────────────────────────────────────── */
  function initRealtimeClockAndJitter() {
    const clockElem = document.getElementById('map-local-clock');
    const jitterElem = document.getElementById('map-live-jitter');

    function updateClock() {
      if (clockElem) {
        try {
          const now = new Date();
          const timeStr = now.toLocaleTimeString('en-US', {
            timeZone: activeNodeTimezone,
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          });
          clockElem.textContent = `${timeStr} LOCAL`;
        } catch (e) {
          clockElem.textContent = new Date().toUTCString().slice(17, 25) + ' UTC';
        }
      }
    }

    function updateJitter() {
      if (jitterElem) {
        const randJitter = (1.7 + Math.random() * 0.7).toFixed(1);
        jitterElem.textContent = `${randJitter}ms`;
      }
    }

    setInterval(updateClock, 1000);
    setInterval(updateJitter, 2500);
    updateClock();
    updateJitter();
  }

  /* ──────────────────────────────────────────
     3D CARD TILT WITH SPECULAR MOUSE LIGHT
  ────────────────────────────────────────── */
  function init3DTilt() {
    const tiltCards = document.querySelectorAll('.priority-channel-card, .calc-card-box');
    
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }

  /* ──────────────────────────────────────────
     PRIORITY CHANNEL ACTION PRESETS
  ────────────────────────────────────────── */
  function initChannelPresets() {
    const actionLinks = document.querySelectorAll('.channel-action-pill');
    const implSelect = document.getElementById('contact-target-impl');
    const msgField = document.getElementById('contact-message');
    const formElem = document.getElementById('contact-form');

    actionLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const preset = link.getAttribute('data-route-preset') || 'Enterprise Deployment';

        if (implSelect) {
          for (let i = 0; i < implSelect.options.length; i++) {
            if (implSelect.options[i].text.toLowerCase().includes(preset.toLowerCase().slice(0, 4))) {
              implSelect.selectedIndex = i;
              break;
            }
          }
        }

        if (msgField) {
          msgField.value = `[PRIORITY ROUTE: ${preset.toUpperCase()}]\nInquiry Details:\n• Request Track: ${preset}\n• Architecture Scope: Air-Gapped High-Throughput Node\n\nDirect Message: `;
          msgField.classList.remove('is-invalid');
          const errMessage = document.getElementById('err-contact-message');
          if (errMessage) errMessage.classList.remove('visible');
          msgField.focus();
        }

        if (typeof window.showToast === 'function') {
          window.showToast(`Selected priority route: ${preset}`, 'info');
        }

        if (formElem) {
          formElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });
  }

  /* ──────────────────────────────────────────
     TECHNICAL FAQ ACCORDION
  ────────────────────────────────────────── */
  function initFaqAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    if (!accordionItems.length) return;

    accordionItems.forEach(item => {
      const header = item.querySelector('.accordion-header');
      if (!header) return;

      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close other items
        accordionItems.forEach(other => {
          if (other !== item) other.classList.remove('active');
        });

        // Toggle current item
        item.classList.toggle('active', !isActive);
      });
    });
  }

  /* ──────────────────────────────────────────
     ARCHITECTURE SCOPE ESTIMATOR & TOPOLOGY VISUALIZER
  ────────────────────────────────────────── */
  function initArchitectureEstimator() {
    const modelSelect = document.getElementById('calc-model-type');
    const gpuSlider = document.getElementById('calc-gpu-slider');
    const throughputSlider = document.getElementById('calc-throughput-slider');

    const gpuValDisplay = document.getElementById('calc-gpu-val');
    const throughputValDisplay = document.getElementById('calc-throughput-val');
    const resultTps = document.getElementById('calc-res-tps');
    const resultLatency = document.getElementById('calc-res-latency');
    const attachBtn = document.getElementById('calc-attach-btn');
    const nodesGrid = document.getElementById('visualizer-nodes-grid');
    const activeCountText = document.getElementById('visualizer-active-count');

    if (!gpuSlider || !throughputSlider) return;

    // Build 64 node dots for topology visualizer
    if (nodesGrid) {
      nodesGrid.innerHTML = '';
      for (let i = 0; i < 64; i++) {
        const dot = document.createElement('div');
        dot.className = 'node-dot';
        nodesGrid.appendChild(dot);
      }
    }

    function recalculate() {
      const gpus = parseInt(gpuSlider.value, 10);
      const concurrency = parseInt(throughputSlider.value, 10);
      const model = modelSelect ? modelSelect.value : 'llm';

      if (gpuValDisplay) gpuValDisplay.textContent = `${gpus} × H100 SXM5`;
      if (throughputValDisplay) throughputValDisplay.textContent = `${concurrency} Req/Sec`;

      let tpsMultiplier = 2800;
      let baseLatency = 14;

      if (model === 'vision') {
        tpsMultiplier = 1600;
        baseLatency = 8;
      } else if (model === 'swarm') {
        tpsMultiplier = 4200;
        baseLatency = 22;
      }

      const totalTps = Math.round((gpus * tpsMultiplier) / 8);
      const estLatency = Math.max(3.8, Math.round(baseLatency - Math.log2(gpus) * 1.5));

      if (resultTps) {
        resultTps.textContent = `${(totalTps / 1000).toFixed(1)}k`;
      }
      if (resultLatency) {
        resultLatency.textContent = `< ${estLatency}ms`;
      }

      // Update node visualizer dots
      if (nodesGrid) {
        const dots = nodesGrid.querySelectorAll('.node-dot');
        dots.forEach((dot, idx) => {
          if (idx < gpus) {
            dot.classList.add('active');
            if (idx % 8 === 0) {
              dot.classList.add('purple-node');
            } else {
              dot.classList.remove('purple-node');
            }
          } else {
            dot.classList.remove('active', 'purple-node');
          }
        });
      }

      if (activeCountText) {
        activeCountText.textContent = `${gpus} CLUSTER NODES ACTIVE`;
      }
    }

    throughputSlider.addEventListener('input', recalculate);
    if (modelSelect) modelSelect.addEventListener('change', recalculate);

    recalculate();
  }

  /* ──────────────────────────────────────────
     CONTACT FORM JAVASCRIPT VALIDATION & TRANSMISSION HANDLER
  ────────────────────────────────────────── */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const messageInput = document.getElementById('contact-message');
    const companyInput = document.getElementById('contact-company');
    const submitBtn = document.getElementById('contact-submit-btn') || form.querySelector('.cyber-submit-btn');

    const errName = document.getElementById('err-contact-name');
    const errEmail = document.getElementById('err-contact-email');
    const errMessage = document.getElementById('err-contact-message');

    // Email Regex RFC 5322 standard
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    function setFieldState(input, errorEl, isValid, errorMsg) {
      if (!input) return;
      if (isValid) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        if (errorEl) {
          errorEl.classList.remove('visible');
        }
      } else {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        if (errorEl) {
          if (errorMsg) {
            errorEl.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${errorMsg}`;
          }
          errorEl.classList.add('visible');
        }
      }
    }

    function validateName() {
      if (!nameInput) return true;
      const val = nameInput.value.trim();
      if (!val) {
        setFieldState(nameInput, errName, false, 'Please enter your full name.');
        return false;
      }
      if (val.length < 2) {
        setFieldState(nameInput, errName, false, 'Name must be at least 2 characters long.');
        return false;
      }
      setFieldState(nameInput, errName, true);
      return true;
    }

    function validateEmail() {
      if (!emailInput) return true;
      const val = emailInput.value.trim();
      if (!val) {
        setFieldState(emailInput, errEmail, false, 'Corporate email address is required.');
        return false;
      }
      if (!emailRegex.test(val)) {
        setFieldState(emailInput, errEmail, false, 'Please enter a valid corporate email (e.g. name@company.com).');
        return false;
      }
      setFieldState(emailInput, errEmail, true);
      return true;
    }

    function validateMessage() {
      if (!messageInput) return true;
      const val = messageInput.value.trim();
      if (!val) {
        setFieldState(messageInput, errMessage, false, 'Please describe your project objectives and scope.');
        return false;
      }
      if (val.length < 10) {
        setFieldState(messageInput, errMessage, false, 'Message is too short (min. 10 characters required).');
        return false;
      }
      setFieldState(messageInput, errMessage, true);
      return true;
    }

    // Attach real-time input & blur event listeners
    if (nameInput) {
      nameInput.addEventListener('input', () => {
        if (nameInput.classList.contains('is-invalid')) validateName();
      });
      nameInput.addEventListener('blur', validateName);
    }

    if (emailInput) {
      emailInput.addEventListener('input', () => {
        if (emailInput.classList.contains('is-invalid')) validateEmail();
      });
      emailInput.addEventListener('blur', validateEmail);
    }

    if (messageInput) {
      messageInput.addEventListener('input', () => {
        if (messageInput.classList.contains('is-invalid')) validateMessage();
      });
      messageInput.addEventListener('blur', validateMessage);
    }

    // Form Submit Handler
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = validateName();
      const isEmailValid = validateEmail();
      const isMsgValid = validateMessage();

      if (!isNameValid || !isEmailValid || !isMsgValid) {
        // Focus first invalid field
        const firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) {
          firstInvalid.focus();
        }
        if (typeof window.showToast === 'function') {
          window.showToast('Please correct the highlighted form errors before transmitting.', 'error');
        }
        return;
      }

      // Valid: Proceed with animated transmission
      const origHtml = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Encrypting & Transmitting...`;
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.innerHTML = `<i class="fa-solid fa-check"></i> Transmission Confirmed`;
        }

        if (typeof window.showToast === 'function') {
          window.showToast('Transmission Dispatched! Redirecting to secure gateway...', 'success');
        }

        setTimeout(() => {
          window.location.href = '404.html';
        }, 800);
      }, 1000);
    });
  }

  // Initializer
  function initAll() {
    initMapSwitcher();
    initRealtimeClockAndJitter();
    init3DTilt();
    initChannelPresets();
    initFaqAccordion();
    initArchitectureEstimator();
    initContactForm();

    if (typeof ScrollTrigger !== 'undefined') {
      setTimeout(() => ScrollTrigger.refresh(), 200);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

})();
