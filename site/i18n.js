const SUPPORTED_LANGS = new Set(['ru', 'uz']);
const DEFAULT_LANG = 'ru';
const STORAGE_KEY = 'reyz_landing_lang_v1';

const COPY = {
  ru: {
    locale: 'ru-RU',
    ogLocale: 'ru_RU',
    seo: {
      title: 'Reyzapp — заказы спецтехники для заказчиков и водителей',
      description:
        'Reyzapp помогает заказчикам быстро заказывать спецтехнику, а водителям в Reyz+ получать подходящие заявки и участвовать в тендере по цене.',
      ogTitle: 'Reyzapp — заказы спецтехники для заказчиков и водителей',
      ogDescription:
        'Платформа для заказа спецтехники: подбор исполнителей, тендер по цене и прозрачные статусы.',
      ogImageAlt: 'Reyzapp — сервис заказа спецтехники',
      twitterTitle: 'Reyzapp — заказы спецтехники',
      twitterDescription:
        'Удобный заказ для заказчиков и релевантные заявки для водителей в Reyz+.',
    },
    chat: {
      panelLabel: 'Чат поддержки',
      launchAria: 'Открыть чат поддержки',
      closeAria: 'Закрыть чат',
      typingAria: 'Оператор печатает',
      headerTitle: 'Reyz Support',
      headerSubtitle: 'Обычно отвечаем в течение нескольких минут',
      inputLabel: 'Ваше сообщение',
      inputPlaceholder: 'Напишите вопрос...',
      sendButton: 'Отправить',
      chip1: 'Как работает тендер?',
      chip2: 'Как добавить технику?',
      chip3: 'Это бесплатно?',
      senderYou: 'Вы',
      senderSupport: 'Поддержка',
      statusConnecting: 'Подключаем чат...',
      statusOpenFailed: 'Не удалось подключить чат. Попробуйте позже.',
      statusSendFailed: 'Сообщение не отправлено. Попробуйте еще раз.',
      statusClosedSupport: 'Чат закрыт. Напишите в support@reyz.app',
      statusClosedOperator: 'Чат закрыт оператором.',
      welcome: 'Здравствуйте! Напишите ваш вопрос. Мы ответим в Telegram-чате поддержки.',
    },
    testimonials: [
      [
        {
          text: 'Раньше на поиск техники уходило до часа. Сейчас запускаем заявку за пару минут и быстро видим ставки.',
          name: 'Нодира Саидова',
          role: 'Заказчик, стройподряд',
        },
        {
          text: 'Стало намного прозрачнее: видно кто откликнулся, какая цена и на каком этапе сейчас заказ.',
          name: 'Руслан Ташматов',
          role: 'Координатор объектов',
        },
        {
          text: 'Удобно, что всё в одном месте: заказ, выбор исполнителя, трекинг и рейтинг после завершения.',
          name: 'Ирина Пак',
          role: 'Закупщик',
        },
      ],
      [
        {
          text: 'В Reyz+ получаю релевантные заявки, а не случайные. Это сократило простой техники и повысило загрузку.',
          name: 'Шерзод Каримов',
          role: 'Водитель спецтехники',
        },
        {
          text: 'Push и Telegram-уведомления реально помогают — хорошие заказы не пропускаются.',
          name: 'Алишер Мавлонов',
          role: 'Партнер-исполнитель',
        },
        {
          text: 'Процесс понятный: цена, подтверждение, этапы выполнения. Заказчики видят, что происходит, и меньше звонят.',
          name: 'Фарход Рахимов',
          role: 'Владелец техники',
        },
      ],
      [
        {
          text: 'Для нашей компании Reyz стал рабочим стандартом: меньше ручных операций и больше контроля по срокам.',
          name: 'Дилором Абдуллаева',
          role: 'Руководитель логистики',
        },
        {
          text: 'На крупных объектах ценим прозрачность: всё фиксируется по статусам, есть история и понятная ответственность.',
          name: 'Сардор Хасанов',
          role: 'Производственный менеджер',
        },
        {
          text: 'Отдельный плюс — быстрое подключение новых водителей и техники без потери качества обслуживания заказчиков.',
          name: 'Мухаммад Комилов',
          role: 'Операционный директор',
        },
      ],
    ],
  },
  uz: {
    locale: 'uz-UZ',
    ogLocale: 'uz_UZ',
    seo: {
      title: 'Reyzapp — buyurtmachilar va haydovchilar uchun maxsus texnika buyurtmalari',
      description:
        "Reyzapp buyurtmachilarga maxsus texnikani tez buyurtma qilishga, Reyz+ dagi haydovchilarga esa mos so'rovlarga qo'shilib narx bo'yicha tenderda qatnashishga yordam beradi.",
      ogTitle: 'Reyzapp — buyurtmachilar va haydovchilar uchun maxsus texnika buyurtmalari',
      ogDescription:
        "Maxsus texnika buyurtmasi uchun platforma: ijrochilarni topish, narx tenderi va shaffof statuslar.",
      ogImageAlt: 'Reyzapp — maxsus texnika buyurtma xizmati',
      twitterTitle: 'Reyzapp — maxsus texnika buyurtmalari',
      twitterDescription:
        "Buyurtmachilar uchun qulay buyurtma va Reyz+ haydovchilari uchun mos so'rovlar.",
    },
    chat: {
      panelLabel: "Qo'llab-quvvatlash chati",
      launchAria: "Qo'llab-quvvatlash chatini ochish",
      closeAria: 'Chatni yopish',
      typingAria: 'Operator yozmoqda',
      headerTitle: 'Reyz Support',
      headerSubtitle: "Odatda bir necha daqiqa ichida javob beramiz",
      inputLabel: 'Sizning xabaringiz',
      inputPlaceholder: 'Savolingizni yozing...',
      sendButton: "Yuborish",
      chip1: 'Tender qanday ishlaydi?',
      chip2: "Texnikani qanday qo'shish mumkin?",
      chip3: 'Bu bepulmi?',
      senderYou: 'Siz',
      senderSupport: "Qo'llab-quvvatlash",
      statusConnecting: 'Chat ulanmoqda...',
      statusOpenFailed: "Chatga ulanib bo'lmadi. Keyinroq urinib ko'ring.",
      statusSendFailed: "Xabar yuborilmadi. Qayta urinib ko'ring.",
      statusClosedSupport: 'Chat yopilgan. support@reyz.app manziliga yozing',
      statusClosedOperator: 'Chat operator tomonidan yopildi.',
      welcome: "Salom! Savolingizni yozing. Telegram qo'llab-quvvatlash chatida javob beramiz.",
    },
    testimonials: [
      [
        {
          text: "Avvallari texnika qidirishga bir soatgacha vaqt ketardi. Hozir so'rovni bir necha daqiqada ochamiz va takliflarni tez ko'ramiz.",
          name: 'Nodira Saidova',
          role: 'Buyurtmachi, qurilish pudrati',
        },
        {
          text: "Jarayon ancha shaffof bo'ldi: kim javob bergani, narxi va buyurtma qaysi bosqichda ekani ko'rinadi.",
          name: 'Ruslan Tashmatov',
          role: 'Obyekt koordinatori',
        },
        {
          text: "Hammasi bitta joyda bo'lgani qulay: buyurtma, ijrochini tanlash, tracking va yakunda reyting.",
          name: 'Irina Pak',
          role: "Ta'minot mutaxassisi",
        },
      ],
      [
        {
          text: "Reyz+ da tasodifiy emas, aynan mos buyurtmalar keladi. Bu texnika bekor turishini kamaytirib, yuklamani oshirdi.",
          name: 'Sherzod Karimov',
          role: 'Maxsus texnika haydovchisi',
        },
        {
          text: "Push va Telegram bildirishnomalari juda foydali — yaxshi buyurtmalar o'tib ketmaydi.",
          name: 'Alisher Mavlonov',
          role: 'Hamkor-ijrochi',
        },
        {
          text: "Jarayon tushunarli: stavka, tasdiqlash, bajarish bosqichlari. Buyurtmachi nima bo'layotganini ko'radi va qo'ng'iroqlar kamayadi.",
          name: 'Farhod Rahimov',
          role: 'Texnika egasi',
        },
      ],
      [
        {
          text: "Biznesimiz uchun Reyz ish standarti bo'ldi: qo'lda ishlar kamroq, muddatlar bo'yicha nazorat ko'proq.",
          name: 'Dilorom Abdullayeva',
          role: 'Logistika rahbari',
        },
        {
          text: "Yirik obyektlarda shaffoflik muhim: hamma statuslar qayd etiladi, tarix saqlanadi va mas'uliyat aniq bo'ladi.",
          name: 'Sardor Xasanov',
          role: 'Ishlab chiqarish menejeri',
        },
        {
          text: "Yana bir katta plus — xizmat sifati tushmasdan yangi haydovchi va texnikani tez ulash mumkin.",
          name: 'Muhammad Komilov',
          role: 'Operatsion direktor',
        },
      ],
    ],
  },
};

