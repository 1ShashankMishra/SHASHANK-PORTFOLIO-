/* ================================================================
   SCRIPT.JS
   Vanilla JS (ES6+), no dependencies. Organized into small
   self-contained modules, each initialized from the bottom
   "boot" section once the DOM is ready.

   NOTE ON DATA PERSISTENCE
   This file intentionally keeps all state (theme choice, edited
   grades/fees, uploaded files) in memory only, for the current
   page load. Nothing is written to localStorage/sessionStorage,
   so edits will not survive a refresh unless you wire this up to
   a backend or a database later. Uploaded files are only kept as
   temporary in-browser object URLs.
   ================================================================ */

"use strict";

/* ---------------------------------------------------------------
   1. LOADING SCREEN
--------------------------------------------------------------- */
function initLoadingScreen() {
  const screen = document.getElementById("loading-screen");
  const fill = screen ? screen.querySelector(".loading-bar-fill") : null;
  if (!screen) return;

  requestAnimationFrame(() => {
    if (fill) fill.style.width = "100%";
  });

  window.addEventListener("load", () => {
    setTimeout(() => screen.classList.add("loaded"), 700);
  });

  // Fallback in case 'load' already fired or is slow to fire
  setTimeout(() => screen.classList.add("loaded"), 3200);
}

/* ---------------------------------------------------------------
   2. SCROLL PROGRESS BAR
--------------------------------------------------------------- */
function initScrollProgress() {
  const bar = document.getElementById("scroll-progress");
  if (!bar) return;

  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${percent}%`;
  };

  window.addEventListener("scroll", update, { passive: true });
  update();
}

/* ---------------------------------------------------------------
   3. CURSOR GLOW (desktop / fine-pointer only)
--------------------------------------------------------------- */
function initCursorGlow() {
  const glow = document.getElementById("cursor-glow");
  if (!glow || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  window.addEventListener("mousemove", (e) => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
    glow.classList.add("active");
  });

  document.addEventListener("mouseleave", () => glow.classList.remove("active"));
}

/* ---------------------------------------------------------------
   4. NAVBAR: scrolled state, mobile toggle, active section
--------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("nav-menu");
  const links = document.querySelectorAll(".nav-link");
  const sections = Array.from(document.querySelectorAll("main .section[id]"));

  if (navbar) {
    const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("open");
      toggle.classList.toggle("open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    menu.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  if (sections.length && links.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute("id");
          links.forEach((link) => {
            link.classList.toggle("active", link.dataset.section === id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((section) => observer.observe(section));
  }
}

/* ---------------------------------------------------------------
   5. THEME TOGGLE (dark / light — in-memory only, see header note)
--------------------------------------------------------------- */
function initThemeToggle() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    document.documentElement.setAttribute("data-theme", isLight ? "dark" : "light");
  });
}

/* ---------------------------------------------------------------
   6. HERO TYPING EFFECT
--------------------------------------------------------------- */
function initTypingEffect() {
  const el = document.getElementById("typing-text");
  if (!el) return;

  const phrases = [
    "AI & Machine Learning Enthusiast",
    "Full-Stack Web Developer",
    "Problem Solver & Lifelong Learner",
    "B.Tech CSE (Artificial Intelligence)",
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const current = phrases[phraseIndex];

    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1600);
        return;
      }
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }
    setTimeout(tick, deleting ? 35 : 65);
  }

  tick();
}

/* ---------------------------------------------------------------
   7. INFERENCE NET — canvas neural-network hero backdrop (signature element)
--------------------------------------------------------------- */
function initInferenceNet() {
  const canvas = document.getElementById("inference-net");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const hero = canvas.closest(".hero");

  let width, height, nodes;
  const NODE_COUNT_DIVISOR = 14000; // lower = more nodes
  const LINK_DISTANCE = 150;

  function resize() {
    width = canvas.width = hero.offsetWidth;
    height = canvas.height = hero.offsetHeight;
    const count = Math.min(70, Math.max(24, Math.floor((width * height) / NODE_COUNT_DIVISOR)));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 1,
    }));
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    nodes.forEach((n) => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;
    });

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DISTANCE) {
          ctx.strokeStyle = `rgba(34, 211, 238, ${0.18 * (1 - dist / LINK_DISTANCE)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    nodes.forEach((n) => {
      ctx.fillStyle = "rgba(91, 143, 249, 0.85)";
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(step);
  }

  resize();
  window.addEventListener("resize", resize);

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    requestAnimationFrame(step);
  }
}

/* ---------------------------------------------------------------
   8. RIPPLE BUTTON EFFECT
--------------------------------------------------------------- */
function initRipple() {
  document.querySelectorAll(".ripple").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const rect = btn.getBoundingClientRect();
      btn.style.setProperty("--x", `${e.clientX - rect.left}px`);
      btn.style.setProperty("--y", `${e.clientY - rect.top}px`);
      btn.classList.remove("rippling");
      // eslint-disable-next-line no-unused-expressions
      void btn.offsetWidth; // restart animation
      btn.classList.add("rippling");
      setTimeout(() => btn.classList.remove("rippling"), 500);
    });
  });
}

