
import { Listing, Category, User, Banner } from './types';

export const PROVINCES_WITH_CITIES: Record<string, string[]> = {
  'تهران': ['تهران', 'اسلام‌شهر', 'شهریار', 'قدس', 'ملارد', 'گلستان', 'ری'],
  'خراسان رضوی': ['مشهد', 'نیشابور', 'سبزوار', 'تربت حیدریه', 'کاشمر', 'قوچان'],
  'اصفهان': ['اصفهان', 'کاشان', 'خمینی‌شهر', 'نجف‌آباد', 'لنجان', 'فلاورجان'],
  'فارس': ['شیراز', 'مرودشت', 'جهرم', 'فسا', 'کازرون', 'داراب'],
  'آذربایجان شرقی': ['تبریز', 'مراغه', 'مرند', 'میانه', 'اهر', 'بناب'],
  'مازندران': ['ساری', 'بابل', 'آمل', 'قائم‌شهر', 'بهشهر', 'چالوس'],
  'خوزستان': ['اهواز', 'دزفول', 'آبادان', 'خرمشهر', 'اندیمشک', 'ایذه'],
  'آذربایجان غربی': ['ارومیه', 'خوی', 'بوکان', 'مهاباد', 'میاندوآب', 'سلماس'],
  'البرز': ['کرج', 'نظرآباد', 'ساوجبلاغ', 'فردیس', 'اشتهارد'],
  'گیلان': ['رشت', 'بندر انزلی', 'لاهیجان', 'لنگرود', 'هشتپر', 'آستارا'],
  'کرمان': ['کرمان', 'سیرجان', 'رفسنجان', 'جیرفت', 'بم', 'زرند'],
  'سیستان و بلوچستان': ['زاهدان', 'زابل', 'ایرانشهر', 'چابهار', 'سراوان'],
  'قزوین': ['قزوین', 'تاکستان', 'الوند', 'اقبالیه', 'آبیک'],
  'یزد': ['یزد', 'میبد', 'اردکان', 'بافق', 'مهریز'],
  'قم': ['قم', 'قنوات', 'جعفریه', 'کهک'],
  'گلستان': ['گرگان', 'گنبد کاووس', 'بندر ترکمن', 'علی‌آباد کتول', 'آزادشهر'],
  'همدان': ['همدان', 'ملایر', 'نهاوند', 'تویسرکان', 'اسدآباد'],
  'کرمانشاه': ['کرمانشاه', 'اسلام‌آباد غرب', 'جوانرود', 'کنگاور', 'سنقر'],
  'کردستان': ['سنندج', 'سقز', 'مریوان', 'بانه', 'قروه'],
  'هرمزگان': ['بندرعباس', 'میناب', 'دهبارز', 'بندر لنگه', 'قشم'],
  'لرستان': ['خرم‌آباد', 'بروجرد', 'دورود', 'کوهدشت', 'الیگودرز'],
  'بوشهر': ['بوشهر', 'برازجان', 'بندر کنگان', 'بندر گناوه', 'خورموج'],
  'اردبیل': ['اردبیل', 'پارس‌آباد', 'مشگین‌شهر', 'خلخال', 'گرمی'],
  'زنجان': ['زنجان', 'ابهر', 'خرمدره', 'قیدار'],
  'مرکزی': ['اراک', 'ساوه', 'خمین', 'محلات'],
  'چهارمحال و بختیاری': ['شهرکرد', 'بروجن', 'لردگان', 'فارسان'],
  'خراسان شمالی': ['بجنورد', 'شیروان', 'اسفراین', 'آشخانه'],
  'خراسان جنوبی': ['بیرجند', 'قائن', 'طبس', 'فردوس'],
  'سمنان': ['سمنان', 'شاهرود', 'دامغان', 'گرمسار'],
  'ایلام': ['ایلام', 'ایوان', 'دهلران', 'آبدانان'],
  'کهگیلویه و بویراحمد': ['یاسوج', 'دوگنبدان', 'دهدشت', 'لیکک']
};

export const PROVINCES = Object.keys(PROVINCES_WITH_CITIES);

