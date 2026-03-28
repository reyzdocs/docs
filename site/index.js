import { EQUIPMENT_ITEMS } from './equipment-list.js';
import { EQUIPMENT_UZ_NAMES } from './equipment-i18n.js';
import { getCurrentLanguage, initI18n, onLanguageChange } from './i18n.js';

const MAX_EQUIPMENT_RENDER = Number.POSITIVE_INFINITY;
const EQUIPMENT_BATCH_SIZE = 20;
const EQUIPMENT_BY_SLUG = new Map(EQUIPMENT_ITEMS.map((item) => [item.slug, item]));
const loadedModules = new Map();
const loadedStylesheets = new Set();
let equipmentRendered = false;
let equipmentLanguageListenerAttached = false;
let equipmentControlsMounted = false;
let testimonialsLoaded = false;
let chatWidgetLoaded = false;
let metaPixelLoaded = false;

const PRIZE_PROGRAM_COPY = {
  ru: {
    fabLabel: 'Розыгрыш',
    closeAria: 'Закрыть окно розыгрыша',
    kicker: 'Идёт набор категорий',
    title: 'Приз за запуск категорий',
    subtitle:
      'Первые исполнители, которые попадут в порог запуска категории, участвуют в розыгрыше приза.',
    rule1Title: 'Подключитесь к категории',
    rule1Text:
      'У каждой техники свой порог запуска. Чем раньше вы подключитесь, тем выше шанс попасть в набор участников.',
    rule2Title: 'Попадите в первые места',
    rule2Text:
      'Например, если порог категории 20, в розыгрыш попадают первые 20 подключившихся исполнителей этой техники.',
    rule3Title: 'Категория откроется автоматически',
    rule3Text:
      'После достижения порога категория становится доступной для заказов, а победитель выбирается случайным образом.',
    catalogTitle: 'Категории техники',
    catalogSubtitle: 'Все текущие категории каталога и их slug.',
    countLabel: (count) => `${count} категорий`,
    slugLabel: 'slug',
  },
  uz: {
    fabLabel: "Sovrin",
    closeAria: "Sovrin oynasini yopish",
    kicker: "Kategoriyalar bo'yicha qabul",
    title: "Kategoriya ishga tushishi uchun sovrin",
    subtitle:
      "Kategoriya chegarasiga kirgan birinchi ijrochilar sovrin o'yinida qatnashadi.",
    rule1Title: "Kategoriyaga ulanib oling",
    rule1Text:
      "Har bir texnikaning o'z ishga tushish chegarasi bor. Qanchalik erta ulansangiz, ishtirokchilar ro'yxatiga kirish imkoniyati shunchalik yuqori bo'ladi.",
    rule2Title: "Birinchi o'rinlarga kiring",
    rule2Text:
      "Masalan, kategoriya chegarasi 20 bo'lsa, aynan shu texnikaga birinchi ulangan 20 ijrochi sovrin o'yiniga kiradi.",
    rule3Title: "Kategoriya avtomatik ochiladi",
    rule3Text:
      "Chegara to'lgach kategoriya buyurtmalar uchun ochiladi, g'olib esa ishtirokchilar orasidan tasodifiy tanlanadi.",
    catalogTitle: 'Texnika kategoriyalari',
    catalogSubtitle: "Joriy katalogdagi barcha texnikalar va ularning sluglari.",
    countLabel: (count) => `${count} kategoriya`,
    slugLabel: 'slug',
  },
};

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

function onIdle(callback, timeout = 1500) {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback, { timeout });
    return;
  }
  window.setTimeout(callback, timeout);
}

function whenVisible(element, callback, rootMargin = '200px 0px') {
  if (!element) return;

  if (!('IntersectionObserver' in window)) {
    callback();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        callback();
      });
    },
    { rootMargin },
  );

  observer.observe(element);
}

function loadModuleOnce(path) {
  if (!loadedModules.has(path)) {
    loadedModules.set(path, import(path));
  }
  return loadedModules.get(path);
}

