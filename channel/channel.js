const TELEGRAM_CHANNEL_URL = 'https://t.me/reyzapplus';
const GA_MEASUREMENT_ID = 'G-YNF6Q023JC';
const ATTRIBUTION_PARAM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'fbclid',
  'yclid',
];

function getLang() {
  const params = new URLSearchParams(window.location.search);
  let storedLang = '';
  try {
    storedLang = localStorage.getItem('reyz_channel_lang') || '';
  } catch (_) {
    // Ignore blocked storage.
  }
  const raw = (params.get('lang') || storedLang || 'ru').toLowerCase();
  return raw.startsWith('uz') ? 'uz' : 'ru';
}

function setLang(lang) {
  const nextLang = lang === 'uz' ? 'uz' : 'ru';
  document.documentElement.lang = nextLang;
  try {
    localStorage.setItem('reyz_channel_lang', nextLang);
  } catch (_) {
    // Ignore blocked storage.
  }

  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const value = node.getAttribute(`data-${nextLang}`);
    if (value != null) node.textContent = value;
  });

  document.querySelectorAll('[data-i18n-html]').forEach((node) => {
    const value = node.getAttribute(`data-${nextLang}`);
    if (value != null) node.innerHTML = value;
  });

  document.querySelectorAll('[data-i18n-aria]').forEach((node) => {
    const value = node.getAttribute(`data-${nextLang}`);
    if (value != null) node.setAttribute('aria-label', value);
  });

  document.querySelectorAll('.lang-btn').forEach((button) => {
    const isActive = button.dataset.lang === nextLang;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

function getAttributionParams() {
  const params = new URLSearchParams(window.location.search);
  const result = {};
  ATTRIBUTION_PARAM_KEYS.forEach((key) => {
    const value = params.get(key);
    if (value) result[key] = value;
  });
  return result;
}

function trackEvent(eventName, params = {}) {
  if (typeof window.gtag !== 'function') return;
  try {
    window.gtag('event', eventName, {
      page_path: `${window.location.pathname}${window.location.search}`,
      page_title: document.title,
      ...getAttributionParams(),
      ...params,
    });
  } catch (_) {
    // Analytics must never block navigation.
  }
}

function openTelegramChannel() {
  const segment = document.body.dataset.segment || 'unknown';
  trackEvent('telegram_channel_click', {
    segment,
    outbound_url: TELEGRAM_CHANNEL_URL,
    click_surface: 'channel_landing_cta',
  });
  window.location.href = TELEGRAM_CHANNEL_URL;
}

document.addEventListener('DOMContentLoaded', () => {
  setLang(getLang());

  document.querySelectorAll('.lang-btn').forEach((button) => {
    button.addEventListener('click', () => setLang(button.dataset.lang || 'ru'));
  });

  document.querySelectorAll('[data-open-telegram]').forEach((button) => {
    button.addEventListener('click', openTelegramChannel);
  });

  trackEvent('channel_landing_view', {
    segment: document.body.dataset.segment || 'unknown',
  });
});