export const CONDITION_MAP: Record<string, { label: string; color: string; description: string }> = {
  'New': { label: 'نو', color: 'text-green-600 bg-green-50', description: 'کالای آکبند و استفاده نشده با بسته‌بندی اصلی.' },
  'Used - Like New': { label: 'در حد نو', color: 'text-blue-600 bg-blue-50', description: 'بسیار تمیز، مشابه نو بدون هیچ‌گونه خط و خش.' },
  'Used - Good': { label: 'کارکرده تمیز', color: 'text-yellow-600 bg-yellow-50', description: 'سالم و در حال کار با آثار استفاده جزئی.' },
  'Used - Fair': { label: 'کارکرده معمولی', color: 'text-orange-600 bg-orange-50', description: 'دارای خط و خش یا آثار استفاده واضح، اما کاملاً سالم.' }
};

export const MOCK_USERS: User[] = [
  { id: 'u_admin', name: 'مدیر سیستم', avatar: 'https://picsum.photos/seed/admin/100/100', joinedDate: 'فروردین ۱۴۰۰', rating: 5.0, role: 'admin', phone: '09120000000' },
  { id: 'u1', name: 'امیر نیکجو', avatar: 'https://picsum.photos/seed/u1/100/100', joinedDate: 'دی ۱۴۰۱', rating: 4.8, role: 'user', phone: '09121111111' },
  { id: 'u2', name: 'سارا رضایی', avatar: 'https://picsum.photos/seed/u2/100/100', joinedDate: 'اسفند ۱۴۰۲', rating: 4.5, role: 'user', phone: '09122222222' },
  { id: 'u3', name: 'رضا علوی', avatar: 'https://picsum.photos/seed/u3/100/100', joinedDate: 'آبان ۱۴۰۲', rating: 4.2, role: 'user', phone: '09123333333' },
];

export const CATEGORIES: Category[] = [
  { id: 'cat1', name: 'املاک', icon: '🏡' },
  { id: 'cat2', name: 'وسایل نقلیه', icon: '🏎️' },
  { id: 'cat3', name: 'کالای دیجیتال', icon: '💻' },
  { id: 'cat4', name: 'خانه و آشپزخانه', icon: '🛋️' },
  { id: 'cat5', name: 'خدمات', icon: '👨‍🔧' },
  { id: 'cat6', name: 'وسایل شخصی', icon: '👔' },
  { id: 'cat7', name: 'سرگرمی و فراغت', icon: '🎯' },
  { id: 'cat8', name: 'اجتماعی', icon: '🤝' },
  { id: 'cat9', name: 'تجهیزات و صنعتی', icon: '⚙️' },
  { id: 'cat10', name: 'استخدام و کاریابی', icon: '📈' },
];

export const SUB_CATEGORIES: Record<string, string[]> = {
  'املاک': ['آپارتمان', 'ویلایی', 'زمین', 'اداری و تجاری', 'اجاره کوتاه مدت'],
  'وسایل نقلیه': ['خودرو', 'موتورسیکلت', 'قطعات یدکی', 'قایق', 'خودروهای سنگین'],
  'کالای دیجیتال': ['موبایل', 'لپ‌تاپ', 'کنسول بازی', 'دوربین عکاسی', 'لوازم جانبی'],
  'خانه و آشپزخانه': ['مبلمان', 'لوازم برقی', 'دکوراسیون', 'فرش', 'ظروف'],
  'خدمات': ['آموزشی', 'تعمیرات', 'نظافت', 'آرایشگری', 'حمل و نقل'],
  'وسایل شخصی': ['ساعت', 'کفش', 'پوشاک', 'زیورآلات', 'عینک'],
  'سرگرمی و فراغت': ['موسیقی', 'ورزشی', 'اسباب بازی', 'حیوانات', 'کتاب'],
  'تجهیزات و صنعتی': ['ابزارآلات', 'ماشین‌آلات', 'تجهیزات آرایشگاه', 'اداری'],
  'استخدام و کاریابی': ['حسابداری', 'ادمین', 'فروشنده', 'کارشناس فنی'],
};