const STATIC_TEXT_UZ = {
  'Перейти к основному контенту': "Asosiy kontentga o'tish",
  'Возможности': 'Imkoniyatlar',
  'Как работает': 'Qanday ishlaydi',
  'Каталог': 'Katalog',
  'Для кого': 'Kimlar uchun',
  'Заказчикам': 'Buyurtmachilar',
  'Водителям': 'Haydovchilar',
  'Грузоперевозка и спецтехника по заявке — быстро, прозрачно и без лишних звонков':
    "Buyurtma asosida yuk tashish va maxsus texnika - tez, shaffof va ortiqcha qo'ng'iroqlarsiz",
  'Reyzapp объединяет заказчиков и водителей в одном рабочем контуре: создание заявки, автоматический матчинг, тендер по цене и контроль статусов в реальном времени.':
    "Reyzapp buyurtmachi va haydovchilarni bitta ish konturida birlashtiradi: so'rov yaratish, avtomatik matching, narx tenderi va statuslarni real vaqtda nazorat qilish.",
  'Скачать Reyzapp': "Reyzapp'ni yuklab olish",
  'Reyz+ для водителей': 'Haydovchilar uchun Reyz+',
  'типов техники': 'texnika turlari',
  'онлайн-доступ': 'onlayn kirish',
  'комиссия на старте': 'startdagi komissiya',
  'прозрачность': 'shaffoflik',
  'Всё для заказа техники в одной платформе': "Texnika buyurtmasi uchun hammasi bitta platformada",
  'Мощные инструменты для заказчиков и водителей — подбор, ставки, контроль и рейтинги.':
    "Buyurtmachi va haydovchilar uchun kuchli vositalar - tanlash, narx takliflari, nazorat va reytinglar.",
  'Мгновенный матчинг': 'Tezkor matching',
  'Система автоматически находит водителей с подходящей техникой и отправляет уведомления за секунды.':
    'Tizim mos texnikaga ega haydovchilarni avtomatik topadi va soniyalarda bildirishnoma yuboradi.',
  'Прозрачный тендер': 'Shaffof tender',
  'Водители подают ставки, формируя конкурентную цену. Заказчик выбирает лучшее предложение.':
    "Haydovchilar taklif beradi va raqobat narxini shakllantiradi. Buyurtmachi eng yaxshi taklifni tanlaydi.",
  'Realtime трекинг': 'Realtime tracking',
  'Отслеживайте движение техники на карте и получайте обновления статусов в реальном времени.':
    "Texnika harakatini xaritada kuzating va status yangilanishlarini real vaqtda oling.",
  'Для всех участников': 'Barcha ishtirokchilar uchun',
  'Физлица, ИП и юрлица — платформа подходит заказчикам и владельцам техники любого формата.':
    'Jismoniy shaxs, YTT va yuridik shaxslar - platforma turli formatdagi buyurtmachi va texnika egalari uchun mos.',
  'Push и Telegram': 'Push va Telegram',
  'Водители получают уведомления о новых заказах через push, в приложении и через Telegram-бота.':
    "Haydovchilar yangi buyurtmalar haqida push, ilova va Telegram bot orqali xabarnoma oladi.",
  'Рейтинги и отзывы': 'Reyting va sharhlar',
  'Система рейтингов помогает заказчикам выбирать проверенных исполнителей, а водителям — получать больше заказов.':
    "Reyting tizimi buyurtmachiga tekshirilgan ijrochini tanlashga, haydovchiga esa ko'proq buyurtma olishga yordam beradi.",
  'Процесс': 'Jarayon',
  'Как это работает': 'Bu qanday ishlaydi',
  'От заявки до завершения заказа — три ключевых этапа':
    "So'rovdan buyurtma yakunigacha - uchta asosiy bosqich",
  'Создание заявки': "So'rov yaratish",
  '~ 2 мин': '~ 2 daqiqa',
  'Тип техники выбран': 'Texnika turi tanlandi',
  'Грузовик тентованный': 'Tentli yuk mashinasi',
  'Маршрут указан': "Yo'nalish kiritildi",
  'Точка A → Точка B': 'Nuqta A → Nuqta B',
  'Требования заполнены': 'Talablar to‘ldirildi',
  'Время, комментарий, оплата': "Vaqt, izoh, to'lov",
  'Создайте заявку': "So'rov yarating",
  'Укажите тип техники, маршрут и требования. Система автоматически найдёт подходящих исполнителей.':
    "Texnika turi, yo'nalish va talablarni kiriting. Tizim mos ijrochilarni avtomatik topadi.",
  'Тендер ставок': 'Narxlar tenderi',
  'Активный': 'Faol',
  'Предложение No1': 'Taklif No1',
  'Рейтинг: ★★★★☆': 'Reyting: ★★★★☆',
  'Тип техники • Марка техники • Гос. номер':
    'Texnika turi • Texnika markasi • Davlat raqami',
  'Грузоподъёмность • Длина кузова':
    "Yuk ko'tarish quvvati • Kuzov uzunligi",
  'Тип загрузки • Гидроборд • Расстояние от вас':
    "Yuklash turi • Gidrobort • Sizdan masofa",
  'Цена: 4 500 000 сум': "Narx: 4 500 000 so'm",
  'Предложение No2': 'Taklif No2',
  'Цена: 4 800 000 сум': "Narx: 4 800 000 so'm",
  'Предложение No3': 'Taklif No3',
  'Рейтинг: ★★★★★': 'Reyting: ★★★★★',
  'Цена: 4 000 000 сум': "Narx: 4 000 000 so'm",
  'Тендер по цене': "Narx bo'yicha tender",
  'Водители подают ставки с ценой и временем прибытия. Выбирайте лучший вариант по условиям.':
    "Haydovchilar narx va yetib kelish vaqti bilan taklif beradi. Shartlarga ko'ra eng yaxshi variantni tanlang.",
  'Контроль': 'Nazorat',
  'В процессе': 'Jarayonda',
  'Назначен водитель': 'Haydovchi tayinlandi',
  'Завершено': 'Yakunlandi',
  'Водитель в пути': "Haydovchi yo'lda",
  'Работа выполняется': 'Ish bajarilmoqda',
  'Трекинг на карте': 'Xaritada tracking',
  'Включён': 'Yoqilgan',
  'Контроль в реальном времени': 'Real vaqtda nazorat',
  'Отслеживайте каждый этап заказа на карте: от выезда водителя до завершения работы и рейтинга.':
    "Buyurtmaning har bir bosqichini xaritada kuzating: haydovchi yo'lga chiqqanidan ish yakuni va reytinggacha.",
  'Приложение для заказчиков, партнёров и бизнеса':
    "Buyurtmachi, hamkor va biznes uchun ilova",
  'Заказчики': 'Buyurtmachilar',
  'Создайте заявку за минуту, получите ставки от водителей и отслеживайте заказ на карте.':
    "Bir daqiqada so'rov yarating, haydovchilardan takliflar oling va buyurtmani xaritada kuzating.",
  'Водители': 'Haydovchilar',
  'Получайте релевантные заказы, подавайте ставки и управляйте этапами выполнения прямо в приложении.':
    "Mos buyurtmalarni oling, narx bering va bajarish bosqichlarini ilovaning o'zida boshqaring.",
  'Бизнес': 'Biznes',
  'Прозрачные ставки, контроль исполнения и рейтинги — всё для эффективного управления заказами.':
    "Shaffof narxlar, bajarilishni nazorat qilish va reytinglar - buyurtmalarni samarali boshqarish uchun hammasi.",
  '55+ типов техники в одном каталоге': 'Bitta katalogda 55+ turdagi texnika',
  'Листайте примеры категорий. Полный список доступен в приложении.':
    "Kategoriya namunalari bilan tanishing. To'liq ro'yxat ilovada mavjud.",
  'Матчинг учитывает тип и параметры техники, чтобы заявки получали релевантные водители.':
    "Matching texnika turi va parametrlarini hisobga oladi, shuning uchun so'rovlar mos haydovchilarga boradi.",
  'Для интерактивной галереи техники включите JavaScript в браузере.':
    "Interaktiv texnika galereyasi uchun brauzeringizda JavaScript'ni yoqing.",
  'Два приложения — одна платформа': 'Ikki ilova - bitta platforma',
  'Reyzapp для заказчиков и Reyz+ для водителей работают вместе, обеспечивая быстрый и прозрачный процесс.':
    "Buyurtmachilar uchun Reyzapp va haydovchilar uchun Reyz+ birgalikda ishlab, tez va shaffof jarayonni ta'minlaydi.",
  'Заказчикам — Reyzapp': 'Buyurtmachilar uchun - Reyzapp',
  'Создайте заявку за минуты, получите предложения от водителей и выберите лучшее по цене и условиям. Отслеживайте статусы и оставляйте рейтинги.':
    "Bir necha daqiqada so'rov yarating, haydovchilardan taklif oling va narx hamda shartlar bo'yicha eng yaxshisini tanlang. Statuslarni kuzating va reyting qoldiring.",
  'Водителям — Reyz+': 'Haydovchilar uchun - Reyz+',
  'Получайте подходящие заказы автоматически, подавайте ставки, ведите заказ по этапам. Push, Telegram и WS уведомления не дадут пропустить заявку.':
    "Mos buyurtmalarni avtomatik oling, taklif bering va buyurtmani bosqichma-bosqich yuriting. Push, Telegram va WS xabarnomalari so'rovni o'tkazib yubormaslikka yordam beradi.",
  'Скачать Reyz+': "Reyz+'ni yuklab olish",
  'Отзывы': 'Sharhlar',
  'Что говорят заказчики и партнёры': 'Buyurtmachi va hamkorlar nima deydi',
  'Реальные впечатления от работы с платформой Reyzapp и Reyz+.':
    'Reyzapp va Reyz+ platformasi bilan ishlash bo‘yicha haqiqiy fikrlar.',
  'Частые вопросы': "Ko'p so'raladigan savollar",
  'Всё, что нужно знать о платформе Reyzapp.':
    'Reyzapp platformasi haqida bilishingiz kerak bo‘lgan hamma narsa.',
  'Сколько стоит использование платформы?':
    'Platformadan foydalanish narxi qancha?',
  'На период запуска комиссия платформы составляет 0%, абонентской платы нет. Расчёты за услуги идут напрямую между заказчиком и исполнителем.':
    "Ishga tushirish davrida platforma komissiyasi 0%, abonent to'lovi yo'q. Xizmat bo'yicha hisob-kitob buyurtmachi va ijrochi o'rtasida to'g'ridan-to'g'ri amalga oshiriladi.",
  'Нужно ли звонить каждому водителю вручную?':
    "Har bir haydovchiga qo'lda qo'ng'iroq qilish kerakmi?",
  'Нет. Система делает автоматический матчинг по типу и параметрам техники и уведомляет релевантных водителей сама — через push, inbox и Telegram.':
    "Yo'q. Tizim texnika turi va parametrlari bo'yicha avtomatik matching qiladi va mos haydovchilarni push, inbox va Telegram orqali o'zi xabardor qiladi.",
  'Как происходит авторизация?': 'Avtorizatsiya qanday ishlaydi?',
  'Авторизация происходит через Telegram OAuth — быстро, безопасно и без лишних паролей. Просто откройте приложение и войдите через Telegram.':
    "Avtorizatsiya Telegram OAuth orqali o'tadi - tez, xavfsiz va ortiqcha parollarsiz. Ilovani oching va Telegram orqali kiring.",
  'Можно ли отключить Telegram-уведомления?':
    'Telegram bildirishnomalarini o‘chirsa bo‘ladimi?',
  'Да. Водитель может выключить Telegram-уведомления о новых заказах в настройках приложения Reyz+.':
    "Ha. Haydovchi Reyz+ ilovasi sozlamalarida yangi buyurtmalar bo'yicha Telegram bildirishnomalarini o'chirishi mumkin.",
  'Кто может стать партнёром (водителем)?':
    'Kim hamkor (haydovchi) bo‘la oladi?',
  'Физические лица, ИП и юридические лица — владельцы спецтехники. Партнёр является независимым исполнителем, не сотрудником платформы.':
    "Jismoniy shaxslar, YTT va yuridik shaxslar - maxsus texnika egalari. Hamkor platforma xodimi emas, mustaqil ijrochi hisoblanadi.",
  'Где посмотреть юридические документы?': "Yuridik hujjatlarni qayerdan ko'rish mumkin?",
  'Ссылки на политику конфиденциальности и условия использования находятся внизу этой страницы в разделе «Правовая информация».':
    "Maxfiylik siyosati va foydalanish shartlari havolalari ushbu sahifaning pastida, «Huquqiy ma'lumot» bo'limida joylashgan.",
  'Готовы начать?': 'Boshlashga tayyormisiz?',
  'Скачайте приложение и подключитесь к платформе Reyzapp уже сегодня.':
    "Ilovani yuklab oling va bugunoq Reyzapp platformasiga qo'shiling.",
  'Цифровая платформа для заказа спецтехники. Матчинг, тендер по цене и realtime-контроль.':
    "Maxsus texnika buyurtmasi uchun raqamli platforma. Matching, narx tenderi va realtime nazorat.",
  'Приложения': 'Ilovalar',
  'Reyzapp для заказчиков': 'Buyurtmachilar uchun Reyzapp',
  'Разделы': "Bo'limlar",
  'Правовая информация': "Huquqiy ma'lumot",
  'Политика конфиденциальности': 'Maxfiylik siyosati',
  'Условия использования': 'Foydalanish shartlari',
  'Обычно отвечаем в течение нескольких минут':
    'Odatda bir necha daqiqa ichida javob beramiz',
  'Как работает тендер?': 'Tender qanday ishlaydi?',
  'Как добавить технику?': "Texnikani qanday qo'shish mumkin?",
  'Это бесплатно?': 'Bu bepulmi?',
  'Ваше сообщение': 'Sizning xabaringiz',
  'Напишите вопрос...': 'Savolingizni yozing...',
  'Отправить': 'Yuborish',
  'Все права защищены.': 'Barcha huquqlar himoyalangan.',
  'Reyz.app. Все права защищены.': 'Reyz.app. Barcha huquqlar himoyalangan.',
};