function loadStylesheetOnce(href) {
  if (loadedStylesheets.has(href)) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`link[href="${href}"]`);
    if (existing) {
      loadedStylesheets.add(href);
      resolve();
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = () => {
      loadedStylesheets.add(href);
      resolve();
    };
    link.onerror = reject;
    document.head.append(link);
  });
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
  if (equipmentRendered) return;

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
  equipmentRendered = true;

  if (!equipmentLanguageListenerAttached) {
    onLanguageChange((language) => applyEquipmentLanguage(language));
    equipmentLanguageListenerAttached = true;
  }
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
  if (equipmentControlsMounted) return;

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
  equipmentControlsMounted = true;
}

function mountDeferredImages() {
  const deferredImages = document.querySelectorAll('img[data-src]');
  if (!deferredImages.length) return;

  const loadImage = (img) => {
    if (!img || img.getAttribute('src')) return;
    const source = img.getAttribute('data-src');
    if (!source) return;
    img.src = source;
  };

  deferredImages.forEach((img) => {
    if (img.classList.contains('hero-phone-secondary') && window.innerWidth < 768) {
      return;
    }

    if (!('IntersectionObserver' in window)) {
      loadImage(img);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          loadImage(entry.target);
        });
      },
      { rootMargin: '300px 0px' },
    );

    observer.observe(img);
  });
}

function mountDeferredSections() {
  const catalogSection = document.getElementById('catalog');
  whenVisible(catalogSection, () => {
    renderEquipmentList();
    mountEquipmentControls();
  }, '500px 0px');

  const testimonialsSection = document.getElementById('testimonials');
  whenVisible(testimonialsSection, () => {
    if (testimonialsLoaded) return;
    testimonialsLoaded = true;
    loadModuleOnce('/site/testimonials.js').catch(() => {
      testimonialsLoaded = false;
    });
  }, '600px 0px');

  onIdle(() => {
    renderEquipmentList();
    mountEquipmentControls();
  }, 2200);

  onIdle(() => {
    if (testimonialsLoaded) return;
    testimonialsLoaded = true;
    loadModuleOnce('/site/testimonials.js').catch(() => {
      testimonialsLoaded = false;
    });
  }, 3200);
}

async function loadChatWidget() {
  if (chatWidgetLoaded) return;
  chatWidgetLoaded = true;

  try {
    await loadStylesheetOnce('/site/chat-widget.css');
    await loadModuleOnce('/site/chat-widget.js');
    const widget = document.getElementById('web-chat-widget');
    if (widget) widget.hidden = false;
  } catch (_) {
    chatWidgetLoaded = false;
  }
}

