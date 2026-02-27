const TESTIMONIALS = [
  // Column 1 — Заказчики
  [
    { text: 'Раньше на поиск техники уходило до часа. Сейчас запускаем заявку за пару минут и быстро видим ставки.', name: 'Нодира Саидова', role: 'Заказчик, стройподряд' },
    { text: 'Стало намного прозрачнее: видно кто откликнулся, какая цена и на каком этапе сейчас заказ.', name: 'Руслан Ташматов', role: 'Координатор объектов' },
    { text: 'Удобно, что всё в одном месте: заказ, выбор исполнителя, трекинг и рейтинг после завершения.', name: 'Ирина Пак', role: 'Закупщик' },
  ],
  // Column 2 — Исполнители
  [
    { text: 'В Reyz+ получаю релевантные заявки, а не случайные. Это сократило простой техники и повысило загрузку.', name: 'Шерзод Каримов', role: 'Водитель спецтехники' },
    { text: 'Push и Telegram-уведомления реально помогают — хорошие заказы не пропускаются.', name: 'Алишер Мавлонов', role: 'Партнер-исполнитель' },
    { text: 'Процесс понятный: ставка, подтверждение, этапы выполнения. Клиенты видят, что происходит, и меньше звонят.', name: 'Фарход Рахимов', role: 'Владелец техники' },
  ],
  // Column 3 — Бизнес
  [
    { text: 'Для нашей компании Reyz стал рабочим стандартом: меньше ручных операций и больше контроля по срокам.', name: 'Дилором Абдуллаева', role: 'Руководитель логистики' },
    { text: 'На крупных объектах ценим прозрачность: всё фиксируется по статусам, есть история и понятная ответственность.', name: 'Сардор Хасанов', role: 'Производственный менеджер' },
    { text: 'Отдельный плюс — быстрое подключение новых водителей и техники без потери качества обслуживания клиентов.', name: 'Мухаммад Комилов', role: 'Операционный директор' },
  ],
];

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

  TESTIMONIALS.forEach((column, colIdx) => {
    const col = document.createElement('div');
    col.className = COLUMN_CLASSES[colIdx] || COLUMN_CLASSES[0];

    const track = document.createElement('div');
    track.className = 'testimonials-track';
    track.style.setProperty('--duration', DURATIONS[colIdx] || '17s');

    // Duplicate cards for infinite scroll effect
    const cards = [...column, ...column];

    cards.forEach((t) => {
      const article = document.createElement('article');
      article.className = 'testimonial-card';

      const p = document.createElement('p');
      p.textContent = t.text;

      const author = document.createElement('div');
      author.className = 'testimonial-author';

      const avatar = document.createElement('div');
      avatar.className = 'testimonial-avatar';
      avatar.textContent = initials(t.name);

      const info = document.createElement('div');
      info.innerHTML = `<strong>${t.name}</strong><span>${t.role}</span>`;

      author.append(avatar, info);
      article.append(p, author);
      track.append(article);
    });

    col.append(track);
    container.append(col);
  });
}

renderTestimonials();
