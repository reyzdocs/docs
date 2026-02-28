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
      { text: 'Раньше на поиск техники уходило до часа. Сейчас запускаем заявку за пару минут и быстро получаем цены от исполнителей.', name: 'Нодира Саидова', role: 'Заказчик, стройподряд' },
      { text: 'Стало намного прозрачнее: видно кто откликнулся, какая цена и на каком этапе сейчас заказ.', name: 'Руслан Ташматов', role: 'Координатор объектов' },
      { text: 'Удобно, что всё в одном месте: заказ, выбор исполнителя, трекинг и рейтинг после завершения.', name: 'Ирина Пак', role: 'Закупщик' },
    ],
    [
      { text: 'В Reyz+ получаю нормальные, подходящие заявки — не случайные. Техника меньше простаивает, работы стало больше.', name: 'Шерзод Каримов', role: 'Водитель спецтехники' },
      { text: 'Telegram-уведомления реально выручают — хорошие заказы не пропускаю.', name: 'Алишер Мавлонов', role: 'Партнер-исполнитель' },
      { text: 'Всё понятно: цена, подтверждение, дальше этапы работы. Заказчики видят процесс и меньше звонят.', name: 'Фарход Рахимов', role: 'Владелец техники' },
    ],
    [
      { text: 'Для нашей компании Reyz стал рабочим стандартом: меньше ручных операций и больше контроля по срокам.', name: 'Дилором Абдуллаева', role: 'Руководитель логистики' },
      { text: 'На крупных объектах важна прозрачность: все этапы фиксируются, сохраняется история и понятна ответственность.', name: 'Сардор Хасанов', role: 'Производственный менеджер' },
      { text: 'Отдельный плюс — можно быстро подключать новых водителей и технику без потери качества для заказчиков.', name: 'Мухаммад Комилов', role: 'Операционный директор' },
    ],
  ],
  uz: [
    [
      { text: "Avvallari texnika qidirishga bir soatgacha vaqt ketardi. Hozir buyurtma ochish uchun bir necha daqiqa yetadi va narxlarni tez ko'ramiz.", name: 'Nodira Saidova', role: 'Buyurtmachi, qurilish pudrati' },
      { text: "Jarayon ancha shaffof bo'ldi: kim javob bergani, narxi va buyurtma qaysi bosqichda ekani ko'rinadi.", name: 'Ruslan Tashmatov', role: 'Obyekt koordinatori' },
      { text: "Hammasi bitta joyda bo'lgani qulay: buyurtma, ijrochini tanlash, tracking va yakunda reyting.", name: 'Irina Pak', role: "Ta'minot mutaxassisi" },
    ],
    [
      { text: "Reyz+ da faqat mos buyurtmalar keladi, bekorga vaqt ketmaydi. Texnika kamroq bekor turadi, ish ko‘paydi.", name: 'Sherzod Karimov', role: 'Maxsus texnika haydovchisi' },
      { text: "Telegram darrov xabar beradi — yaxshi buyurtma qo‘ldan ketmaydi.", name: 'Alisher Mavlonov', role: 'Hamkor-ijrochi' },
      { text: "Hammasi aniq: narx, tasdiqlash, bajarish. Buyurtmachi hammasini ko‘rib turadi, keraksiz qo‘ng‘iroqlar kamaydi.", name: 'Farhod Rahimov', role: 'Texnika egasi' },
    ],
    [
      { text: "Biznesimiz uchun Reyz ish standartiga aylandi: qo'lda ishlar kamroq, muddatlar bo'yicha nazorat kuchliroq.", name: 'Dilorom Abdullayeva', role: 'Logistika rahbari' },
      { text: "Yirik obyektlarda shaffoflik muhim: hamma bosqichlar qayd etiladi, tarix saqlanadi va mas'uliyat aniq bo'ladi.", name: 'Sardor Xasanov', role: 'Ishlab chiqarish menejeri' },
      { text: "Alohida ustunlik — yangi haydovchilar va texnikani tez ulash mumkin, buyurtmachilar uchun xizmat sifati pasaymaydi.", name: 'Muhammad Komilov', role: 'Operatsion direktor' },
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
    col.classList.add('visible');

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
