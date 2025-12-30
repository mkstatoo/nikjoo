
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
  'سیستان و بلوچستان': ['زاهدان', 'زابل', 'ایرانشهر', 'چابهار', 'sراوان'],
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
  { id: 'u_admin', name: 'مدیر سیستم', avatar: 'https://picsum.photos/seed/admin/100/100', joinedDate: 'فروردین ۱۴۰۰', rating: 5.0, role: 'admin', phone: '09120000000', preferences: { viewMode: 'list', theme: 'light', notifications: true } },
  { id: 'u1', name: 'امیر نیکجو', avatar: 'https://picsum.photos/seed/u1/100/100', joinedDate: 'دی ۱۴۰۱', rating: 4.8, role: 'user', phone: '09121111111', preferences: { viewMode: 'list', theme: 'light', notifications: true } },
  { id: 'u2', name: 'سارا رضایی', avatar: 'https://picsum.photos/seed/u2/100/100', joinedDate: 'اسفند ۱۴۰۲', rating: 4.5, role: 'user', phone: '09122222222', preferences: { viewMode: 'list', theme: 'light', notifications: true } },
  { id: 'u3', name: 'رضا علوی', avatar: 'https://picsum.photos/seed/u3/100/100', joinedDate: 'آبان ۱۴۰۲', rating: 4.2, role: 'user', phone: '09123333333', preferences: { viewMode: 'list', theme: 'light', notifications: true } },
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
  { id: 'b1', name: 'امنیت خرید', title: 'خرید امن با نیکجو', imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800', link: '#', position: 3, price: 500000, status: 'active' },
  { id: 'b2', name: 'سرویس پلاس', title: 'نیکجو پلاس فعال شد', imageUrl: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=800', link: '#', position: 7, price: 750000, status: 'active' },
  { id: 'b3', name: 'استخدام', title: 'فرصت‌های شغلی جدید', imageUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=800', link: '#', position: 15, price: 300000, status: 'active' },
];

export const MOCK_LISTINGS: Listing[] = [
  { id: 'l1', title: 'آیفون ۱۵ پرومکس در حد نو', description: 'بدون خط و خش، پارت نامبر CH، سلامت باتری ۱۰۰ درصد.', price: 78000000, currency: 'تومان', category: 'کالای دیجیتال', location: 'تهران، سعادت‌آباد', images: ['https://picsum.photos/seed/iphone15/400/300'], seller: MOCK_USERS[1], createdAt: 'لحظاتی پیش', condition: 'Used - Like New', tags: ['موبایل', 'اپل'], icon: '📱', views: 124, status: 'active' },
  { id: 'l3', title: 'مک‌بوک ایر M2 مدل ۲۰۲۳', description: 'رم ۸ گیگ، ۲۵۶ اس‌اس‌دی، رنگ میدنایت، بسیار تمیز.', price: 54000000, currency: 'تومان', category: 'کالای دیجیتال', location: 'تهران، gishha', images: ['https://picsum.photos/seed/macbook/400/300'], seller: MOCK_USERS[2], createdAt: '۱ ساعت پیش', condition: 'Used - Like New', tags: ['لپ‌تاپ', 'اپل'], icon: '💻', views: 85, status: 'active' },
  { id: 'l4', title: 'پلی‌استیشن ۵ نسخه استاندارد', description: 'همراه با دو دسته اصلی و بازی فیفا ۲۴.', price: 28500000, currency: 'تومان', category: 'کالای دیجیتال', location: 'اصفهان، مرداویج', images: ['https://picsum.photos/seed/ps5/400/300'], seller: MOCK_USERS[3], createdAt: '۲ ساعت پیش', condition: 'Used - Good', tags: ['کنسول', 'سونی'], icon: '🎮', views: 210, status: 'active' },
  { id: 'l2', title: 'پژو ۲۰۶ تیپ ۵ مدل ۹۸', description: 'بی‌رنگ، کارکرد ۶۰ هزارتا، فنی کاملا سالم.', price: 450000000, currency: 'تومان', category: 'وسایل نقلیه', location: 'مشهد، احمدآباد', images: ['https://picsum.photos/seed/206/400/300'], seller: MOCK_USERS[2], createdAt: '۵ دقیقه پیش', condition: 'Used - Good', tags: ['خودرو', '۲۰۶'], icon: '🚗', views: 340, status: 'active' },
  { id: 'l5', title: 'هیوندای سانتافه ۲۰۱۷ فول', description: 'تک برگ سند، ۶۰ هزار کارکرد واقعی، سقف پانوراما.', price: 4200000000, currency: 'تومان', category: 'وسایل نقلیه', location: 'تهران، نیاوران', images: ['https://picsum.photos/seed/santafe/400/300'], seller: MOCK_USERS[1], createdAt: '۳ ساعت پیش', condition: 'Used - Like New', tags: ['خودرو', 'هیوندای'], icon: '🚘', views: 156, status: 'active' },
  { id: 'l6', title: 'موتورسیکلت هوندا کلیک ۱۵۰', description: 'مدل ۱۴۰۱، کارکرد ۵ هزارتا، بهمه تا آخر سال.', price: 185000000, currency: 'تومان', category: 'وسایل نقلیه', location: 'شیراز، معالی آباد', images: ['https://picsum.photos/seed/honda/400/300'], seller: MOCK_USERS[3], createdAt: '۴ ساعت پیش', condition: 'Used - Good', tags: ['موتور', 'هوندا'], icon: '🛵', views: 92, status: 'active' },
  { id: 'l7', title: 'آپارتمان ۱۲۰ متری، کلید نخورده', description: 'فول امکانات، پارکینگ، انباری، آسانسور، ویو ابدی.', price: 12500000000, currency: 'تومان', category: 'املاک', location: 'تهران، پاسداران', images: ['https://picsum.photos/seed/apt1/400/300'], seller: MOCK_USERS[1], createdAt: '۵ ساعت پیش', condition: 'New', tags: ['آپارتمان', 'لوکس'], icon: '🏡', views: 45, status: 'active' },
  { id: 'l8', title: 'ویلای ۵۰۰ متری در نوشهر', description: 'ساحلی، سند تک برگ، حیاط سازی شده عالی.', price: 18000000000, currency: 'تومان', category: 'املاک', location: 'مازندران، نوشهر', images: ['https://picsum.photos/seed/villa/400/300'], seller: MOCK_USERS[2], createdAt: '۶ ساعت پیش', condition: 'Used - Like New', tags: ['ویلا', 'شمال'], icon: '🏖️', views: 23, status: 'active' },
  { id: 'l9', title: 'دفتر کار اداری ۷۰ متری', description: 'مناسب مطب یا دفتر مهندسی، نزدیک مترو.', price: 6500000000, currency: 'تومان', category: 'املاک', location: 'تهران، ونک', images: ['https://picsum.photos/seed/office/400/300'], seller: MOCK_USERS[3], createdAt: '۷ ساعت پیش', condition: 'Used - Good', tags: ['اداری', 'تجاری'], icon: '🏢', views: 18, status: 'active' },
  { id: 'l10', title: 'مبلمان ۷ نفره طرح چستر', description: 'پارچه نانو ضد لک، پایه چوبی، کاملا سالم.', price: 24000000, currency: 'تومان', category: 'خانه و آشپزخانه', location: 'کرج، عظیمیه', images: ['https://picsum.photos/seed/sofa/400/300'], seller: MOCK_USERS[2], createdAt: '۸ ساعت پیش', condition: 'Used - Good', tags: ['مبلمان', 'چستر'], icon: '🛋️', views: 56, status: 'active' },
  { id: 'l11', title: 'فرش ۶ متری دستباف تبریز', description: 'چله ابریشم، نقشه علیا، نو و پا نخورده.', price: 110000000, currency: 'تومان', category: 'خانه و آشپزخانه', location: 'تبریز، آبرسان', images: ['https://picsum.photos/seed/carpet/400/300'], seller: MOCK_USERS[1], createdAt: '۹ ساعت پیش', condition: 'New', tags: ['فرش', 'دستباف'], icon: '🧶', views: 34, status: 'active' },
  { id: 'l12', title: 'یخچال ساید بای ساید سامسونگ', description: 'مدل ۲۰۲۱، بسیار تمیز و در حد نو.', price: 68000000, currency: 'تومان', category: 'خانه و آشپزخانه', location: 'مشهد، وکیل آباد', images: ['https://picsum.photos/seed/fridge/400/300'], seller: MOCK_USERS[3], createdAt: '۱۰ ساعت پیش', condition: 'Used - Like New', tags: ['لوازم برقی', 'یخچال'], icon: '❄️', views: 78, status: 'active' },
];