const STATIC_TEXT = {
  ru: Object.fromEntries(Object.keys(STATIC_TEXT_UZ).map((key) => [key, key])),
  uz: STATIC_TEXT_UZ,
};

const ATTRIBUTE_BINDINGS = [
  { selector: '.nav-brand', attr: 'aria-label', ru: 'На главную Reyzapp', uz: 'Reyzapp bosh sahifasiga' },
  { selector: '.burger', attr: 'aria-label', ru: 'Открыть меню', uz: 'Menyuni ochish' },
  { selector: '.hero-phone:nth-child(1)', attr: 'alt', ru: 'Интерфейс Reyzapp с картой', uz: "Reyzapp interfeysi va xarita" },
  { selector: '.hero-phone:nth-child(2)', attr: 'alt', ru: 'Отслеживание техники на карте', uz: 'Texnikani xaritada kuzatish' },
  { selector: '.showcase-card:nth-child(1) img', attr: 'alt', ru: 'Удобный интерфейс Reyzapp с картой и каталогом техники', uz: 'Reyzapp qulay interfeysi: xarita va texnika katalogi' },
  { selector: '.showcase-card:nth-child(2) img', attr: 'alt', ru: 'Каталог из 55 категорий техники для стройки и логистики', uz: "Qurilish va logistika uchun 55 toifadagi texnika katalogi" },
  { selector: '.showcase-card:nth-child(3) img', attr: 'alt', ru: 'Отслеживание движения техники на карте в реальном времени', uz: 'Texnika harakatini xaritada real vaqtda kuzatish' },
  { selector: '.equipment-toolbar', attr: 'aria-label', ru: 'Управление списком техники', uz: "Texnika ro'yxatini boshqarish" },
  { selector: '#equipment-prev', attr: 'aria-label', ru: 'Прокрутить список влево', uz: "Ro'yxatni chapga surish" },
  { selector: '#equipment-next', attr: 'aria-label', ru: 'Прокрутить список вправо', uz: "Ro'yxatni o'ngga surish" },
  { selector: '#equipment-scroller', attr: 'aria-label', ru: 'Галерея техники', uz: 'Texnika galereyasi' },
  { selector: '#web-chat-launch', attr: 'aria-label', chatKey: 'launchAria' },
  { selector: '#web-chat-panel', attr: 'aria-label', chatKey: 'panelLabel' },
  { selector: '#web-chat-close', attr: 'aria-label', chatKey: 'closeAria' },
  { selector: '#web-chat-typing', attr: 'aria-label', chatKey: 'typingAria' },
  { selector: '#web-chat-input', attr: 'placeholder', chatKey: 'inputPlaceholder' },
  { selector: '[data-lang-switch]', attr: 'aria-label', ru: 'Выбор языка', uz: 'Til tanlash' },
];

