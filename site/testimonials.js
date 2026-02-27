import { initI18n, onLanguageChange, getCurrentLanguage } from './i18n.js';

const COLUMN_CLASSES = [
  'testimonials-column animate-on-scroll',
  'testimonials-column testimonials-column-md animate-on-scroll animate-delay-1',
  'testimonials-column testimonials-column-lg animate-on-scroll animate-delay-2',
];

const DURATIONS = ['16s', '19s', '17s'];

const TESTIMONIALS = {
  ru: [
    [
      { text: 'Раньше на поиск техники уходило до часа. Сейчас запускаем заявку за пару минут и быстро видим ставки.', name: 'Нодира Саидова', role: 'Заказчик, стройподряд' },
      { text: 'Стало намного прозрачнее: видно кто откликнулся, какая цена и на каком этапе сейчас заказ.', name: 'Руслан Ташматов', role: 'Координатор объектов' },
      { text: 'Удобно, что всё в одном месте: заказ, выбор исполнителя, трекинг и рейтинг после завершения.', name: 'Ирина Пак', role: 'Закупщик' },
    ],
    [
      { text: 'В Reyz+ получаю релевантные заявки, а не случайные. Это сократило простой техники и повысило загрузку.', name: 'Шерзод Каримов', role: 'Водитель спецтехники' },
      { text: 'Push и Telegram-уведомления реально помогают — хорошие заказы не пропускаются.', name: 'Алишер Мавлонов', role: 'Партнер-исполнитель' },
      { text: 'Процесс понятный: ставка, подтверждение, этапы выполнения. Заказчики видят, что происходит, и меньше звонят.', name: 'Фарход Рахимов', role: 'Владелец техники' },
    ],
    [
      { text: 'Для нашей компании Reyz стал рабочим стандартом: меньше ручных операций и больше контроля по срокам.', name: 'Дилором Абдуллаева', role: 'Руководитель логистики' },
      { text: 'На крупных объектах ценим прозрачность: всё фиксируется по статусам, есть история и понятная ответственность.', name: 'Сардор Хасанов', role: 'Производственный менеджер' },
      { text: 'Отдельный плюс — быстрое подключение новых водителей и техники без потери качества обслуживания заказчиков.', name: 'Мухаммад Комилов', role: 'Операционный директор' },
    ],
  ],
  uz: [
    [
      { text: "Avvallari texnika qidirishga bir soatgacha vaqt ketardi. Hozir so'rovni bir necha daqiqada ochamiz va takliflarni tez ko'ramiz.", name: 'Nodira Saidova', role: 'Buyurtmachi, qurilish pudrati' },
      { text: "Jarayon ancha shaffof bo'ldi: kim javob bergani, narxi va buyurtma qaysi bosqichda ekani ko'rinadi.", name: 'Ruslan Tashmatov', role: 'Obyekt koordinatori' },
      { text: "Hammasi bitta joyda bo'lgani qulay: buyurtma, ijrochini tanlash, tracking va yakunda reyting.", name: 'Irina Pak', role: "Ta'minot mutaxassisi" },
    ],
    [
      { text: "Reyz+ da tasodifiy emas, aynan mos buyurtmalar keladi. Bu texnika bekor turishini kamaytirib, yuklamani oshirdi.", name: 'Sherzod Karimov', role: 'Maxsus texnika haydovchisi' },
      { text: "Push va Telegram bildirishnomalari juda foydali — yaxshi buyurtmalar o'tib ketmaydi.", name: 'Alisher Mavlonov', role: 'Hamkor-ijrochi' },
      { text: "Jarayon tushunarli: stavka, tasdiqlash, bajarish bosqichlari. Buyurtmachi nima bo'layotganini ko'radi va qo'ng'iroqlar kamayadi.", name: 'Farhod Rahimov', role: 'Texnika egasi' },
    ],
    [
      { text: "Biznesimiz uchun Reyz ish standarti bo'ldi: qo'lda ishlar kamroq, muddatlar bo'yicha nazorat ko'proq.", name: 'Dilorom Abdullayeva', role: 'Logistika rahbari' },
      { text: "Yirik obyektlarda shaffoflik muhim: hamma statuslar qayd etiladi, tarix saqlanadi va mas'uliyat aniq bo'ladi.", name: 'Sardor Xasanov', role: 'Ishlab chiqarish menejeri' },
      { text: "Yana bir katta plus — xizmat sifati tushmasdan yangi haydovchi va texnikani tez ulash mumkin.", name: 'Muhammad Komilov', role: 'Operatsion direktor' },
    ],
  ],
};

function initials(name) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2);
}

function renderTestimonials() {
  const container = document.getElementById('testimonials-columns');
  if (!container) return;
  container.innerHTML = '';

  const lang = getCurrentLanguage();
  const testimonials = TESTIMONIALS[lang] || TESTIMONIALS.ru;

  testimonials.forEach((column, colIdx) => {
    const col = document.createElement('div');
    col.className = COLUMN_CLASSES[colIdx] || COLUMN_CLASSES[0];

    const track = document.createElement('div');
    track.className = 'testimonials-track';
    track.style.setProperty('--duration', DURATIONS[colIdx] || '17s');

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
