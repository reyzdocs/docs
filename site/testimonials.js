import { initI18n, onLanguageChange, t } from './i18n.js';

const COLUMN_CLASSES = [
  'testimonials-column animate-on-scroll',
  'testimonials-column testimonials-column-md animate-on-scroll animate-delay-1',
  'testimonials-column testimonials-column-lg animate-on-scroll animate-delay-2',
];

const DURATIONS = ['16s', '19s', '17s'];

function initials(name) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2);
}

function renderTestimonials() {
  const container = document.getElementById('testimonials-columns');
  if (!container) return;
  container.innerHTML = '';

  const testimonials = t('testimonials') || [];
  testimonials.forEach((column, colIdx) => {
    const col = document.createElement('div');
    col.className = COLUMN_CLASSES[colIdx] || COLUMN_CLASSES[0];

    const track = document.createElement('div');
    track.className = 'testimonials-track';
    track.style.setProperty('--duration', DURATIONS[colIdx] || '17s');

    // Duplicate cards for infinite scroll effect
    const cards = [...column, ...column];

    cards.forEach((testimonial) => {
      const article = document.createElement('article');
      article.className = 'testimonial-card';

      const p = document.createElement('p');
      p.textContent = testimonial.text;

      const author = document.createElement('div');
      author.className = 'testimonial-author';

      const avatar = document.createElement('div');
      avatar.className = 'testimonial-avatar';
      avatar.textContent = initials(testimonial.name);

      const info = document.createElement('div');
      info.innerHTML = `<strong>${testimonial.name}</strong><span>${testimonial.role}</span>`;

      author.append(avatar, info);
      article.append(p, author);
      track.append(article);
    });

    col.append(track);
    container.append(col);
  });
}

initI18n();
renderTestimonials();
onLanguageChange(renderTestimonials);
