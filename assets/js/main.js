/* ============================================================
   DEVZINK — Interactions
   Vanilla JS. No dependencies.
   ============================================================ */

(function () {
  'use strict';

  /* ---------- 1. Nav scroll state ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 2. Mobile nav toggle ---------- */
  const toggle = document.getElementById('navToggle');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    nav.querySelectorAll('.nav__mobile a').forEach((a) => {
      a.addEventListener('click', () => {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- 3. Active nav link ---------- */
  const currentPath = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav__links a, .nav__mobile a').forEach((a) => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href === currentPath) a.classList.add('is-active');
  });

  /* ---------- 4. Nav dropdown toggle (keyboard + click) ---------- */
  const dropdownTrigger = document.querySelector('.nav__dropdown-trigger');
  if (dropdownTrigger) {
    dropdownTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      const open = dropdownTrigger.getAttribute('aria-expanded') === 'true';
      dropdownTrigger.setAttribute('aria-expanded', String(!open));
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav__dropdown')) {
        dropdownTrigger.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        dropdownTrigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- 5. Hero rotator ---------- */
  const rotator = document.querySelector('.rotator');
  if (rotator) {
    const words = rotator.querySelectorAll('.rotator__word');
    if (words.length > 1) {
      let i = 0;
      setInterval(() => {
        const current = words[i];
        const next = words[(i + 1) % words.length];
        current.classList.remove('is-active');
        current.classList.add('is-leaving');
        next.classList.remove('is-leaving');
        void next.offsetWidth;
        next.classList.add('is-active');
        setTimeout(() => current.classList.remove('is-leaving'), 700);
        i = (i + 1) % words.length;
      }, 2800);
    }
  }

  /* ---------- 6. Scroll reveal ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  /* ---------- 7. Premium cursor glow ---------- */
  (function () {
    const glow = document.getElementById('cursorGlow');
    if (!glow) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let rafId = null;
    let running = false;
    const EASE = 0.18;

    function frame() {
      currentX += (targetX - currentX) * EASE;
      currentY += (targetY - currentY) * EASE;
      glow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;

      if (Math.abs(targetX - currentX) > 0.5 || Math.abs(targetY - currentY) > 0.5) {
        rafId = requestAnimationFrame(frame);
      } else {
        running = false;
        rafId = null;
      }
    }

    function start() {
      if (!running) {
        running = true;
        rafId = requestAnimationFrame(frame);
      }
    }

    document.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!glow.classList.contains('is-ready')) glow.classList.add('is-ready');
      start();
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      glow.classList.remove('is-ready');
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
        running = false;
      }
    });
  })();

    /* ---------- 8. Page transition (fade out on navigation) ---------- */
  (function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const currentPath = window.location.pathname;

    const links = document.querySelectorAll('a[href]');
    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;
      if (href.startsWith('#')) return;
      if (href.startsWith('mailto:')) return;
      if (href.startsWith('tel:')) return;
      if (href.startsWith('http')) return;
      if (link.target === '_blank') return;

      // Skip same-page links (anchor navigation on current page)
      // Example: on services.html, ignore "services.html#uiux"
      try {
        const linkUrl = new URL(href, window.location.href);
        if (linkUrl.pathname === currentPath) return;
      } catch (_) {
        // Malformed URL — fall through to normal link handling
      }

      link.addEventListener('click', (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

        e.preventDefault();
        document.body.classList.add('page-leaving');
        setTimeout(() => {
          window.location.href = href;
        }, 250);
      });
    });

    // Handle browser back/forward — remove leaving class on pageshow
    window.addEventListener('pageshow', () => {
      document.body.classList.remove('page-leaving');
    });
  })();

  /* ---------- 9. Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 10. Smooth accordions (jobs + FAQ) ---------- */
  (function () {
    // Jobs — accordion (only one open at a time)
    const jobs = document.querySelectorAll('[data-job]');
    jobs.forEach((job) => {
      const trigger = job.querySelector('.job__trigger');
      if (!trigger) return;

      trigger.addEventListener('click', () => {
        const willOpen = !job.classList.contains('is-open');

        // Close all others
        jobs.forEach((other) => {
          if (other !== job && other.classList.contains('is-open')) {
            other.classList.remove('is-open');
            const t = other.querySelector('.job__trigger');
            if (t) t.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current
        job.classList.toggle('is-open', willOpen);
        trigger.setAttribute('aria-expanded', String(willOpen));
      });
    });

    // FAQ — independent toggles
    const faqs = document.querySelectorAll('[data-faq]');
    faqs.forEach((faq) => {
      const trigger = faq.querySelector('.faq-item__trigger');
      if (!trigger) return;

      trigger.addEventListener('click', () => {
        const willOpen = !faq.classList.contains('is-open');
        faq.classList.toggle('is-open', willOpen);
        trigger.setAttribute('aria-expanded', String(willOpen));
      });
    });
  })();


})();