const textBindings = [];
const listeners = new Set();
let currentLanguage = DEFAULT_LANG;
let initialized = false;

function readStoredLang() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (_) {
    return null;
  }
}

function writeStoredLang(value) {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch (_) {
    // ignore storage errors
  }
}

function normalizeText(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim();
}

function deepGet(obj, path) {
  return path.split('.').reduce((acc, part) => (acc && acc[part] != null ? acc[part] : null), obj);
}

function parseLang(value) {
  if (!value) return null;
  const lowered = String(value).trim().toLowerCase();
  if (lowered === 'ru' || lowered.startsWith('ru-')) return 'ru';
  if (lowered === 'uz' || lowered.startsWith('uz-')) return 'uz';
  return null;
}

function detectLanguage() {
  const url = new URL(window.location.href);
  const fromQuery = parseLang(url.searchParams.get('lang'));
  if (fromQuery) return fromQuery;

  const fromStorage = parseLang(readStoredLang());
  if (fromStorage) return fromStorage;

  const fromBrowser = parseLang(navigator.language || (navigator.languages && navigator.languages[0]));
  if (fromBrowser === 'uz') return 'uz';

  return DEFAULT_LANG;
}

function collectTextBindings() {
  textBindings.length = 0;
  const blockedTags = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG']);
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);

  while (walker.nextNode()) {
    const node = walker.currentNode;
    const parent = node.parentElement;
    if (!parent) continue;
    if (blockedTags.has(parent.tagName)) continue;
    if (parent.closest('[data-no-i18n]')) continue;

    const raw = String(node.nodeValue || '');
    const normalized = normalizeText(raw);
    if (!normalized) continue;
    if (!STATIC_TEXT.ru[normalized]) continue;

    const leading = raw.match(/^\s*/)?.[0] ?? '';
    const trailing = raw.match(/\s*$/)?.[0] ?? '';
    textBindings.push({ node, source: normalized, leading, trailing });
  }
}

