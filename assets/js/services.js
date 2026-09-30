/* ==========================================================================
   STACKLY AI - SERVICES PAGE JAVASCRIPT
   Interaction & Animation Engine (GSAP + AOS + Interactive Selectors)
   ========================================================================== */

(function () {
  'use strict';

  // 1. Initialize AOS
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60
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
     SECTION 1 — ACCORDION OVERVIEW
  ────────────────────────────────────────── */
  function initAccordion() {
    const items = document.querySelectorAll('.srv-acc-item');
    if (!items.length) return;

    items.forEach(item => {
      item.addEventListener('mouseenter', () => {
        items.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
      });
      item.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        items.forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    });
  }

  /* ──────────────────────────────────────────
     SECTION 5 & 6 — NUMBER COUNTERS
  ────────────────────────────────────────── */
  function initCounters() {
    const counters = document.querySelectorAll('.srv-counter');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-val') || el.textContent);
          const isFloat = el.classList.contains('srv-counter-float') || target % 1 !== 0;
          const duration = 2000;
          const start = performance.now();

          function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            const val = target * ease;
            el.textContent = isFloat ? val.toFixed(1) : Math.round(val);

            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = isFloat ? target.toFixed(1) : target;
          }

          requestAnimationFrame(tick);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.2 });

    counters.forEach(c => observer.observe(c));
  }

  /* ──────────────────────────────────────────
     SECTION 7 — INDUSTRY AI SELECTOR
  ────────────────────────────────────────── */
  const industryData = {
    finance: {
      category: "FINANCIAL INTELLIGENCE CORE",
      title: "Algorithmic Finance & Real-Time Risk",
      desc: "Deploy sovereign sub-millisecond fraud detection models, automated multi-asset portfolio rebalancing, and regulatory-compliant air-gapped risk analytics designed for high-frequency banking infrastructure.",
      img: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=800&auto=format&fit=crop",
      metric: "99.98% Fraud Detection Accuracy",
      chips: [
        { icon: "fa-bolt text-cyan", text: "Sub-ms Ingest" },
        { icon: "fa-shield-virus text-purple", text: "Air-Gapped Models" },
        { icon: "fa-file-shield text-pink", text: "SEC/FINRA Compliant" }
      ],
      kpis: [
        { val: "99.98%", lbl: "Detection Accuracy" },
        { val: "<1.2ms", lbl: "Scoring Latency" },
        { val: "$2.4B+", lbl: "Capital Protected" }
      ]
    },
    healthcare: {
      category: "BIOMEDICAL AI & DIAGNOSTICS",
      title: "Biomedical Intelligence & Clinical Imaging",
      desc: "HIPAA-compliant neural processing for multi-modal medical imaging, automated diagnostic triage, and genomic sequence pattern recognition with sub-second clinical guidance.",
      img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop",
      metric: "4.2x Clinical Triage Acceleration",
      chips: [
        { icon: "fa-dna text-green", text: "Genomic Sequence AI" },
        { icon: "fa-hospital text-cyan", text: "HIPAA Enclave" },
        { icon: "fa-microscope text-purple", text: "Multi-Modal MRI/CT" }
      ],
      kpis: [
        { val: "4.2x", lbl: "Triage Velocity" },
        { val: "99.9%", lbl: "Diagnostic Match" },
        { val: "Level 4", lbl: "HIPAA Security" }
      ]
    },
    retail: {
      category: "AUTONOMOUS COMMERCE & SUPPLY",
      title: "Predictive Inventory & Dynamic Commerce",
      desc: "Predictive inventory allocation across omni-channel warehouses, dynamic price elasticity engines, and real-time behavioral recommendation swarms generating massive margin uplift.",
      img: "https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=800&auto=format&fit=crop",
      metric: "+34% Net Margin Uplift",
      chips: [
        { icon: "fa-tags text-purple", text: "Dynamic Elasticity" },
        { icon: "fa-boxes-stacked text-cyan", text: "Warehouse Swarms" },
        { icon: "fa-user-check text-pink", text: "Hyper-Personalized" }
      ],
      kpis: [
        { val: "+34%", lbl: "Margin Uplift" },
        { val: "99.4%", lbl: "Stock Accuracy" },
        { val: "-40%", lbl: "Cart Abandonment" }
      ]
    },
    manufacturing: {
      category: "INDUSTRY 4.0 CYBER-PHYSICAL",
      title: "Edge Computer Vision & Zero-Downtime Ops",
      desc: "Zero-latency edge vision cameras for acoustic anomaly detection, robotic arm trajectory optimization, and automated defect sorting directly on factory floors.",
      img: "https://images.unsplash.com/photo-1563770660941-20978e870e26?q=80&w=800&auto=format&fit=crop",
      metric: "Zero Unscheduled Plant Downtime",
      chips: [
        { icon: "fa-eye text-cyan", text: "Edge Optical QA" },
        { icon: "fa-robot text-purple", text: "Robotic Synchro" },
        { icon: "fa-wrench text-pink", text: "Predictive Maintenance" }
      ],
      kpis: [
        { val: "0 Hrs", lbl: "Unplanned Outages" },
        { val: "99.96%", lbl: "Defect Capture" },
        { val: "+28%", lbl: "OEE Productivity" }
      ]
    },
    logistics: {
      category: "GLOBAL AUTONOMOUS FREIGHT",
      title: "Dynamic Fleet Routing & Global Port AI",
      desc: "Global multi-echelon routing optimization engines, real-time customs document extraction, and autonomous container load balancing algorithms across air, ocean, and ground.",
      img: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=800&auto=format&fit=crop",
      metric: "28% Fuel & Transit Time Saved",
      chips: [
        { icon: "fa-satellite text-pink", text: "GPS Swarm Routing" },
        { icon: "fa-file-invoice text-cyan", text: "Automated Customs" },
        { icon: "fa-ship text-purple", text: "Container Balancer" }
      ],
      kpis: [
        { val: "28%", lbl: "Fuel Savings" },
        { val: "100%", lbl: "Tracking Fidelity" },
        { val: "5.4x", lbl: "Dispatch Velocity" }
      ]
    },
    technology: {
      category: "INFRASTRUCTURE AI & CLOUD",
      title: "Autonomous Developer Swarms & Self-Healing",
      desc: "Autonomous code verification, real-time distributed Kubernetes cluster auto-scaling, and telemetry log anomaly root-cause remediation with zero human intervention.",
      img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop",
      metric: "72% Reduction In Incident MTTR",
      chips: [
        { icon: "fa-code-branch text-blue", text: "Agentic Code QA" },
        { icon: "fa-cloud-arrow-up text-cyan", text: "Cluster Auto-Scale" },
        { icon: "fa-shield-halved text-purple", text: "Self-Healing SLAs" }
      ],
      kpis: [
        { val: "-72%", lbl: "MTTR Reduction" },
        { val: "100%", lbl: "Auto-Healed Pods" },
        { val: "99.999%", lbl: "Target Uptime" }
      ]
    }
  };

  function initIndustrySelector() {
    const buttons = document.querySelectorAll('.srv-ind-btn');
    const catEl = document.getElementById('indCategory');
    const titleEl = document.getElementById('indTitle');
    const descEl = document.getElementById('indDesc');
    const imgEl = document.getElementById('indImg');
    const metricEl = document.getElementById('indMetric');
    const chipsEl = document.getElementById('indChips');
    const kpi1Val = document.getElementById('kpi1Val');
    const kpi1Lbl = document.getElementById('kpi1Lbl');
    const kpi2Val = document.getElementById('kpi2Val');
    const kpi2Lbl = document.getElementById('kpi2Lbl');
    const kpi3Val = document.getElementById('kpi3Val');
    const kpi3Lbl = document.getElementById('kpi3Lbl');

    if (!buttons.length || !titleEl) return;

    buttons.forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const key = btn.getAttribute('data-ind');
        const data = industryData[key];
        if (!data) return;

        const updateContent = () => {
          if (catEl) catEl.textContent = data.category;
          if (titleEl) titleEl.textContent = data.title;
          if (descEl) descEl.textContent = data.desc;
          if (imgEl) imgEl.src = data.img;
          if (metricEl) metricEl.textContent = data.metric;

          if (chipsEl && data.chips) {
            chipsEl.innerHTML = data.chips.map(c => 
              `<span class="ind-chip"><i class="fa-solid ${c.icon}"></i> ${c.text}</span>`
            ).join('');
          }

          if (data.kpis && data.kpis.length >= 3) {
            if (kpi1Val) kpi1Val.textContent = data.kpis[0].val;
            if (kpi1Lbl) kpi1Lbl.textContent = data.kpis[0].lbl;
            if (kpi2Val) kpi2Val.textContent = data.kpis[1].val;
            if (kpi2Lbl) kpi2Lbl.textContent = data.kpis[1].lbl;
            if (kpi3Val) kpi3Val.textContent = data.kpis[2].val;
            if (kpi3Lbl) kpi3Lbl.textContent = data.kpis[2].lbl;
          }
        };

        if (gsapReady) {
          gsap.to(['.showcase-body', '.showcase-img-container'], {
            opacity: 0.2,
            duration: 0.12,
            onComplete: () => {
              updateContent();
              gsap.to(['.showcase-body', '.showcase-img-container'], { opacity: 1, duration: 0.25 });
            }
          });
        } else {
          updateContent();
        }
      });
    });
  }

  /* ──────────────────────────────────────────
     SECTION 5 — LIVE CONSOLE LOG STREAM
  ────────────────────────────────────────── */
  function initConsoleLogs() {
    const logEl = document.querySelector('.console-log');
    if (!logEl) return;

    const logs = [
      "Swarm-04: Batch processed 10,000 records in 142ms [SUCCESS]",
      "Neural-Router: Dispatched 840 parallel DAG tasks [OPTIMAL]",
      "Policy-Engine: 100% compliance verified across 4,200 entities [SECURE]",
      "Self-Heal: Auto-remediated latency spike on node-08 [RECOVERED]",
      "Ingest-Pipeline: Processed 450 enterprise documents/min [STABLE]"
    ];

    let logIdx = 0;
    setInterval(() => {
      logIdx = (logIdx + 1) % logs.length;
      if (gsapReady) {
        gsap.to(logEl, {
          opacity: 0,
          duration: 0.2,
          onComplete: () => {
            logEl.textContent = logs[logIdx];
            gsap.to(logEl, { opacity: 1, duration: 0.3 });
          }
        });
      } else {
        logEl.textContent = logs[logIdx];
      }
    }, 3200);
  }

  /* ──────────────────────────────────────────
     SECTION 6 — TELEMETRY TABS & LIVE STREAM
  ────────────────────────────────────────── */
  function initTelemetryChartTabs() {
    const tabs = document.querySelectorAll('.dash-tab');
    const chartLine1 = document.getElementById('chartLine1');
    const chartArea1 = document.getElementById('chartArea1');
    const chartLine2 = document.getElementById('chartLine2');
    const chartArea2 = document.getElementById('chartArea2');
    const chartTitle = document.querySelector('.chart-title');
    const chartSub = document.querySelector('.chart-sub');
    const chartLatency = document.querySelector('.chart-stat-latency');

    if (!tabs.length) return;

    const chartModes = {
      prediction: {
        title: "Multi-Vector Prediction & Confidence Flow",
        sub: "Real-time Bayesian confidence intervals across 16k tensor dimensions",
        latency: "P99: 8.4ms",
        d1: "M0,130 Q90,40 180,85 T360,35 T540,75 L600,60",
        a1: "M0,130 Q90,40 180,85 T360,35 T540,75 L600,60 L600,200 L0,200 Z",
        d2: "M0,160 Q100,100 200,125 T400,80 T560,95 L600,110",
        a2: "M0,160 Q100,100 200,125 T400,80 T560,95 L600,110 L600,200 L0,200 Z"
      },
      vectors: {
        title: "Dynamic Tensor Drift & Entropy Boundary",
        sub: "Variance detection across live operational latent representations",
        latency: "DRIFT: 0.012%",
        d1: "M0,90 Q120,150 240,70 T440,110 T600,45",
        a1: "M0,90 Q120,150 240,70 T440,110 T600,45 L600,200 L0,200 Z",
        d2: "M0,130 Q110,60 220,140 T420,60 T600,90",
        a2: "M0,130 Q110,60 220,140 T420,60 T600,90 L600,200 L0,200 Z"
      },
      cluster: {
        title: "Distributed GPU Node Load & Throughput",
        sub: "Aggregated compute utilization across 128 active inference pods",
        latency: "UTIL: 42.8%",
        d1: "M0,110 Q80,120 180,45 T380,50 T600,30",
        a1: "M0,110 Q80,120 180,45 T380,50 T600,30 L600,200 L0,200 Z",
        d2: "M0,150 Q100,140 200,85 T400,90 T600,70",
        a2: "M0,150 Q100,140 200,85 T400,90 T600,70 L600,200 L0,200 Z"
      }
    };

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const modeKey = tab.getAttribute('data-chart');
        const mode = chartModes[modeKey];
        if (!mode) return;

        if (chartTitle) chartTitle.textContent = mode.title;
        if (chartSub) chartSub.textContent = mode.sub;
        if (chartLatency) chartLatency.textContent = mode.latency;

        if (chartLine1 && mode.d1) chartLine1.setAttribute('d', mode.d1);
        if (chartArea1 && mode.a1) chartArea1.setAttribute('d', mode.a1);
        if (chartLine2 && mode.d2) chartLine2.setAttribute('d', mode.d2);
        if (chartArea2 && mode.a2) chartArea2.setAttribute('d', mode.a2);
      });
    });
  }

  function initLiveTelemetryStream() {
    const streamContainer = document.getElementById('telemetryStreamLines');
    if (!streamContainer) return;

    const sampleLines = [
      { tag: "ok", code: "[VEC-924]", msg: "Vector confidence 0.9992" },
      { tag: "ok", code: "[INF-418]", msg: "Sub-millisecond inference OK" },
      { tag: "warn", code: "[DRF-004]", msg: "Minor tensor entropy checked" },
      { tag: "ok", code: "[SWM-15]", msg: "Distributed sync complete" },
      { tag: "ok", code: "[XAI-088]", msg: "Attribution tree generated" }
    ];

    let lineIdx = 0;
    setInterval(() => {
      const now = new Date();
      const timeStr = [now.getHours(), now.getMinutes(), now.getSeconds()]
        .map(n => String(n).padStart(2, '0'))
        .join(':');

      const sample = sampleLines[lineIdx];
      lineIdx = (lineIdx + 1) % sampleLines.length;

      const newLine = document.createElement('div');
      newLine.className = 'stream-line';
      newLine.innerHTML = `<span class="stream-ts">${timeStr}</span> <span class="stream-${sample.tag}">${sample.code}</span> ${sample.msg}`;

      streamContainer.insertBefore(newLine, streamContainer.firstChild);
      if (streamContainer.children.length > 4) {
        streamContainer.removeChild(streamContainer.lastChild);
      }
    }, 2800);
  }

  /* ──────────────────────────────────────────
     SECTION 8 — MAGNETIC BUTTON HOVER
  ────────────────────────────────────────── */
  function initMagneticButtons() {
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    if (!magneticBtns.length) return;

    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        if (gsapReady) {
          gsap.to(btn, {
            x: x * 0.25,
            y: y * 0.25,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      });

      btn.addEventListener('mouseleave', () => {
        if (gsapReady) {
          gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.4)'
          });
        }
      });
    });
  }

  // Run on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initAccordion();
      initCounters();
      initIndustrySelector();
      initConsoleLogs();
      initTelemetryChartTabs();
      initLiveTelemetryStream();
      initMagneticButtons();
    });
  } else {
    initAccordion();
    initCounters();
    initIndustrySelector();
    initConsoleLogs();
    initTelemetryChartTabs();
    initLiveTelemetryStream();
    initMagneticButtons();
  }

})();
