/* ==========================================================================
   STACKLY AI - ENTERPRISE DASHBOARD INTERACTIVE SCRIPT
   Admin NOC Orchestration & Customer Workspace Playground Engine
   ========================================================================== */

(function () {
  'use strict';

  // 1. Cyber Toast Notification System
  function showDashToast(message, type = 'info') {
    let container = document.querySelector('.dash-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'dash-toast-container';
      container.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
      `;
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const colorMap = {
      success: { bg: 'rgba(0, 245, 155, 0.15)', border: '#00f59b', text: '#00f59b', icon: 'fa-circle-check' },
      error: { bg: 'rgba(255, 51, 102, 0.15)', border: '#ff3366', text: '#ff3366', icon: 'fa-triangle-exclamation' },
      info: { bg: 'rgba(0, 242, 254, 0.15)', border: '#00f2fe', text: '#00f2fe', icon: 'fa-bolt' }
    };
    const style = colorMap[type] || colorMap.info;

    toast.style.cssText = `
      background: #0b1325;
      border: 1px solid ${style.border};
      box-shadow: 0 8px 25px rgba(0,0,0,0.6), 0 0 15px ${style.bg};
      color: #fff;
      padding: 12px 18px;
      border-radius: 10px;
      font-size: 0.85rem;
      font-family: 'Inter', sans-serif;
      display: flex;
      align-items: center;
      gap: 10px;
      backdrop-filter: blur(10px);
      pointer-events: auto;
      transform: translateX(120%);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    `;

    toast.innerHTML = `<i class="fa-solid ${style.icon}" style="color: ${style.text}; font-size: 1.1rem;"></i> <span>${message}</span>`;
    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(0)';
    });

    setTimeout(() => {
      toast.style.transform = 'translateX(120%)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 350);
    }, 3800);
  }

  window.showDashToast = showDashToast;

  /* ──────────────────────────────────────────
     2. MOBILE SIDEBAR DRAWER TOGGLE
  ────────────────────────────────────────── */
  function initMobileSidebar() {
    const sidebar = document.getElementById('dash-sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle-btn');
    const closeBtn = document.getElementById('sidebar-close-btn');
    const overlay = document.getElementById('sidebar-mobile-overlay');

    if (!sidebar) return;

    function openSidebar() {
      sidebar.classList.add('mobile-open');
      if (overlay) overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
      sidebar.classList.remove('mobile-open');
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (toggleBtn) toggleBtn.addEventListener('click', openSidebar);
    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar.classList.contains('mobile-open')) {
        closeSidebar();
      }
    });

    // Close sidebar on item click for mobile
    const navLinks = sidebar.querySelectorAll('.nav-link-btn');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 992) {
          closeSidebar();
        }
      });
    });
  }

  /* ──────────────────────────────────────────
     3. TAB VIEW SWITCHER
  ────────────────────────────────────────── */
  function initTabSwitcher() {
    const navButtons = document.querySelectorAll('.nav-link-btn[data-target-view]');
    const viewPanes = document.querySelectorAll('.dash-view-pane');

    navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetViewId = btn.getAttribute('data-target-view');
        const targetPane = document.getElementById(targetViewId);

        if (!targetPane) return;

        // Update nav active states
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update view pane visibility
        viewPanes.forEach(pane => pane.classList.remove('active'));
        targetPane.classList.add('active');

        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  /* ──────────────────────────────────────────
     4. TELEMETRY & LIVE METRICS JITTER SIMULATION
  ────────────────────────────────────────── */
  function initLiveTelemetryJitter() {
    const jitterTps = document.getElementById('jitter-tps');
    const jitterLatency = document.getElementById('jitter-latency');
    const jitterGpuLoad = document.getElementById('jitter-gpu-load');

    setInterval(() => {
      if (jitterTps) {
        const base = 482.6;
        const delta = (Math.random() * 8 - 4).toFixed(1);
        jitterTps.textContent = `${(base + parseFloat(delta)).toFixed(1)}k`;
      }

      if (jitterLatency) {
        const lat = (6.4 + Math.random() * 0.9).toFixed(1);
        jitterLatency.textContent = `< ${lat}ms`;
      }

      if (jitterGpuLoad) {
        const load = (88.4 + (Math.random() * 2 - 1)).toFixed(1);
        jitterGpuLoad.textContent = `${load}%`;
      }
    }, 2800);

    // Dynamic GPU Rack Node Flashing
    const nodeCells = document.querySelectorAll('.gpu-node-cell');
    setInterval(() => {
      if (nodeCells.length > 0) {
        const randIdx = Math.floor(Math.random() * nodeCells.length);
        const cell = nodeCells[randIdx];
        if (cell.classList.contains('active')) {
          cell.style.filter = 'brightness(1.6)';
          setTimeout(() => cell.style.filter = 'none', 400);
        }
      }
    }, 600);
  }

  /* ──────────────────────────────────────────
     5. INTERACTIVE PLAYGROUND / PROMPT STUDIO
  ────────────────────────────────────────── */
  function initPromptPlayground() {
    const sendBtn = document.getElementById('studio-send-btn');
    const textarea = document.getElementById('studio-input-prompt');
    const chatHistory = document.getElementById('studio-chat-history');
    const modelSelect = document.getElementById('studio-model-select');
    const tempSlider = document.getElementById('studio-temp-slider');
    const tempVal = document.getElementById('studio-temp-val');

    if (tempSlider && tempVal) {
      tempSlider.addEventListener('input', () => {
        tempVal.textContent = parseFloat(tempSlider.value).toFixed(1);
      });
    }

    if (!sendBtn || !textarea || !chatHistory) return;

    function handleSend() {
      const userText = textarea.value.trim();
      if (!userText) {
        if (window.showDashToast) {
          window.showDashToast('Please enter a prompt before sending.', 'error');
        }
        return;
      }

      // Redirect to 404.html once the prompt is submitted
      window.location.href = '404.html';
    }

    sendBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleSend();
    });
    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    });
  }

  function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ──────────────────────────────────────────
     6. MODALS & API KEY GENERATOR
  ────────────────────────────────────────── */
  function initModals() {
    // Open Modal Triggers
    const openBtns = document.querySelectorAll('[data-open-modal]');
    openBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetModalId = btn.getAttribute('data-open-modal');
        const modal = document.getElementById(targetModalId);
        if (modal) {
          modal.classList.add('active');
        }
      });
    });

    // Close Modal Triggers
    const closeBtns = document.querySelectorAll('.modal-close-btn, [data-close-modal]');
    closeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const activeModal = btn.closest('.cyber-modal-backdrop');
        if (activeModal) activeModal.classList.remove('active');
      });
    });

    // Click on Backdrop to close
    const backdrops = document.querySelectorAll('.cyber-modal-backdrop');
    backdrops.forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          backdrop.classList.remove('active');
        }
      });
    });

    // Deploy Cluster Form
    const deployForm = document.getElementById('deploy-node-form');
    if (deployForm) {
      deployForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const clusterName = document.getElementById('modal-cluster-name')?.value || 'Alpha-05';
        const modal = document.getElementById('deploy-node-modal');
        if (modal) modal.classList.remove('active');
        showDashToast(`Cluster Node [${clusterName}] provisioning started! Online in ~15s.`, 'success');
      });
    }

    // Generate API Key Form
    const keyForm = document.getElementById('create-key-form');
    if (keyForm) {
      keyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const keyName = document.getElementById('modal-key-name')?.value || 'Production Secret';
        const modal = document.getElementById('create-key-modal');
        if (modal) modal.classList.remove('active');
        
        const randKey = 'sk-stackly-' + Math.random().toString(36).substring(2, 10) + '-' + Math.random().toString(36).substring(2, 8);
        showDashToast(`New API Key [${keyName}] generated successfully!`, 'success');

        // Append to API table if exists
        const keyTable = document.getElementById('api-keys-table-body');
        if (keyTable) {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td><strong>${escapeHtml(keyName)}</strong></td>
            <td><code style="color: var(--dash-cyan); font-family: var(--font-mono);">${randKey.substring(0, 14)}•••••••••</code></td>
            <td><span class="status-pill active"><i class="fa-solid fa-circle" style="font-size: 6px;"></i> Active</span></td>
            <td>Just now</td>
            <td>
              <button class="action-icon-btn copy-key-btn" data-key="${randKey}" title="Copy Key"><i class="fa-regular fa-copy"></i></button>
              <button class="action-icon-btn danger delete-row-btn" title="Revoke Key"><i class="fa-regular fa-trash-can"></i></button>
            </td>
          `;
          keyTable.prepend(tr);
          bindKeyActions(tr);
        }
      });
    }

    // Copy to clipboard actions
    function bindKeyActions(scope = document) {
      const copyBtns = scope.querySelectorAll('.copy-key-btn');
      copyBtns.forEach(btn => {
        btn.onclick = () => {
          const keyVal = btn.getAttribute('data-key') || 'sk-stackly-live-sample-9x88';
          navigator.clipboard.writeText(keyVal).then(() => {
            showDashToast('API Key copied to secure clipboard!', 'success');
          }).catch(() => {
            showDashToast('Key copied!', 'info');
          });
        };
      });

      const deleteBtns = scope.querySelectorAll('.delete-row-btn');
      deleteBtns.forEach(btn => {
        btn.onclick = () => {
          const row = btn.closest('tr');
          if (row) {
            row.style.opacity = '0.3';
            row.style.pointerEvents = 'none';
            setTimeout(() => {
              row.remove();
              showDashToast('API Key revoked and disabled from gateway.', 'error');
            }, 300);
          }
        };
      });
    }

    bindKeyActions();
  }

  /* ──────────────────────────────────────────
     7. DYNAMIC USER PROFILE SYNCHRONIZATION
  ────────────────────────────────────────── */
  function initUserProfile() {
    let savedUser = null;
    try {
      savedUser = JSON.parse(localStorage.getItem('stackly_auth_user'));
    } catch (e) {
      savedUser = null;
    }

    const isAdmin = window.location.pathname.includes('admin') || document.title.toLowerCase().includes('admin');
    
    const defaultName = isAdmin ? 'Admin' : 'Alex Vance';
    const defaultEmail = isAdmin ? 'admin@stackly.ai' : 'alex.vance@enterprise.io';

    const finalName = (savedUser && savedUser.name) ? savedUser.name : defaultName;
    const finalEmail = (savedUser && savedUser.email) ? savedUser.email : defaultEmail;

    const nameElements = document.querySelectorAll('.user-display-name');
    const roleEmailElements = document.querySelectorAll('.user-display-role');
    const welcomeHeader = document.getElementById('welcome-user-heading');

    nameElements.forEach(el => {
      el.textContent = finalName;
    });

    roleEmailElements.forEach(el => {
      el.textContent = finalEmail;
      el.title = finalEmail;
    });

    if (welcomeHeader) {
      welcomeHeader.textContent = finalName;
    }
  }

  /* ──────────────────────────────────────────
     8. LOGO REFRESH HANDLER
  ────────────────────────────────────────── */
  function initLogoRefresh() {
    const brandLogos = document.querySelectorAll('.sidebar-brand .brand-logo-wrap');
    brandLogos.forEach(logo => {
      logo.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.reload();
      });
    });
  }

  // Initialization
  document.addEventListener('DOMContentLoaded', () => {
    initMobileSidebar();
    initTabSwitcher();
    initLiveTelemetryJitter();
    initPromptPlayground();
    initModals();
    initUserProfile();
    initLogoRefresh();
  });

})();