function applyStaticText(language) {
  for (const binding of textBindings) {
    const nextValue =
      STATIC_TEXT[language]?.[binding.source] ??
      STATIC_TEXT.ru[binding.source] ??
      binding.source;
    binding.node.nodeValue = `${binding.leading}${nextValue}${binding.trailing}`;
  }
}

function applyAttributeTranslations(language) {
  for (const binding of ATTRIBUTE_BINDINGS) {
    const value = binding.chatKey
      ? deepGet(COPY[language], `chat.${binding.chatKey}`) || deepGet(COPY.ru, `chat.${binding.chatKey}`)
      : binding[language] || binding.ru;

    if (!value) continue;
    document.querySelectorAll(binding.selector).forEach((node) => {
      node.setAttribute(binding.attr, value);
    });
  }
}

function buildCanonicalForLanguage(language) {
  const url = new URL(window.location.origin + window.location.pathname);
  url.searchParams.set('lang', language);
  return url.toString();
}

function syncUrlLanguage(language) {
  const url = new URL(window.location.href);
  if (url.searchParams.get('lang') === language) return;
  url.searchParams.set('lang', language);
  const next = `${url.pathname}${url.search}${url.hash}`;
  window.history.replaceState({}, '', next);
}

function applySeo(language) {
  const seo = COPY[language]?.seo || COPY.ru.seo;
  const canonical = buildCanonicalForLanguage(language);
  const canonicalRu = buildCanonicalForLanguage('ru');
  const canonicalUz = buildCanonicalForLanguage('uz');

  document.documentElement.lang = language;
  document.title = seo.title;

  const description = document.getElementById('meta-description');
  if (description) description.setAttribute('content', seo.description);

  const ogLocale = document.getElementById('og-locale');
  if (ogLocale) ogLocale.setAttribute('content', COPY[language]?.ogLocale || COPY.ru.ogLocale);

  const ogTitle = document.getElementById('og-title');
  if (ogTitle) ogTitle.setAttribute('content', seo.ogTitle);

  const ogDescription = document.getElementById('og-description');
  if (ogDescription) ogDescription.setAttribute('content', seo.ogDescription);

  const ogUrl = document.getElementById('og-url');
  if (ogUrl) ogUrl.setAttribute('content', canonical);

  const ogImageAlt = document.getElementById('og-image-alt');
  if (ogImageAlt) ogImageAlt.setAttribute('content', seo.ogImageAlt);

  const twitterTitle = document.getElementById('twitter-title');
  if (twitterTitle) twitterTitle.setAttribute('content', seo.twitterTitle);

  const twitterDescription = document.getElementById('twitter-description');
  if (twitterDescription) twitterDescription.setAttribute('content', seo.twitterDescription);

  const canonicalLink = document.getElementById('canonical-link');
  if (canonicalLink) canonicalLink.setAttribute('href', canonical);

  const altRu = document.getElementById('alt-ru');
  if (altRu) altRu.setAttribute('href', canonicalRu);

  const altUz = document.getElementById('alt-uz');
  if (altUz) altUz.setAttribute('href', canonicalUz);

  const altDefault = document.getElementById('alt-x-default');
  if (altDefault) altDefault.setAttribute('href', canonicalRu);

  const schemaNode = document.getElementById('schema-ld');
  if (schemaNode) {
    try {
      const json = JSON.parse(schemaNode.textContent || '{}');
      if (Array.isArray(json['@graph'])) {
        json['@graph'] = json['@graph'].map((entry) => {
          if (entry && entry['@type'] === 'WebSite') {
            return { ...entry, inLanguage: language };
          }
          return entry;
        });
      }
      schemaNode.textContent = JSON.stringify(json, null, 2);
    } catch (_) {
      // ignore malformed schema
    }
  }
}

