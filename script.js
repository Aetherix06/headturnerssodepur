/* ═══════════════════════════════════════════════════════════
   HEAD TURNERS SALONS — script.js
   No dark/light mode. All sections guaranteed visible.
═══════════════════════════════════════════════════════════ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Helpers ─────────────────────────────────────── */
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ═══════════════════════════════════════════════════
     1. PRELOADER
  ═══════════════════════════════════════════════════ */
  const loader = $('#loader');
  const hideLoader = () => loader && loader.classList.add('done');
  window.addEventListener('load', () => setTimeout(hideLoader, 500));
  setTimeout(hideLoader, 2800); // hard fallback

  /* ═══════════════════════════════════════════════════
     2. FOOTER YEAR
  ═══════════════════════════════════════════════════ */
  const yrEl = $('#yr');
  if (yrEl) yrEl.textContent = new Date().getFullYear();

  /* ═══════════════════════════════════════════════════
     3. SCROLL REVEAL — guaranteed to show everything
  ═══════════════════════════════════════════════════ */
  const makeVisible = el => el.classList.add('visible');

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        makeVisible(e.target);
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });

  const observeAll = () => {
    $$('.reveal').forEach(el => {
      // If already in viewport (e.g. stats section on a big screen), show immediately
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        makeVisible(el);
      } else {
        revealObs.observe(el);
      }
    });
  };

  // Run now for static elements
  observeAll();

  // Safety net: show all remaining hidden elements after 3.5s
  setTimeout(() => {
    $$('.reveal:not(.visible)').forEach(makeVisible);
  }, 3500);

  /* ═══════════════════════════════════════════════════
     4. NAVBAR — SCROLL STATE + ACTIVE SPY
  ═══════════════════════════════════════════════════ */
  const navbar   = $('#navbar');
  const progress = $('#scrollProgress');
  const btt      = $('#backToTop');
  const sections = $$('section[id]');
  const navLinks = $$('.nav-link');

  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    const dh = document.documentElement.scrollHeight - window.innerHeight;

    navbar?.classList.toggle('scrolled', sy > 60);
    if (progress && dh > 0) progress.style.width = `${(sy / dh) * 100}%`;
    btt?.classList.toggle('show', sy > 450);

    let current = '';
    sections.forEach(s => { if (sy >= s.offsetTop - 180) current = s.id; });
    navLinks.forEach(l => l.classList.toggle('active-link', l.getAttribute('href') === `#${current}`));
  }, { passive: true });

  /* ═══════════════════════════════════════════════════
     5. HAMBURGER MENU
  ═══════════════════════════════════════════════════ */
  const burger  = $('#navBurger');
  const navMenu = $('#navMenu');

  burger?.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  });

  // Close on nav link click
  $$('.nav-link').forEach(l => l.addEventListener('click', () => {
    navMenu.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }));

  // Close on outside tap
  document.addEventListener('click', e => {
    if (!navMenu?.contains(e.target) && !burger?.contains(e.target)) {
      navMenu?.classList.remove('open');
      burger?.classList.remove('open');
      burger?.setAttribute('aria-expanded', 'false');
    }
  });

  /* ═══════════════════════════════════════════════════
     6. DUAL CURSOR (desktop fine-pointer only)
  ═══════════════════════════════════════════════════ */
  const dot  = $('#cursorDot');
  const ring = $('#cursorRing');
  const fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  if (dot && ring && fine) {
    let mx = -200, my = -200, rx = -200, ry = -200;

    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    });

    (function animRing() {
      rx += (mx - rx) * 0.13;
      ry += (my - ry) * 0.13;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(animRing);
    })();

    const HOV = 'a, button, .svc-card, .why-card, .g-item, .float-btn, .rev-btn, .h-badge';
    $$(HOV).forEach(el => {
      el.addEventListener('mouseenter', () => { dot.classList.add('hov'); ring.classList.add('hov'); });
      el.addEventListener('mouseleave', () => { dot.classList.remove('hov'); ring.classList.remove('hov'); });
    });
  }

  /* ═══════════════════════════════════════════════════
     7. DATA — SERVICES
  ═══════════════════════════════════════════════════ */
  const services = [
    { ico:'i-scissors', name:'Hair Cut',          desc:'Precision cuts tailored to your face shape, texture, and personal style by our expert stylists.' },
    { ico:'i-comb',     name:'Hair Styling',       desc:'Blow-outs, sleek updos, and premium finishing styles for any occasion or event.' },
    { ico:'i-palette',  name:'Hair Coloring',      desc:'Global tones, custom balayage, rich ombre, and multi-dimensional highlights.' },
    { ico:'i-spa',      name:'Hair Spa',           desc:'Deep-nourishing botanical rituals that restore moisture, elasticity, and brilliant shine.' },
    { ico:'i-spa',      name:'Keratin Treatment',  desc:'Premium smoothing systems designed to eliminate frizz and flyaways for months.' },
    { ico:'i-comb',     name:'Hair Smoothening',   desc:'Professional straightening formulas for ultra-silky, manageable, frizz-free locks.' },
    { ico:'i-star',     name:'Facial Treatment',   desc:'Radiance-restoring facials fully customised to your unique skin type and goals.' },
    { ico:'i-spa',      name:'Skin Cleanup',       desc:'Quick, refreshing treatments that clarify pores and immediately revive your natural glow.' },
    { ico:'i-scissors', name:'Threading',          desc:'Flawless brow shaping and gentle facial hair removal with precision cotton technique.' },
    { ico:'i-spa',      name:'Waxing',             desc:'Gentle hair removal using natural wax formulations for smooth, long-lasting results.' },
    { ico:'i-palette',  name:'Manicure',           desc:'Luxury nail care with scrub, cuticle oil, and a polished professional finish.' },
    { ico:'i-spa',      name:'Pedicure',           desc:'Revitalising foot bath, callus treatment, relaxing massage, and fresh polish finish.' },
    { ico:'i-star',     name:'Bridal Makeup',      desc:'Bespoke HD and airbrush bridal makeup that lasts all day through every special moment.' },
    { ico:'i-palette',  name:'Party Makeup',       desc:'Bold, event-ready glam that photographs brilliantly and stays pristine all night long.' },
    { ico:'i-scissors', name:'Beard Grooming',     desc:'Hot towel razor line-ups, precision detailing, and premium beard conditioning oil.' },
  ];

  /* ═══════════════════════════════════════════════════
     8. INJECT SERVICES GRID
  ═══════════════════════════════════════════════════ */
  const svcGrid = $('#svcGrid');
  const fService = $('#fService');

  if (svcGrid) {
    svcGrid.innerHTML = services.map((s, i) => `
      <div class="svc-card reveal rv-up" data-delay="${(i % 3) + 1}">
        <div class="svc-icon-wrap">
          <svg viewBox="0 0 24 24"><use href="#${s.ico}"/></svg>
        </div>
        <h3>${s.name}</h3>
        <p>${s.desc}</p>
        <button class="svc-cta" data-svc="${s.name}">
          <span>Book Now</span>
          <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>
        </button>
      </div>
    `).join('');

    // Observe newly injected cards
    $$('.svc-card').forEach(el => {
      const rect = el.getBoundingClientRect();
      rect.top < window.innerHeight ? makeVisible(el) : revealObs.observe(el);
    });

    // Book Now shortcut
    svcGrid.addEventListener('click', e => {
      const btn = e.target.closest('.svc-cta');
      if (!btn) return;
      if (fService) fService.value = btn.dataset.svc;
      $('#booking')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Populate select
  if (fService) {
    services.forEach(s => {
      const o = document.createElement('option');
      o.value = o.textContent = s.name;
      fService.appendChild(o);
    });
  }

  /* ═══════════════════════════════════════════════════
     9. INJECT WHY GRID
  ═══════════════════════════════════════════════════ */
  const whyItems = [
    { ico:'i-star',    title:'Experienced Professionals', desc:'Internationally trained stylists who treat beauty as an art form — every time.' },
    { ico:'i-spa',     title:'Luxury Atmosphere',          desc:'Breathe easy in our clean, calm, premium relaxation zones designed for you.' },
    { ico:'i-palette', title:'Premium Products',           desc:'Only dermatologist-tested, professional-grade brands — always, without exception.' },
    { ico:'i-globe',   title:'Modern Equipment',           desc:'Sterilized, industry-leading tools for precise, consistent, and safe results.' },
    { ico:'i-check',   title:'Affordable Pricing',         desc:'Elite beauty experiences without an elite price tag. Accessible luxury for all.' },
    { ico:'i-check',   title:'Clean & Hygienic',           desc:'Rigorous sanitation and sterilization protocols between every single session.' },
    { ico:'i-heart',   title:'Friendly & Warm Staff',      desc:'Attentive, hospitable service from the moment you walk through our doors.' },
    { ico:'i-star',    title:'Rated 4.8★ on Google',       desc:'806+ verified reviews from loyal guests across the Sodepur community.' },
  ];

  const whyGrid = $('#whyGrid');
  if (whyGrid) {
    whyGrid.innerHTML = whyItems.map((w, i) => `
      <div class="why-card reveal rv-up" data-delay="${(i % 4) + 1}">
        <div class="why-icon">
          <svg viewBox="0 0 24 24"><use href="#${w.ico}"/></svg>
        </div>
        <h3>${w.title}</h3>
        <p>${w.desc}</p>
      </div>
    `).join('');
    $$('.why-card').forEach(el => {
      const rect = el.getBoundingClientRect();
      rect.top < window.innerHeight ? makeVisible(el) : revealObs.observe(el);
    });
  }

  /* ═══════════════════════════════════════════════════
     10. ANIMATED STAT COUNTERS
  ═══════════════════════════════════════════════════ */
  const runCounter = el => {
    const target   = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimal || 0);
    const suffix   = el.dataset.suffix || '';
    const dur      = 1800;
    let   start    = null;
    const step = ts => {
      if (!start) start = ts;
      const p    = Math.min((ts - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = (target * ease).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const statObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { runCounter(e.target); statObs.unobserve(e.target); } });
  }, { threshold: 0.6 });
  $$('.stat-num').forEach(el => statObs.observe(el));

  /* ═══════════════════════════════════════════════════
     11. GALLERY INJECTION + LIGHTBOX
  ═══════════════════════════════════════════════════ */
  const galleryImgs = [
    'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=700&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=700&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519415943484-9fa1873496d4?q=80&w=700&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=700&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=700&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=700&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=700&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1470259078422-826894b933aa?q=80&w=700&auto=format&fit=crop',
  ];

  const galleryGrid = $('#galleryGrid');
  if (galleryGrid) {
    galleryGrid.innerHTML = galleryImgs.map((src, i) => `
      <div class="g-item reveal rv-up" data-delay="${(i % 4) + 1}">
        <img src="${src}" alt="Head Turners Salons transformation ${i + 1}" loading="lazy">
        <div class="g-cover">
          <div class="g-zoom"><svg viewBox="0 0 24 24"><use href="#i-search"/></svg></div>
        </div>
      </div>
    `).join('');
    $$('.g-item').forEach(el => {
      const rect = el.getBoundingClientRect();
      rect.top < window.innerHeight ? makeVisible(el) : revealObs.observe(el);
    });
  }

  // Lightbox
  const lb      = $('#lightbox');
  const lbImg   = $('#lbImg');
  const lbClose = $('#lbClose');

  const openLB  = src => { lbImg.src = src; lb.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const closeLB = ()  => { lb.classList.remove('open'); document.body.style.overflow = ''; };

  galleryGrid?.addEventListener('click', e => {
    const item = e.target.closest('.g-item');
    if (item) openLB($('img', item).src);
  });
  lbClose?.addEventListener('click', closeLB);
  lb?.addEventListener('click', e => { if (e.target === lb) closeLB(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLB(); });

  /* ═══════════════════════════════════════════════════
     12. REVIEWS CAROUSEL
  ═══════════════════════════════════════════════════ */
  const reviewsData = [
    { name:'Ananya Roy',        role:'Regular Guest',  text:'Hands down the best salon in Sodepur. My balayage has never looked this vibrant — the team genuinely listens and delivers beyond expectations.' },
    { name:'Priya Sengupta',    role:'Bridal Client',  text:'They made me feel like royalty on my wedding day. The airbrush bridal makeup lasted the entire celebration without a single touch-up needed.' },
    { name:'Rohan Das',         role:'New Guest',      text:'Walked in for a haircut, walked out feeling completely transformed. Clean space, friendly team, and incredible attention to every detail.' },
    { name:'Meghna Chatterjee', role:'Regular Guest',  text:'The hair spa here is pure therapy. Been coming regularly for over a year and the quality and care have never dipped even once.' },
    { name:'Arjun Banerjee',    role:'Regular Guest',  text:'Consistently sharp beard grooming every single visit. The staff remember exactly how I like my styling — that level of care is rare.' },
  ];

  const track   = $('#reviewsTrack');
  const dotsEl  = $('#revDots');
  const prevBtn = $('#revPrev');
  const nextBtn = $('#revNext');
  let   revIdx  = 0;

  if (track && dotsEl) {
    track.innerHTML = reviewsData.map(r => `
      <div class="rev-card">
        <div class="rev-inner">
          <div class="rev-stars">★★★★★</div>
          <p class="rev-text">"${r.text}"</p>
          <div class="rev-author">
            <div class="rev-av">${r.name[0]}</div>
            <div>
              <div class="rev-name">${r.name}</div>
              <div class="rev-role">${r.role}</div>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    dotsEl.innerHTML = reviewsData.map((_, i) =>
      `<span data-i="${i}" class="${i === 0 ? 'on' : ''}" aria-label="Slide ${i + 1}"></span>`
    ).join('');

    const goTo = n => {
      revIdx = ((n % reviewsData.length) + reviewsData.length) % reviewsData.length;
      track.style.transform = `translateX(-${revIdx * 100}%)`;
      $$('span', dotsEl).forEach((d, i) => d.classList.toggle('on', i === revIdx));
    };

    prevBtn?.addEventListener('click', () => goTo(revIdx - 1));
    nextBtn?.addEventListener('click', () => goTo(revIdx + 1));
    dotsEl.addEventListener('click', e => {
      const sp = e.target.closest('span');
      if (sp) goTo(+sp.dataset.i);
    });

    // Touch swipe
    let tx = 0;
    track.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   e => {
      const diff = tx - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) goTo(diff > 0 ? revIdx + 1 : revIdx - 1);
    });

    // Auto-play
    let ap = setInterval(() => goTo(revIdx + 1), 6000);
    const sec = track.closest('section');
    sec?.addEventListener('mouseenter', () => clearInterval(ap));
    sec?.addEventListener('mouseleave', () => { ap = setInterval(() => goTo(revIdx + 1), 6000); });
  }

  /* ═══════════════════════════════════════════════════
     13. BOOKING FORM VALIDATION
  ═══════════════════════════════════════════════════ */
  const form     = $('#bookForm');
  const formSucc = $('#formSuccess');
  const fDate    = $('#fDate');

  if (fDate) fDate.min = new Date().toISOString().split('T')[0];

  const validators = {
    fName:    v => v.trim().length >= 3,
    fPhone:   v => /^[0-9]{10}$/.test(v.trim()),
    fEmail:   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    fService: v => v !== '',
    fDate:    v => v !== '',
    fTime:    v => v !== '',
  };

  const checkField = id => {
    const el    = $(`#${id}`, form);
    const field = el?.closest('.field');
    if (!el || !field) return true;
    const ok = validators[id]?.(el.value) ?? true;
    field.classList.toggle('bad', !ok);
    return ok;
  };

  // Live validation
  Object.keys(validators).forEach(id => {
    const el = $(`#${id}`, form);
    if (!el) return;
    el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', () => checkField(id));
  });

  form?.addEventListener('submit', e => {
    e.preventDefault();
    const allOk = Object.keys(validators).map(checkField).every(Boolean);
    if (!allOk) { $('.field.bad input, .field.bad select', form)?.focus(); return; }

    if (formSucc) {
      formSucc.classList.add('show');
      formSucc.setAttribute('aria-hidden', 'false');
    }
    form.reset();
    $$('.field', form).forEach(f => f.classList.remove('bad'));
    setTimeout(() => {
      formSucc?.classList.remove('show');
      formSucc?.setAttribute('aria-hidden', 'true');
    }, 4500);
  });

  /* ═══════════════════════════════════════════════════
     14. BACK TO TOP
  ═══════════════════════════════════════════════════ */
  btt?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ═══════════════════════════════════════════════════
     15. HERO PARALLAX (desktop only)
  ═══════════════════════════════════════════════════ */
  if (fine) {
    const heroBg = $('.hero-bg');
    if (heroBg) {
      window.addEventListener('scroll', () => {
        const sy = window.scrollY;
        if (sy < window.innerHeight * 1.5)
          heroBg.style.transform = `translateY(${sy * 0.26}px)`;
      }, { passive: true });
    }
  }

  /* ═══════════════════════════════════════════════════
     16. SMOOTH ANCHOR LINKS (iOS fallback)
  ═══════════════════════════════════════════════════ */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

}); // end DOMContentLoaded