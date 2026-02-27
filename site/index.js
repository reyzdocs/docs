import { EQUIPMENT_ITEMS } from './equipment-list.js';

const MAX_EQUIPMENT_RENDER = Number.POSITIVE_INFINITY;

function toHumanEquipmentName(slug) {
  return slug
    .toString()
    .trim()
    .replace(/[_-]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function isReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* ── Scroll Animations (IntersectionObserver) ── */
function mountScrollAnimations() {
  const els = document.querySelectorAll('.animate-on-scroll');
  if (!els.length) return;

  if (isReducedMotion()) {
    els.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach((el) => observer.observe(el));
}

/* ── Equipment List ── */
function renderEquipmentList() {
  const track = document.getElementById('equipment-track');
  if (!track) return;

  const fragment = document.createDocumentFragment();
  const items = EQUIPMENT_ITEMS.slice(0, MAX_EQUIPMENT_RENDER);

  for (const item of items) {
    const li = document.createElement('li');
    li.className = 'equipment-card';

    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = toHumanEquipmentName(item.slug);
    img.width = 256;
    img.height = 256;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.referrerPolicy = 'no-referrer';

    const caption = document.createElement('figcaption');
    caption.textContent = toHumanEquipmentName(item.slug);

    figure.append(img, caption);
    li.append(figure);
    fragment.append(li);
  }

  track.append(fragment);
}

/* ── Equipment Scroller Controls ── */
function mountEquipmentControls() {
  const scroller = document.getElementById('equipment-scroller');
  const track = document.getElementById('equipment-track');
  const prev = document.getElementById('equipment-prev');
  const next = document.getElementById('equipment-next');
  if (!scroller || !track || !prev || !next) return;

  const behavior = isReducedMotion() ? 'auto' : 'smooth';

  function scrollByCard(direction) {
    const firstCard = track.querySelector('.equipment-card');
    const firstCardWidth = firstCard ? firstCard.getBoundingClientRect().width : 220;
    const gap = 12;
    scroller.scrollBy({ left: direction * (firstCardWidth + gap), behavior });
  }

  function updateButtons() {
    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    const left = Math.max(0, Math.round(scroller.scrollLeft));
    prev.disabled = left <= 0;
    next.disabled = left >= Math.max(0, maxScroll - 2);
  }

  prev.addEventListener('click', () => scrollByCard(-1));
  next.addEventListener('click', () => scrollByCard(1));
  scroller.addEventListener('scroll', updateButtons, { passive: true });

  scroller.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      scrollByCard(-1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      scrollByCard(1);
    }
  });

  window.addEventListener('resize', updateButtons);
  updateButtons();
}

/* ── FAQ Accordion ── */
function mountFAQ() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all others
      items.forEach((other) => {
        other.classList.remove('open');
        const otherTrigger = other.querySelector('.faq-trigger');
        if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ── Burger Menu ── */
function mountBurger() {
  const burger = document.querySelector('.burger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!burger || !mobileMenu) return;

  burger.addEventListener('click', () => {
    const expanded = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!expanded));
    mobileMenu.classList.toggle('open', !expanded);
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      burger.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('open');
      burger.focus();
    }
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (
      mobileMenu.classList.contains('open') &&
      !mobileMenu.contains(e.target) &&
      !burger.contains(e.target)
    ) {
      burger.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('open');
    }
  });

  // Close on nav link click
  mobileMenu.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      burger.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('open');
    });
  });
}

/* ── Show nav CTA buttons on desktop ── */
function showNavCTA() {
  const navCta = document.querySelectorAll('.nav-cta .btn');
  navCta.forEach((btn) => {
    if (window.innerWidth >= 768) {
      btn.style.display = '';
    }
  });

  window.addEventListener('resize', () => {
    navCta.forEach((btn) => {
      btn.style.display = window.innerWidth >= 768 ? '' : 'none';
    });
  });
}

/* ── Year ── */
function setCurrentYear() {
  const year = document.getElementById('year');
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
}

/* ── Bootstrap ── */
function bootstrap() {
  document.documentElement.classList.add('js');
  setCurrentYear();
  showNavCTA();
  mountScrollAnimations();
  renderEquipmentList();
  mountEquipmentControls();
  mountFAQ();
  mountBurger();
}

bootstrap();