/* ---------------------------------------------------------------
   9. SCROLL REVEAL
--------------------------------------------------------------- */
function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((item) => observer.observe(item));
}

/* ---------------------------------------------------------------
   10. COUNT-UP STATS
--------------------------------------------------------------- */
function initCountUp() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = el.dataset.decimal ? parseInt(el.dataset.decimal, 10) : 0;
    const finalValue = decimals ? parseFloat(`${target}.${el.dataset.decimal}`) : target;
    const duration = 1400;
    const start = performance.now();

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = finalValue * eased;
      el.textContent = decimals ? value.toFixed(1) : Math.round(value);
      if (progress < 1) requestAnimationFrame(frame);
      else el.textContent = decimals ? finalValue.toFixed(1) : finalValue;
    }
    requestAnimationFrame(frame);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((el) => observer.observe(el));
}

/* ---------------------------------------------------------------
   11. SKILL BARS
--------------------------------------------------------------- */
function initSkillBars() {
  const bars = document.querySelectorAll(".skill-bar[data-percent]");
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const bar = entry.target;
        const fill = bar.querySelector(".bar-fill");
        if (fill) fill.style.width = `${bar.dataset.percent}%`;
        obs.unobserve(bar);
      });
    },
    { threshold: 0.4 }
  );

  bars.forEach((bar) => observer.observe(bar));
}

/* ---------------------------------------------------------------
   12. CIRCULAR RINGS (CGPA + Fees paid)
--------------------------------------------------------------- */
function initRings() {
  const CIRCUMFERENCE = 2 * Math.PI * 52; // matches r=52 in the SVG markup

  function setRing(container, percent) {
    const ring = container.querySelector(".ring-fill");
    if (!ring) return;
    ring.style.strokeDasharray = `${CIRCUMFERENCE}`;
    ring.style.strokeDashoffset = `${CIRCUMFERENCE}`;
    requestAnimationFrame(() => {
      const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;
      ring.style.strokeDashoffset = `${offset}`;
    });
  }

  const cgpaRing = document.querySelector(".cgpa-ring");
  if (cgpaRing) {
    const value = parseFloat(cgpaRing.dataset.value);
    const max = parseFloat(cgpaRing.dataset.max || "10");
    setRing(cgpaRing, (value / max) * 100);
  }

  const feeRing = document.querySelector(".circular-progress");
  if (feeRing) {
    setRing(feeRing, parseFloat(feeRing.dataset.percent));
  }
}

