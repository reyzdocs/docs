import { EQUIPMENT_ITEMS } from './equipment-list.js';

const MAX_EQUIPMENT_RENDER = 36;

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

function setCurrentYear() {
  const year = document.getElementById('year');
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
}

function mountBurger() {
  const burger = document.querySelector('.burger');
  const collapse = document.querySelector('.header-collapse');
  if (!burger || !collapse) return;

  burger.addEventListener('click', () => {
    const expanded = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!expanded));
    collapse.classList.toggle('open', !expanded);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && collapse.classList.contains('open')) {
      burger.setAttribute('aria-expanded', 'false');
      collapse.classList.remove('open');
      burger.focus();
    }
  });

  document.addEventListener('click', (e) => {
    if (
      collapse.classList.contains('open') &&
      !collapse.contains(e.target) &&
      !burger.contains(e.target)
    ) {
      burger.setAttribute('aria-expanded', 'false');
      collapse.classList.remove('open');
    }
  });
}

function bootstrap() {
  document.documentElement.classList.add('js');
  setCurrentYear();
  renderEquipmentList();
  mountEquipmentControls();
  mountBurger();
}

bootstrap();