export const MOCK_BANNERS: Banner[] = [
  { id: 'b1', name: 'امنیت خرید', title: 'خرید امن با نیکجو', imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800', link: '#', position: 3, price: 0 },
  { id: 'b2', name: 'سرویس پلاس', title: 'نیکجو پلاس فعال شد', imageUrl: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=800', link: '#', position: 7, price: 0 },
  { id: 'b3', name: 'استخدام', title: 'فرصت‌های شغلی جدید', imageUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=800', link: '#', position: 15, price: 0 },
];

export const MOCK_LISTINGS: Listing[] = [
  // کالای دیجیتال
  { id: 'l1', title: 'آیفون ۱۵ پرومکس در حد نو', description: 'بدون خط و خش، پارت نامبر CH، سلامت باتری ۱۰۰ درصد.', price: 78000000, currency: 'تومان', category: 'کالای دیجیتال', location: 'تهران، سعادت‌آباد', images: ['https://picsum.photos/seed/iphone15/400/300'], seller: MOCK_USERS[1], createdAt: 'لحظاتی پیش', condition: 'Used - Like New', tags: ['موبایل', 'اپل'], icon: '📱' },
  { id: 'l3', title: 'مک‌بوک ایر M2 مدل ۲۰۲۳', description: 'رم ۸ گیگ، ۲۵۶ اس‌اس‌دی، رنگ میدنایت، بسیار تمیز.', price: 54000000, currency: 'تومان', category: 'کالای دیجیتال', location: 'تهران، gishha', images: ['https://picsum.photos/seed/macbook/400/300'], seller: MOCK_USERS[2], createdAt: '۱ ساعت پیش', condition: 'Used - Like New', tags: ['لپ‌تاپ', 'اپل'], icon: '💻' },
  { id: 'l4', title: 'پلی‌استیشن ۵ نسخه استاندارد', description: 'همراه با دو دسته اصلی و بازی فیفا ۲۴.', price: 28500000, currency: 'تومان', category: 'کالای دیجیتال', location: 'اصفهان، مرداویج', images: ['https://picsum.photos/seed/ps5/400/300'], seller: MOCK_USERS[3], createdAt: '۲ ساعت پیش', condition: 'Used - Good', tags: ['کنسول', 'سونی'], icon: '🎮' },
  
  // وسایل نقلیه
  { id: 'l2', title: 'پژو ۲۰۶ تیپ ۵ مدل ۹۸', description: 'بی‌رنگ، کارکرد ۶۰ هزارتا، فنی کاملا سالم.', price: 450000000, currency: 'تومان', category: 'وسایل نقلیه', location: 'مشهد، احمدآباد', images: ['https://picsum.photos/seed/206/400/300'], seller: MOCK_USERS[2], createdAt: '۵ دقیقه پیش', condition: 'Used - Good', tags: ['خودرو', '۲۰۶'], icon: '🚗' },
  { id: 'l5', title: 'هیوندای سانتافه ۲۰۱۷ فول', description: 'تک برگ سند، ۶۰ هزار کارکرد واقعی، سقف پانوراما.', price: 4200000000, currency: 'تومان', category: 'وسایل نقلیه', location: 'تهران، نیاوران', images: ['https://picsum.photos/seed/santafe/400/300'], seller: MOCK_USERS[1], createdAt: '۳ ساعت پیش', condition: 'Used - Like New', tags: ['خودرو', 'هیوندای'], icon: '🚘' },
  // Fix: Replaced Persian digits in price numeric literal to prevent syntax error
  { id: 'l6', title: 'موتورسیکلت هوندا کلیک ۱۵۰', description: 'مدل ۱۴۰۱، کارکرد ۵ هزارتا، بیمه تا آخر سال.', price: 185000000, currency: 'تومان', category: 'وسایل نقلیه', location: 'شیراز، معالی آباد', images: ['https://picsum.photos/seed/honda/400/300'], seller: MOCK_USERS[3], createdAt: '۴ ساعت پیش', condition: 'Used - Good', tags: ['موتور', 'هوندا'], icon: '🛵' },

  // املاک
  { id: 'l7', title: 'آپارتمان ۱۲۰ متری، کلید نخورده', description: 'فول امکانات، پارکینگ، انباری، آسانسور، ویو ابدی.', price: 12500000000, currency: 'تومان', category: 'املاک', location: 'تهران، پاسداران', images: ['https://picsum.photos/seed/apt1/400/300'], seller: MOCK_USERS[1], createdAt: '۵ ساعت پیش', condition: 'New', tags: ['آپارتمان', 'لوکس'], icon: '🏡' },
  { id: 'l8', title: 'ویلای ۵۰۰ متری در نوشهر', description: 'ساحلی، سند تک برگ، حیاط سازی شده عالی.', price: 18000000000, currency: 'تومان', category: 'املاک', location: 'مازندران، نوشهر', images: ['https://picsum.photos/seed/villa/400/300'], seller: MOCK_USERS[2], createdAt: '۶ ساعت پیش', condition: 'Used - Like New', tags: ['ویلا', 'شمال'], icon: '🏖️' },
  { id: 'l9', title: 'دفتر کار اداری ۷۰ متری', description: 'مناسب مطب یا دفتر مهندسی، نزدیک مترو.', price: 6500000000, currency: 'تومان', category: 'املاک', location: 'تهران، ونک', images: ['https://picsum.photos/seed/office/400/300'], seller: MOCK_USERS[3], createdAt: '۷ ساعت پیش', condition: 'Used - Good', tags: ['اداری', 'تجاری'], icon: '🏢' },

  // خانه و آشپزخانه
  { id: 'l10', title: 'مبلمان ۷ نفره طرح چستر', description: 'پارچه نانو ضد لک، پایه چوبی، کاملا سالم.', price: 24000000, currency: 'تومان', category: 'خانه و آشپزخانه', location: 'کرج، عظیمیه', images: ['https://picsum.photos/seed/sofa/400/300'], seller: MOCK_USERS[2], createdAt: '۸ ساعت پیش', condition: 'Used - Good', tags: ['مبلمان', 'چستر'], icon: '🛋️' },
  // Fix: Replaced Persian digits in price numeric literal to prevent syntax error
  { id: 'l11', title: 'فرش ۶ متری دستباف تبریز', description: 'چله ابریشم، نقشه علیا، نو و پا نخورده.', price: 110000000, currency: 'تومان', category: 'خانه و آشپزخانه', location: 'تبریز، آبرسان', images: ['https://picsum.photos/seed/carpet/400/300'], seller: MOCK_USERS[1], createdAt: '۹ ساعت پیش', condition: 'New', tags: ['فرش', 'دستباف'], icon: '🧶' },
  { id: 'l12', title: 'یخچال ساید بای ساید سامسونگ', description: 'مدل ۲۰۲۱، بسیار تمیز و در حد نو.', price: 68000000, currency: 'تومان', category: 'خانه و آشپزخانه', location: 'مشهد، وکیل آباد', images: ['https://picsum.photos/seed/fridge/400/300'], seller: MOCK_USERS[3], createdAt: '۱۰ ساعت پیش', condition: 'Used - Like New', tags: ['لوازم برقی', 'یخچال'], icon: '❄️' },

  // خدمات
  { id: 'l13', title: 'تدریس خصوصی ریاضی کنکور', description: 'توسط رتبه برتر کنکور، تضمینی، جلسه اول رایگان.', price: 450000, currency: 'تومان (هر جلسه)', category: 'خدمات', location: 'تهران، کل مناطق', images: ['https://picsum.photos/seed/math/400/300'], seller: MOCK_USERS[1], createdAt: '۱۱ ساعت پیش', condition: 'New', tags: ['آموزش', 'ریاضی'], icon: '👨‍🏫' },
  { id: 'l14', title: 'تعمیرات تخصصی پکیج و کولر', description: 'نصب و سرویس انواع برندها با ضمانت کتبی.', price: 200000, currency: 'تومان (شروع قیمت)', category: 'خدمات', location: 'اهواز، گلستان', images: ['https://picsum.photos/seed/repair/400/300'], seller: MOCK_USERS[2], createdAt: '۱۲ ساعت پیش', condition: 'New', tags: ['فنی', 'تعمیرات'], icon: '👨‍🔧' },
  { id: 'l15', title: 'طراحی سایت و اپلیکیشن', description: 'وردپرس و کدنویسی اختصاصی، سئو و پشتیبانی.', price: 8000000, currency: 'تومان (پروژه‌ای)', category: 'خدمات', location: 'تهران، آنلاین', images: ['https://picsum.photos/seed/web/400/300'], seller: MOCK_USERS[3], createdAt: '۱۳ ساعت پیش', condition: 'New', tags: ['دیجیتال', 'طراحی'], icon: '🌐' },

  // وسایل شخصی
  { id: 'l16', title: 'ساعت رولکس سابمارینر (High Copy)', description: 'موتور اتوماتیک ژاپن، شیشه ضد خش، رنگ ثابت.', price: 5500000, currency: 'تومان', category: 'وسایل شخصی', location: 'تهران، تجریش', images: ['https://picsum.photos/seed/watch/400/300'], seller: MOCK_USERS[1], createdAt: '۱۴ ساعت پیش', condition: 'New', tags: ['ساعت', 'اکسسوری'], icon: '⌚' },
  { id: 'l17', title: 'کتونی نایک ایر جردن ۱', description: 'سایز ۴۲، رنگ مشکی قرمز، اورجینال، بسیار کم استفاده شده.', price: 12000000, currency: 'تومان', category: 'وسایل شخصی', location: 'اصفهان، جلفا', images: ['https://picsum.photos/seed/shoes/400/300'], seller: MOCK_USERS[2], createdAt: '۱۵ ساعت پیش', condition: 'Used - Like New', tags: ['کفش', 'نایک'], icon: '👟' },
  { id: 'l18', title: 'عینک آفتابی ری‌بن اصل', description: 'مدل خلبانی، شیشه سنگ، با جعبه و دستمال اصلی.', price: 4200000, currency: 'تومان', category: 'وسایل شخصی', location: 'شیراز، ستارخان', images: ['https://picsum.photos/seed/glasses/400/300'], seller: MOCK_USERS[3], createdAt: '۱۶ ساعت پیش', condition: 'Used - Good', tags: ['عینک', 'ری‌بن'], icon: '🕶️' },

  // سرگرمی و فراغت
  { id: 'l19', title: 'گیتار آکوستیک یاماها F310', description: 'بسیار خوش صدا، مناسب برای شروع یادگیری، همراه با کیف.', price: 7500000, currency: 'تومان', category: 'سرگرمی و فراغت', location: 'تهران، یوسف آباد', images: ['https://picsum.photos/seed/guitar/400/300'], seller: MOCK_USERS[1], createdAt: '۱۷ ساعت پیش', condition: 'Used - Good', tags: ['موسیقی', 'گیتار'], icon: '🎸' },
  { id: 'l20', title: 'دوچرخه کوهستان جاینت سایز ۲۷.۵', description: 'ست دنده شیمانو دئور، ترمز دیسک هیدرولیک.', price: 32000000, currency: 'تومان', category: 'سرگرمی و فراغت', location: 'رشت، گلسار', images: ['https://picsum.photos/seed/bike/400/300'], seller: MOCK_USERS[2], createdAt: '۱۸ ساعت پیش', condition: 'Used - Good', tags: ['ورزشی', 'دوچرخه'], icon: '🚲' },
  { id: 'l21', title: 'مجموعه کتاب‌های هری پاتر (نسخه اصلی)', description: 'هفت جلد کامل، زبان انگلیسی، جلد سخت.', price: 3500000, currency: 'تومان', category: 'سرگرمی و فراغت', location: 'قم، سالاریه', images: ['https://picsum.photos/seed/books/400/300'], seller: MOCK_USERS[3], createdAt: '۱۹ ساعت پیش', condition: 'Used - Like New', tags: ['کتاب', 'هری پاتر'], icon: '📚' },

  // اجتماعی
  { id: 'l22', title: 'تور کویر گردی یک روزه', description: 'حرکت از تهران، ترانسفر، صبحانه، ناهار و لیدر مجرب.', price: 1200000, currency: 'تومان', category: 'اجتماعی', location: 'تهران، آرژانتین', images: ['https://picsum.photos/seed/desert/400/300'], seller: MOCK_USERS[1], createdAt: '۲۰ ساعت پیش', condition: 'New', tags: ['گردشگری', 'کویر'], icon: '🏜️' },
  { id: 'l23', title: 'آموزش گروهی یوگا در پارک', description: 'صبح‌های زوج، محیطی دوستانه و پر انرژی.', price: 150000, currency: 'تومان (هر جلسه)', category: 'اجتماعی', location: 'تهران، پارک ملت', images: ['https://picsum.photos/seed/yoga/400/300'], seller: MOCK_USERS[2], createdAt: '۲۱ ساعت پیش', condition: 'New', tags: ['ورزشی', 'یوگا'], icon: '🧘‍♀️' },

  // تجهیزات و صنعتی
  // Fix: Replaced Persian digits in price numeric literal to prevent syntax error
  { id: 'l24', title: 'دستگاه اسپرسوساز صنعتی جیمبالی', description: 'دو گروپ، مدل ۲۰۱۹، جنرال سرویس شده، آماده کار.', price: 185000000, currency: 'تومان', category: 'تجهیزات و صنعتی', location: 'تهران، بازار', images: ['https://picsum.photos/seed/coffee/400/300'], seller: MOCK_USERS[1], createdAt: '۲۲ ساعت پیش', condition: 'Used - Good', tags: ['کافی‌شاپ', 'صنعتی'], icon: '☕' },
  { id: 'l25', title: 'دریل شارژی ماکیتا اصل ژاپن', description: '۱۸ ولت، همراه با دو باتری و کیف حمل.', price: 8500000, currency: 'تومان', category: 'تجهیزات و صنعتی', location: 'تبریز، بازار ابزار', images: ['https://picsum.photos/seed/drill/400/300'], seller: MOCK_USERS[2], createdAt: '۲۳ ساعت پیش', condition: 'Used - Like New', tags: ['ابزار', 'دریل'], icon: '🛠️' },
  { id: 'l26', title: 'یخچال ایستاده صنعتی ۶ درب', description: 'موتور دانفوس اصل، بدنه استیل، بسیار تمیز.', price: 42000000, currency: 'تومان', category: 'تجهیزات و صنعتی', location: 'کرمان، بلوار جمهوری', images: ['https://picsum.photos/seed/fridge2/400/300'], seller: MOCK_USERS[3], createdAt: 'دیروز', condition: 'Used - Good', tags: ['صنعتی', 'یخچال'], icon: '🍱' },

  // استخدام و کاریابی
  { id: 'l27', title: 'استخدام حسابدار خانم (تمام وقت)', description: 'حداقل ۳ سال سابقه کار، مسلط به نرم‌افزار سپیدار.', price: 12000000, currency: 'تومان (حقوق پایه)', category: 'استخدام و کاریابی', location: 'تهران، جردن', images: ['https://picsum.photos/seed/job1/400/300'], seller: MOCK_USERS[1], createdAt: 'دیروز', condition: 'New', tags: ['حسابداری', 'استخدام'], icon: '📋' },
  { id: 'l28', title: 'ادمین اینستاگرام و تولید محتوا', description: 'خلاق، مسلط به پریمیر و فتوشاپ، دورکاری.', price: 8000000, currency: 'تومان (توافقی)', category: 'استخدام و کاریابی', location: 'مشهد، آنلاین', images: ['https://picsum.photos/seed/job2/400/300'], seller: MOCK_USERS[2], createdAt: 'دیروز', condition: 'New', tags: ['دیجیتال', 'ادمین'], icon: '📸' },
  { id: 'l29', title: 'فروشنده حضوری برای فروشگاه پوشاک', description: 'ظاهر آراسته، فن بیان قوی، شیفت عصر.', price: 7000000, currency: 'تومان + پورسانت', category: 'استخدام و کاریابی', location: 'شیراز، مجتمع خلیج فارس', images: ['https://picsum.photos/seed/job3/400/300'], seller: MOCK_USERS[3], createdAt: 'دیروز', condition: 'New', tags: ['فروشنده', 'بوتیک'], icon: '🧥' },
  { id: 'l30', title: 'برنامه‌نویس React (ارشد)', description: 'مسلط به Next.js و TypeScript، محیط کاری پویا.', price: 45000000, currency: 'تومان', category: 'استخدام و کاریابی', location: 'تهران، پارک فناوری', images: ['https://picsum.photos/seed/job4/400/300'], seller: MOCK_USERS[1], createdAt: 'دیروز', condition: 'New', tags: ['توسعه‌دهنده', 'فناوری'], icon: '💻' },
];