/* ---------------------------------------------------------------
   13. CGPA TREND CHART (pure canvas, reads live values from the table)
--------------------------------------------------------------- */
function initCgpaChart() {
  const canvas = document.getElementById("cgpa-chart");
  const table = document.getElementById("results-table");
  if (!canvas || !table) return;

  function readSgpaValues() {
    return Array.from(table.querySelectorAll("tbody tr")).map((row) => {
      const raw = row.querySelector('[data-field="sgpa"]').textContent.trim();
      const num = parseFloat(raw);
      return Number.isNaN(num) ? null : num;
    });
  }

  function draw() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    const values = readSgpaValues();
    const padding = 28;
    const w = rect.width - padding * 2;
    const h = rect.height - padding * 2;
    const max = 10;
    const points = values
      .map((v, i) => (v === null ? null : { x: padding + (i / (values.length - 1)) * w, y: padding + h - (v / max) * h }))
      .filter(Boolean);

    // grid lines
    ctx.strokeStyle = "rgba(148,163,184,0.14)";
    ctx.lineWidth = 1;
    for (let g = 0; g <= 4; g++) {
      const y = padding + (g / 4) * h;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + w, y);
      ctx.stroke();
    }

    if (points.length < 2) return;

    // area fill
    const gradient = ctx.createLinearGradient(0, padding, 0, padding + h);
    gradient.addColorStop(0, "rgba(34, 211, 238, 0.35)");
    gradient.addColorStop(1, "rgba(34, 211, 238, 0)");
    ctx.beginPath();
    ctx.moveTo(points[0].x, padding + h);
    points.forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, padding + h);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // line
    ctx.beginPath();
    points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
    ctx.strokeStyle = "#22d3ee";
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    ctx.stroke();

    // points
    points.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = "#e7ecf5";
      ctx.fill();
    });
  }

  draw();
  window.addEventListener("resize", draw);
  table.addEventListener("blur", draw, true); // redraw after editing a grade
}

/* ---------------------------------------------------------------
   14. FEE TABLE — recalculate remaining + status on edit
--------------------------------------------------------------- */
function initFeesTable() {
  const table = document.getElementById("fees-table");
  if (!table) return;

  const currency = (n) => `₹${Math.max(0, Math.round(n)).toLocaleString("en-IN")}`;
  const parseCurrency = (text) => parseFloat(text.replace(/[^\d.-]/g, "")) || 0;

  function recalcRow(row) {
    const cells = row.querySelectorAll("td.editable");
    // Order: tuition, hostel, exam, other, scholarship, total, paid, remaining
    const [tuition, hostel, exam, other, scholarship, total, paid, remaining] = cells;
    const computedTotal = parseCurrency(tuition.textContent) + parseCurrency(hostel.textContent) + parseCurrency(exam.textContent) + parseCurrency(other.textContent) - parseCurrency(scholarship.textContent);
    total.textContent = currency(computedTotal);
    const paidAmount = parseCurrency(paid.textContent);
    const remainingAmount = Math.max(computedTotal - paidAmount, 0);
    remaining.textContent = currency(remainingAmount);

    const badge = row.querySelector(".status-badge");
    if (badge) {
      badge.classList.remove("status-paid", "status-partial", "status-pending");
      if (remainingAmount <= 0 && paidAmount > 0) {
        badge.textContent = "Paid";
        badge.classList.add("status-paid");
      } else if (paidAmount > 0) {
        badge.textContent = "Partial";
        badge.classList.add("status-partial");
      } else {
        badge.textContent = "Pending";
        badge.classList.add("status-pending");
      }
    }
    updateFeeSummary();
  }

  function updateFeeSummary() {
    let totalFees = 0;
    let totalPaid = 0;
    table.querySelectorAll("tbody tr").forEach((row) => {
      const cells = row.querySelectorAll("td.editable");
      totalFees += parseCurrency(cells[5].textContent);
      totalPaid += parseCurrency(cells[6].textContent);
    });
    const pending = Math.max(totalFees - totalPaid, 0);

    const totalFeesEl = document.querySelector('[data-field="total-fees"]');
    const totalPaidEl = document.querySelector('[data-field="total-paid"]');
    const totalPendingEl = document.querySelector('[data-field="total-pending"]');
    if (totalFeesEl) totalFeesEl.textContent = currency(totalFees);
    if (totalPaidEl) totalPaidEl.textContent = currency(totalPaid);
    if (totalPendingEl) totalPendingEl.textContent = currency(pending);

    const ring = document.querySelector(".circular-progress");
    if (ring && totalFees > 0) {
      const percent = (totalPaid / totalFees) * 100;
      ring.dataset.percent = percent.toFixed(1);
      const valueLabel = ring.querySelector(".ring-value");
      if (valueLabel) valueLabel.textContent = `${percent.toFixed(1)}%`;
      initRings();
    }
  }

  table.querySelectorAll("tbody tr").forEach((row) => {
    row.querySelectorAll("td.editable").forEach((cell) => {
      cell.addEventListener("blur", () => recalcRow(row));
    });
  });
}