function applyLanguageSwitcherState(language) {
  document.querySelectorAll('[data-lang-switch] .lang-btn').forEach((button) => {
    const isActive = button.dataset.lang === language;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

function applyLegalLinks(language) {
  const legalLang = language === 'uz' ? 'uz' : 'ru';
  const refs = [
    ['.legal-group:nth-of-type(1) .legal-links a:nth-of-type(1)', `/client_app/${legalLang}/privacy.html`],
    ['.legal-group:nth-of-type(1) .legal-links a:nth-of-type(2)', `/driver_app/${legalLang}/privacy.html`],
    ['.legal-group:nth-of-type(2) .legal-links a:nth-of-type(1)', `/client_app/${legalLang}/terms.html`],
    ['.legal-group:nth-of-type(2) .legal-links a:nth-of-type(2)', `/driver_app/${legalLang}/terms.html`],
  ];

  refs.forEach(([selector, href]) => {
    const node = document.querySelector(selector);
    if (node) {
      node.setAttribute('href', href);
    }
  });
}

function notify() {
  listeners.forEach((listener) => {
    try {
      listener(currentLanguage);
    } catch (_) {
      // ignore listener failures
    }
  });
}

function applyLanguage(language) {
  currentLanguage = language;
  applyStaticText(language);
  applyAttributeTranslations(language);
  applySeo(language);
  applyLegalLinks(language);
  applyLanguageSwitcherState(language);
  notify();
}

function bindSwitcherEvents() {
  document.querySelectorAll('[data-lang-switch] .lang-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const lang = parseLang(button.dataset.lang);
      if (!lang || lang === currentLanguage) return;
      setLanguage(lang);
    });
  });
}

export function setLanguage(language) {
  const next = SUPPORTED_LANGS.has(language) ? language : DEFAULT_LANG;
  writeStoredLang(next);
  syncUrlLanguage(next);
  applyLanguage(next);
}

export function getCurrentLanguage() {
  if (!initialized) initI18n();
  return currentLanguage;
}

export function t(path) {
  if (!initialized) initI18n();
  return deepGet(COPY[currentLanguage], path) ?? deepGet(COPY.ru, path);
}

export function onLanguageChange(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function initI18n() {
  if (initialized) return;
  initialized = true;
  collectTextBindings();
  bindSwitcherEvents();
  const lang = detectLanguage();
  writeStoredLang(lang);
  syncUrlLanguage(lang);
  applyLanguage(lang);
}
