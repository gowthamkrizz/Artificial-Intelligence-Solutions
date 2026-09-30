/* ==========================================================================
   STACKLY AI - 404 INTERACTIVE PARALLAX & TELEMETRY ENGINE
   Live Telemetry Jitter, Radar Sound Simulation & Vector Reconnection
   ========================================================================== */

(function () {
  'use strict';

  // 1. Mouse Parallax Effect on Floating Chips & Radar
  function initParallax() {
    const badges = document.querySelectorAll('.err-floating-badge');
    const heroVisual = document.querySelector('.err-hero-visual');

    window.addEventListener('mousemove', (e) => {
      const mouseX = (e.clientX / window.innerWidth) - 0.5;
      const mouseY = (e.clientY / window.innerHeight) - 0.5;

      badges.forEach((badge, idx) => {
        const factor = (idx + 1) * 14;
        const rotate = (mouseX * 12).toFixed(2);
        badge.style.transform = `translate(${mouseX * factor}px, ${mouseY * factor}px) rotate(${rotate}deg)`;
      });

      if (heroVisual) {
        heroVisual.style.transform = `perspective(1000px) rotateY(${mouseX * 10}deg) rotateX(${-mouseY * 10}deg)`;
      }
    });

    window.addEventListener('mouseleave', () => {
      badges.forEach(badge => {
        badge.style.transform = 'translate(0px, 0px) rotate(0deg)';
      });
      if (heroVisual) {
        heroVisual.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
      }
    });
  }

  // 2. Telemetry Live Dynamic Jitter
  function initTelemetryJitter() {
    const latencyVal = document.getElementById('err-jitter-latency');
    const tensorState = document.getElementById('err-jitter-tensor');

    setInterval(() => {
      if (latencyVal) {
        const rand = (Math.random() * 0.4).toFixed(1);
        latencyVal.textContent = `Latency P99: ${rand}ms`;
      }
    }, 2500);

    const states = ['NaN (Null Vector)', '0x00000000', 'Vector Drift: 100%', 'Null Tensor'];
    let stateIdx = 0;
    setInterval(() => {
      if (tensorState) {
        stateIdx = (stateIdx + 1) % states.length;
        tensorState.textContent = `Tensor: ${states[stateIdx]}`;
      }
    }, 4000);
  }

  // 3. Neural Reconnection Simulation Tool
  function initReconnectTool() {
    const reconnectBtn = document.getElementById('err-reconnect-btn');
    if (!reconnectBtn) return;

    reconnectBtn.addEventListener('click', () => {
      reconnectBtn.disabled = true;
      reconnectBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>SCANNING CLUSTER RACKS...</span>`;

      showErrorToast('Initiating quantum vector handshake across 512 cluster nodes...', 'info');

      setTimeout(() => {
        reconnectBtn.innerHTML = `<i class="fa-solid fa-satellite-dish fa-bounce"></i> <span>CHECKING AIR-GAPPED ENCLAVES...</span>`;
        showErrorToast('Probing regional VPC routes (US-East, Tokyo, Frankfurt)...', 'info');
      }, 1500);

      setTimeout(() => {
        reconnectBtn.disabled = false;
        reconnectBtn.innerHTML = `<i class="fa-solid fa-bolt"></i> <span>ATTEMPT VECTOR RECONNECTION</span>`;
        showErrorToast('Scan Complete: Requested route is permanently unmapped. Please return to Home.', 'error');
      }, 3500);
    });
  }

  // 4. Toast Notification
  function showErrorToast(msg, type = 'info') {
    let container = document.querySelector('.err-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'err-toast-container';
      container.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
      `;
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const color = type === 'error' ? '#ff3366' : '#00f2fe';
    toast.style.cssText = `
      background: #090e1f;
      border: 1px solid ${color};
      color: #fff;
      padding: 12px 18px;
      border-radius: 8px;
      font-size: 0.82rem;
      font-family: 'JetBrains Mono', monospace;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.6);
      transform: translateX(120%);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: auto;
    `;
    const icon = type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-notch fa-spin';
    toast.innerHTML = `<i class="fa-solid ${icon}" style="color: ${color};"></i> <span>${msg}</span>`;
    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(0)';
    });

    setTimeout(() => {
      toast.style.transform = 'translateX(120%)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // 5. Back Button Action
  function initBackButtons() {
    const backBtn = document.getElementById('err-back-prev-btn');
    if (backBtn) {
      backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.href = 'index.html';
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initParallax();
    initTelemetryJitter();
    initReconnectTool();
    initBackButtons();
  });

})();