function mountDeferredChatWidget() {
  const triggerLoad = () => {
    window.removeEventListener('pointerdown', triggerLoad);
    window.removeEventListener('keydown', triggerLoad);
    window.removeEventListener('scroll', triggerLoad);
    void loadChatWidget();
  };

  window.addEventListener('pointerdown', triggerLoad, { passive: true, once: true });
  window.addEventListener('keydown', triggerLoad, { once: true });
  window.addEventListener('scroll', triggerLoad, { passive: true, once: true });

  onIdle(() => {
    void loadChatWidget();
  }, 4500);
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

function loadMetaPixel() {
  if (metaPixelLoaded) return;
  metaPixelLoaded = true;

  try {
    if (typeof window.fbq !== 'function') {
      const fbq = function fbqShim(...args) {
        fbq.queue.push(args);
      };
      fbq.queue = [];
      fbq.loaded = true;
      fbq.version = '2.0';
      window.fbq = fbq;
      window._fbq = fbq;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    script.onload = () => {
      try {
        window.fbq('init', '919065787391921');
        window.fbq('track', 'PageView');
      } catch (_) { /* ignore */ }
    };
    script.onerror = () => {
      metaPixelLoaded = false;
    };
    document.head.append(script);
  } catch (_) {
    metaPixelLoaded = false;
  }
}

function mountDeferredMetaPixel() {
  const triggerLoad = () => {
    window.removeEventListener('pointerdown', triggerLoad);
    window.removeEventListener('keydown', triggerLoad);
    window.removeEventListener('scroll', triggerLoad);
    loadMetaPixel();
  };

  window.addEventListener('pointerdown', triggerLoad, { passive: true, once: true });
  window.addEventListener('keydown', triggerLoad, { once: true });
  window.addEventListener('scroll', triggerLoad, { passive: true, once: true });

  onIdle(() => {
    loadMetaPixel();
  }, 3500);
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

function getPrizeProgramCopy(language = 'ru') {
  return PRIZE_PROGRAM_COPY[language] || PRIZE_PROGRAM_COPY.ru;
}

function renderPrizeCatalog(language = getCurrentLanguage()) {
  const grid = document.getElementById('prize-catalog-grid');
  if (!grid) return;

  grid.textContent = '';
  const fragment = document.createDocumentFragment();

  EQUIPMENT_ITEMS.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'prize-equipment-card';

    const media = document.createElement('div');
    media.className = 'prize-equipment-media';

    const img = document.createElement('img');
    img.src = item.image;
    img.alt = getEquipmentLabel(item, language);
    img.width = 128;
    img.height = 128;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.referrerPolicy = 'no-referrer';
    media.append(img);

    const body = document.createElement('div');
    body.className = 'prize-equipment-body';

    const name = document.createElement('div');
    name.className = 'prize-equipment-name';
    name.textContent = getEquipmentLabel(item, language);

    const slug = document.createElement('div');
    slug.className = 'prize-equipment-slug';
    slug.textContent = item.slug;

    body.append(name, slug);
    card.append(media, body);
    fragment.append(card);
  });

  grid.append(fragment);
}

function applyPrizeProgramLanguage(language = getCurrentLanguage()) {
  const copy = getPrizeProgramCopy(language);

  const setText = (id, value) => {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
  };

  setText('prize-fab-label', copy.fabLabel);
  setText('prize-modal-kicker', copy.kicker);
  setText('prize-modal-title', copy.title);
  setText('prize-modal-subtitle', copy.subtitle);
  setText('prize-rule-title-1', copy.rule1Title);
  setText('prize-rule-text-1', copy.rule1Text);
  setText('prize-rule-title-2', copy.rule2Title);
  setText('prize-rule-text-2', copy.rule2Text);
  setText('prize-rule-title-3', copy.rule3Title);
  setText('prize-rule-text-3', copy.rule3Text);
  setText('prize-catalog-title', copy.catalogTitle);
  setText('prize-catalog-subtitle', copy.catalogSubtitle);
  setText('prize-catalog-count', copy.countLabel(EQUIPMENT_ITEMS.length));

  document.querySelectorAll('[data-prize-close]').forEach((node) => {
    node.setAttribute('aria-label', copy.closeAria);
  });

  renderPrizeCatalog(language);
}

function mountPrizeProgram() {
  const fab = document.getElementById('prize-fab');
  const modal = document.getElementById('prize-modal');
  if (!fab || !modal) return;

  const openModal = () => {
    modal.hidden = false;
    fab.setAttribute('aria-expanded', 'true');
    document.documentElement.classList.add('landing-modal-open');
    document.body.classList.add('landing-modal-open');
  };

  const closeModal = () => {
    modal.hidden = true;
    fab.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('landing-modal-open');
    document.body.classList.remove('landing-modal-open');
  };

  fab.addEventListener('click', openModal);
  modal.querySelectorAll('[data-prize-close]').forEach((node) => {
    node.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) {
      closeModal();
      fab.focus();
    }
  });

  applyPrizeProgramLanguage(getCurrentLanguage());
  onLanguageChange((language) => applyPrizeProgramLanguage(language));
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
  mountDeferredImages();
  mountDeferredSections();
  mountFAQ();
  mountBurger();
  mountForCards();
  mountMetaTracking();
  mountDeferredMetaPixel();
  mountHeroEquipmentRotator();
  mountPrizeProgram();
  mountDeferredChatWidget();
}

bootstrap();
