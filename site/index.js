import { EQUIPMENT_ITEMS } from './equipment-list.js';
import { EQUIPMENT_UZ_NAMES } from './equipment-i18n.js';
import { getCurrentLanguage, initI18n, onLanguageChange } from './i18n.js';

const MAX_EQUIPMENT_RENDER = Number.POSITIVE_INFINITY;
const EQUIPMENT_BATCH_SIZE = 20;
const EQUIPMENT_BY_SLUG = new Map(EQUIPMENT_ITEMS.map((item) => [item.slug, item]));

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

function getEquipmentLabel(item, language = 'ru') {
  if (!item) return '';
  if (language === 'uz') {
    return EQUIPMENT_UZ_NAMES[item.slug] || item.name || toHumanEquipmentName(item.slug);
  }
  return item.name || toHumanEquipmentName(item.slug);
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

  const items = EQUIPMENT_ITEMS.slice(0, MAX_EQUIPMENT_RENDER);
  let rendered = 0;

  function renderChunk() {
    const fragment = document.createDocumentFragment();
    const end = Math.min(rendered + EQUIPMENT_BATCH_SIZE, items.length);

    for (let i = rendered; i < end; i += 1) {
      const item = items[i];
      const lang = getCurrentLanguage();
      const li = document.createElement('li');
      li.className = 'equipment-card';
      li.dataset.equipmentSlug = item.slug;

      const figure = document.createElement('figure');
      const img = document.createElement('img');
      img.src = item.image;
      img.alt = getEquipmentLabel(item, lang);
      img.width = 256;
      img.height = 256;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.referrerPolicy = 'no-referrer';

      const caption = document.createElement('figcaption');
      caption.textContent = getEquipmentLabel(item, lang);

      figure.append(img, caption);
      li.append(figure);
      fragment.append(li);
    }

    track.append(fragment);
    rendered = end;

    if (rendered < items.length) {
      window.requestAnimationFrame(renderChunk);
    }
  }

  renderChunk();
}

function applyEquipmentLanguage(language) {
  const cards = document.querySelectorAll('#equipment-track .equipment-card');
  cards.forEach((card) => {
    const slug = card.getAttribute('data-equipment-slug');
    if (!slug) return;
    const item = EQUIPMENT_BY_SLUG.get(slug);
    if (!item) return;

    const localized = getEquipmentLabel(item, language);
    const img = card.querySelector('img');
    const caption = card.querySelector('figcaption');

    if (img) img.alt = localized;
    if (caption) caption.textContent = localized;
  });
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

/* ── Clickable for-cards ── */
function mountForCards() {
  const cards = document.querySelectorAll('.for-card-link[data-card-href]');
  cards.forEach((card) => {
    const href = card.getAttribute('data-card-href');
    if (!href) return;

    card.setAttribute('role', 'link');
    card.setAttribute('tabindex', '0');

    card.addEventListener('click', (event) => {
      if (event.target.closest('a, button, input, textarea, select, label')) return;
      window.open(href, '_blank', 'noopener,noreferrer');
    });

    card.addEventListener('keydown', (event) => {
      if (event.target !== card) return;
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      window.open(href, '_blank', 'noopener,noreferrer');
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


function trackMetaEvent(eventName, params = {}) {
  if (typeof window.fbq !== 'function') return;
  try {
    window.fbq('trackCustom', eventName, params);
  } catch (_) { /* ignore */ }
}

window.reyzTrackMeta = trackMetaEvent;

function mountMetaTracking() {
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href*="play.google.com/store/apps/details"]');
    if (!link) return;

    const href = link.getAttribute('href') || '';
    const app = href.includes('com.reyzplus.driver') ? 'driver' : 'client';
    trackMetaEvent('PlayStoreClick', { app, href });
  });
}


function mountHeroEquipmentRotator() {
  const wordEl = document.getElementById('hero-rotator-word');
  if (!wordEl) return;

  let timer = null;
  let currentWord = '';

  const buildWords = () => {
    const lang = getCurrentLanguage();
    return EQUIPMENT_ITEMS
      .map((item) => getEquipmentLabel(item, lang))
      .filter((label) => {
        if (!label) return false;
        const normalized = String(label).trim();
        return normalized.length > 0 && !/\s/.test(normalized);
      });
  };

  let words = buildWords();
  if (!words.length) words = ['Самосвала'];

  const pickRandomWord = () => {
    words = buildWords();
    if (!words.length) return null;
    if (words.length === 1) return words[0];

    let next = currentWord;
    let attempts = 0;
    while (next === currentWord && attempts < 12) {
      next = words[Math.floor(Math.random() * words.length)];
      attempts += 1;
    }

    if (next === currentWord) {
      const pool = words.filter((word) => word !== currentWord);
      if (pool.length) {
        next = pool[Math.floor(Math.random() * pool.length)];
      }
    }

    return next;
  };

  const showWord = (next) => {
    wordEl.classList.remove('is-visible');
    window.setTimeout(() => {
      wordEl.textContent = next;
      wordEl.classList.add('is-visible');
    }, 180);
  };

  const goToCatalog = () => {
    const catalog = document.getElementById('catalog');
    if (!catalog) return;
    catalog.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  wordEl.addEventListener('click', goToCatalog);
  wordEl.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      goToCatalog();
    }
  });

  currentWord = words[Math.floor(Math.random() * words.length)];
  showWord(currentWord);

  timer = window.setInterval(() => {
    const nextWord = pickRandomWord();
    if (!nextWord) return;
    currentWord = nextWord;
    showWord(nextWord);
  }, 2000);

  onLanguageChange(() => {
    words = buildWords();
    if (!words.length) return;
    currentWord = words[Math.floor(Math.random() * words.length)];
    showWord(currentWord);
  });

  window.addEventListener('beforeunload', () => {
    if (timer) window.clearInterval(timer);
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
  initI18n();
  document.documentElement.classList.add('js');
  setCurrentYear();
  showNavCTA();
  mountScrollAnimations();
  renderEquipmentList();
  onLanguageChange((language) => applyEquipmentLanguage(language));
  mountEquipmentControls();
  mountFAQ();
  mountBurger();
  mountForCards();
  mountMetaTracking();
  mountHeroEquipmentRotator();
}

bootstrap();