/* ---------------------------------------------------------------
   15. FILE UPLOADS — marksheets, fee receipts, resume, certificates
   All handled as temporary in-browser object URLs (see header note).
--------------------------------------------------------------- */
function initFileUploads() {
  const marksheetFiles = new Map(); // sem -> objectURL
  const receiptFiles = new Map();

  document.querySelectorAll("[data-sem-upload]").forEach((input) => {
    input.addEventListener("change", () => {
      const file = input.files[0];
      if (!file) return;
      const sem = input.dataset.semUpload;
      marksheetFiles.set(sem, URL.createObjectURL(file));
      const row = document.querySelector(`#results-table tr[data-sem="${sem}"]`);
      if (row) {
        row.querySelector(".view-marksheet").disabled = false;
        row.querySelector(".download-marksheet").disabled = false;
      }
    });
  });

  document.querySelectorAll(".view-marksheet").forEach((btn) => {
    btn.addEventListener("click", () => {
      const url = marksheetFiles.get(btn.dataset.sem);
      if (url) window.open(url, "_blank", "noopener");
      else alert(`No marksheet uploaded yet for Semester ${btn.dataset.sem}.`);
    });
  });

  document.querySelectorAll(".download-marksheet").forEach((btn) => {
    btn.addEventListener("click", () => {
      const url = marksheetFiles.get(btn.dataset.sem);
      if (!url) {
        alert(`No marksheet uploaded yet for Semester ${btn.dataset.sem}.`);
        return;
      }
      const a = document.createElement("a");
      a.href = url;
      a.download = `Semester-${btn.dataset.sem}-Marksheet.pdf`;
      a.click();
    });
  });

  document.querySelectorAll("[data-fee-upload]").forEach((input) => {
    input.addEventListener("change", () => {
      const file = input.files[0];
      if (!file) return;
      const sem = input.dataset.feeUpload;
      receiptFiles.set(sem, URL.createObjectURL(file));
    });
  });

  document.querySelectorAll(".download-receipt").forEach((btn) => {
    btn.addEventListener("click", () => {
      const url = receiptFiles.get(btn.dataset.sem);
      if (!url) {
        alert(`No receipt uploaded yet for Semester ${btn.dataset.sem}.`);
        return;
      }
      const a = document.createElement("a");
      a.href = url;
      a.download = `Semester-${btn.dataset.sem}-Receipt`;
      a.click();
    });
  });

  const resumeInput = document.getElementById("resume-upload");
  if (resumeInput) {
    resumeInput.addEventListener("change", () => {
      const file = resumeInput.files[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      document.querySelectorAll('.resume-actions a').forEach((a) => {
        a.href = url;
        if (a.hasAttribute("download")) a.download = file.name;
      });
    });
  }

  const certUploadInput = document.querySelector(".upload-cert input[type='file']");
  const certGrid = document.querySelector(".certificates-grid");
  if (certUploadInput && certGrid) {
    certUploadInput.addEventListener("change", () => {
      const file = certUploadInput.files[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      const figure = document.createElement("figure");
      figure.className = "cert-card glass reveal in-view";
      figure.dataset.certTitle = file.name;
      figure.dataset.certOrg = "Uploaded";
      figure.dataset.certDate = new Date().toLocaleDateString();
      figure.innerHTML = `
        <img src="${url}" alt="${file.name}" loading="lazy" width="360" height="260" />
        <figcaption>
          <h3>${file.name}</h3>
          <p>Uploaded · ${new Date().toLocaleDateString()}</p>
        </figcaption>`;
      certGrid.insertBefore(figure, certGrid.lastElementChild);
      attachCertModalHandler(figure);
    });
  }
}

/* ---------------------------------------------------------------
   16. CERTIFICATE MODAL
--------------------------------------------------------------- */
function attachCertModalHandler(card) {
  card.addEventListener("click", () => {
    const modal = document.getElementById("cert-modal");
    const img = document.getElementById("cert-modal-img");
    const title = document.getElementById("cert-modal-title");
    const meta = document.getElementById("cert-modal-meta");
    if (!modal || !img || !title || !meta) return;

    const cardImg = card.querySelector("img");
    img.src = cardImg ? cardImg.src : "";
    img.alt = cardImg ? cardImg.alt : "";
    title.textContent = card.dataset.certTitle || "";
    meta.textContent = [card.dataset.certOrg, card.dataset.certDate].filter(Boolean).join(" · ");

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  });
}

function initCertificateModal() {
  const modal = document.getElementById("cert-modal");
  const closeBtn = document.getElementById("cert-modal-close");
  if (!modal) return;

  document.querySelectorAll(".cert-card[data-cert-title]").forEach(attachCertModalHandler);

  const close = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  };

  if (closeBtn) closeBtn.addEventListener("click", close);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

/* ---------------------------------------------------------------
   17. PROJECT CARD 3D TILT
--------------------------------------------------------------- */
function initTilt() {
  const cards = document.querySelectorAll(".tilt");
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

/* ---------------------------------------------------------------
   18. CONTACT FORM VALIDATION
--------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById("contact-form");
  const success = document.getElementById("form-success");
  if (!form) return;

  const validators = {
    name: (v) => v.trim().length > 1,
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    subject: (v) => v.trim().length > 2,
    message: (v) => v.trim().length > 9,
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    Object.keys(validators).forEach((field) => {
      const input = form.elements[field];
      const group = input.closest(".form-group");
      const isValid = validators[field](input.value);
      group.classList.toggle("invalid", !isValid);
      if (!isValid) valid = false;
    });

    if (valid) {
      if (success) success.textContent = "Message sent — thanks for reaching out! I'll get back to you soon.";
      form.reset();
    } else if (success) {
      success.textContent = "";
    }
  });

  Object.keys(validators).forEach((field) => {
    const input = form.elements[field];
    input.addEventListener("input", () => {
      const group = input.closest(".form-group");
      if (validators[field](input.value)) group.classList.remove("invalid");
    });
  });
}

/* ---------------------------------------------------------------
   19. BACK TO TOP
--------------------------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;

  window.addEventListener(
    "scroll",
    () => btn.classList.toggle("visible", window.scrollY > 600),
    { passive: true }
  );

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---------------------------------------------------------------
   20. FOOTER YEAR
--------------------------------------------------------------- */
function initFooterYear() {
  const el = document.getElementById("current-year");
  if (el) el.textContent = new Date().getFullYear();
}

/* ---------------------------------------------------------------
   BOOT
--------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initLoadingScreen();
  initScrollProgress();
  initCursorGlow();
  initNavbar();
  initThemeToggle();
  initTypingEffect();
  initInferenceNet();
  initRipple();
  initScrollReveal();
  initCountUp();
  initSkillBars();
  initRings();
  initCgpaChart();
  initFeesTable();
  initFileUploads();
  initCertificateModal();
  initTilt();
  initContactForm();
  initBackToTop();
  initFooterYear();
});
