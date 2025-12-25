
import { Listing, Category, User } from './types';

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

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'امیر نیکجو', avatar: 'https://picsum.photos/seed/u1/100/100', joinedDate: 'دی ۱۴۰۱', rating: 4.8 },
  { id: 'u2', name: 'سارا رضایی', avatar: 'https://picsum.photos/seed/u2/100/100', joinedDate: 'اسفند ۱۴۰۲', rating: 4.5 },
];

export const CATEGORIES: Category[] = [
  { id: 'cat1', name: 'املاک', icon: '🏠' },
  { id: 'cat2', name: 'وسایل نقلیه', icon: '🚗' },
  { id: 'cat3', name: 'کالای دیجیتال', icon: '📱' },
  { id: 'cat4', name: 'خانه و آشپزخانه', icon: '🛋️' },
  { id: 'cat5', name: 'خدمات', icon: '🛠️' },
  { id: 'cat6', name: 'وسایل شخصی', icon: '⌚' },
  { id: 'cat7', name: 'سرگرمی و فراغت', icon: '🎮' },
  { id: 'cat8', name: 'اجتماعی', icon: '👥' },
  { id: 'cat9', name: 'تجهیزات و صنعتی', icon: '🏗️' },
  { id: 'cat10', name: 'استخدام و کاریابی', icon: '💼' },
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

export const MOCK_LISTINGS: Listing[] = [
  { id: 'l1', title: 'آیفون ۱۵ پرومکس در حد نو', description: 'بدون خط و خش، پارت نامبر CH، سلامت باتری ۱۰۰ درصد.', price: 78000000, currency: 'تومان', category: 'کالای دیجیتال', location: 'تهران، سعادت‌آباد', images: ['https://picsum.photos/seed/iphone15/400/300'], seller: MOCK_USERS[0], createdAt: 'لحظاتی پیش', condition: 'Used - Like New', tags: ['موبایل', 'اپل'] },
  { id: 'l2', title: 'پژو ۲۰۶ تیپ ۵ مدل ۹۸', description: 'بی‌رنگ، کارکرد ۶۰ هزارتا، فنی کاملا سالم.', price: 450000000, currency: 'تومان', category: 'وسایل نقلیه', location: 'مشهد، احمدآباد', images: ['https://picsum.photos/seed/206/400/300'], seller: MOCK_USERS[1], createdAt: '۵ دقیقه پیش', condition: 'Used - Good', tags: ['خودرو', '۲۰۶'] },
  { id: 'l3', title: 'آپارتمان ۸۵ متری فول امکانات', description: 'دو خوابه، طبقه چهارم، دارای پارکینگ و انباری سندی.', price: 4200000000, currency: 'تومان', category: 'املاک', location: 'اصفهان، جلفا', images: ['https://picsum.photos/seed/house1/400/300'], seller: MOCK_USERS[0], createdAt: '۱۰ دقیقه پیش', condition: 'Used - Good', tags: ['آپارتمان', 'فروش'] },
  { id: 'l4', title: 'کنسول بازی PS5 ریجن ۱۲۱۶', description: 'سری جدید، همراه با دو دسته و کیف مخصوص.', price: 29500000, currency: 'تومان', category: 'کالای دیجیتال', location: 'تبریز، آبرسان', images: ['https://picsum.photos/seed/ps5/400/300'], seller: MOCK_USERS[1], createdAt: '۱ ساعت پیش', condition: 'New', tags: ['کنسول بازی', 'پلی‌استیشن'] },
  { id: 'l5', title: 'مبل ۷ نفره راحتی طرح ترک', description: 'پارچه نانو ضد لک، فوم سرد عالی، بسیار تمیز.', price: 18000000, currency: 'تومان', category: 'خانه و آشپزخانه', location: 'شیراز، معالی‌آباد', images: ['https://picsum.photos/seed/sofa/400/300'], seller: MOCK_USERS[0], createdAt: '۲ ساعت پیش', condition: 'Used - Like New', tags: ['مبلمان', 'دکوراسیون'] },
  { id: 'l6', title: 'استخدام ادمین اینستاگرام حرفه‌ای', description: 'تسلط کامل به کپشن‌نویسی و تدوین ویدیو با گوشی.', price: 12000000, currency: 'تومان', category: 'استخدام و کاریابی', location: 'تهران، ونک', images: ['https://picsum.photos/seed/job1/400/300'], seller: MOCK_USERS[1], createdAt: '۳ ساعت پیش', condition: 'New', tags: ['ادمین', 'کار'] },
  { id: 'l7', title: 'مک‌بوک پرو M2 خاکستری', description: 'رم ۱۶ گیگ، حافظه ۵۱۲، در حد آکبند واقعی.', price: 85000000, currency: 'تومان', category: 'کالای دیجیتال', location: 'کرج، گوهردشت', images: ['https://picsum.photos/seed/macbook/400/300'], seller: MOCK_USERS[0], createdAt: '۴ ساعت پیش', condition: 'Used - Like New', tags: ['لپ‌تاپ', 'اپل'] },
  { id: 'l8', title: 'ساعت رولکس دیت‌جاست های‌کپی', description: 'اتوماتیک، موتور ژاپن، با جعبه و کارت گارانتی.', price: 4500000, currency: 'تومان', category: 'وسایل شخصی', location: 'اهواز، کیانپارس', images: ['https://picsum.photos/seed/watch1/400/300'], seller: MOCK_USERS[1], createdAt: '۵ ساعت پیش', condition: 'Used - Good', tags: ['ساعت', 'اکسسوری'] },
  { id: 'l9', title: 'تدریس خصوصی ریاضی کنکور', description: 'توسط رتبه برتر دانشگاه شریف، تضمینی.', price: 500000, currency: 'تومان', category: 'خدمات', location: 'قم، سالاریه', images: ['https://picsum.photos/seed/tutor/400/300'], seller: MOCK_USERS[0], createdAt: '۶ ساعت پیش', condition: 'New', tags: ['آموزشی', 'ریاضی'] },
  { id: 'l10', title: 'گیتار کلاسیک یاماها C40', description: 'سیم‌ها تازه تعویض شده، همراه با کاور ضربه‌گیر.', price: 6200000, currency: 'تومان', category: 'سرگرمی و فراغت', location: 'رشت، گلسار', images: ['https://picsum.photos/seed/guitar/400/300'], seller: MOCK_USERS[1], createdAt: '۷ ساعت پیش', condition: 'Used - Good', tags: ['موسیقی', 'گیتار'] },
  { id: 'l11', title: 'یخچال ساید بای ساید سامسونگ', description: 'مدل ۲۰۱۹، کاملاً سالم و در حال کار.', price: 45000000, currency: 'تومان', category: 'خانه و آشپزخانه', location: 'کرمان، بلوار جمهوری', images: ['https://picsum.photos/seed/fridge/400/300'], seller: MOCK_USERS[0], createdAt: '۸ ساعت پیش', condition: 'Used - Good', tags: ['لوازم برقی', 'یخچال'] },
  { id: 'l12', title: 'دوچرخه کوهستان ویوا سایز ۲۶', description: '۲۱ دنده شیمانو، لاستیک‌ها نو، بدنه آلومینیوم.', price: 9800000, currency: 'تومان', category: 'سرگرمی و فراغت', location: 'ساری، قارن', images: ['https://picsum.photos/seed/bike/400/300'], seller: MOCK_USERS[1], createdAt: '۹ ساعت پیش', condition: 'Used - Good', tags: ['ورزشی', 'دوچرخه'] },
  { id: 'l13', title: 'باغچه ۱۰۰۰ متری شهریار', description: 'دارای درختان میوه مثمر و سهمیه آب کشاورزی.', price: 3500000000, currency: 'تومان', category: 'املاک', location: 'شهریار، کردزار', images: ['https://picsum.photos/seed/garden/400/300'], seller: MOCK_USERS[0], createdAt: '۱۰ ساعت پیش', condition: 'New', tags: ['زمین', 'باغ'] },
  { id: 'l14', title: 'ماشین لباسشویی ال‌جی ۹ کیلویی', description: 'گیربکسی، بسیار کم صدا و بدون لرزش.', price: 22000000, currency: 'تومان', category: 'خانه و آشپزخانه', location: 'ارومیه، خیام', images: ['https://picsum.photos/seed/washer/400/300'], seller: MOCK_USERS[1], createdAt: '۱۱ ساعت پیش', condition: 'Used - Like New', tags: ['لوازم برقی', 'ال‌جی'] },
  { id: 'l15', title: 'دستگاه جوش اینورتر ادون', description: '۲۰۰ آمپر واقعی، همراه با کابل و انبر.', price: 3800000, currency: 'تومان', category: 'تجهیزات و صنعتی', location: 'یزد، صفائیه', images: ['https://picsum.photos/seed/welder/400/300'], seller: MOCK_USERS[0], createdAt: '۱۲ ساعت پیش', condition: 'New', tags: ['ابزارآلات', 'صنعتی'] },
  { id: 'l16', title: 'کفش نایکی ایر جردن اصل', description: 'سایز ۴۳، فقط یک بار پوشیده شده، با فاکتور خرید.', price: 7500000, currency: 'تومان', category: 'وسایل شخصی', location: 'همدان، بوعلی', images: ['https://picsum.photos/seed/shoes/400/300'], seller: MOCK_USERS[1], createdAt: 'دیروز', condition: 'Used - Like New', tags: ['کفش', 'نایکی'] },
  { id: 'l17', title: 'خدمات لوله‌کشی و نشت‌یابی', description: 'با دستگاه پیشرفته و ضمانت کتبی کارکرد.', price: 0, currency: 'توافقی', category: 'خدمات', location: 'کرمانشاه، ۲۲ بهمن', images: ['https://picsum.photos/seed/plumbing/400/300'], seller: MOCK_USERS[0], createdAt: 'دیروز', condition: 'New', tags: ['تعمیرات', 'تاسیسات'] },
  { id: 'l18', title: 'تویوتا کمری مدل ۲۰۱۴', description: 'تیپ GLX، مانیتور بزرگ، دوربین دنده عقب.', price: 2100000000, currency: 'تومان', category: 'وسایل نقلیه', location: 'بوشهر، ساحلی', images: ['https://picsum.photos/seed/toyota/400/300'], seller: MOCK_USERS[1], createdAt: 'دیروز', condition: 'Used - Good', tags: ['خودرو', 'تویوتا'] },
  { id: 'l19', title: 'میز ناهارخوری ۴ نفره چوبی', description: 'چوب راش، پارچه مخمل، بسیار شیک و محکم.', price: 8500000, currency: 'تومان', category: 'خانه و آشپزخانه', location: 'سنندج، شالمان', images: ['https://picsum.photos/seed/table/400/300'], seller: MOCK_USERS[0], createdAt: 'دیروز', condition: 'Used - Like New', tags: ['مبلمان', 'دکور'] },
  { id: 'l20', title: 'جوجه عروس هلندی سرلاکی', description: 'نژاد لوتینو، از پدر و مادر باکیفیت و تغذیه عالی.', price: 1200000, currency: 'تومان', category: 'سرگرمی و فراغت', location: 'گرگان، ناهارخوران', images: ['https://picsum.photos/seed/bird/400/300'], seller: MOCK_USERS[1], createdAt: 'دیروز', condition: 'New', tags: ['حیوانات', 'پرنده'] },
  { id: 'l21', title: 'پیانو دیجیتال یاماها P-125', description: 'همراه با صندلی و آداپتور اصلی، کم‌کارکرد.', price: 48000000, currency: 'تومان', category: 'سرگرمی و فراغت', location: 'اراک، عباس‌آباد', images: ['https://picsum.photos/seed/piano/400/300'], seller: MOCK_USERS[0], createdAt: 'دیروز', condition: 'Used - Like New', tags: ['موسیقی', 'پیانو'] },
  { id: 'l22', title: 'دوربین عکاسی کانون 80D', description: 'لنز ۱۸-۱۳۵، تعداد شات بسیار پایین، بدون خط.', price: 34000000, currency: 'تومان', category: 'کالای دیجیتال', location: 'زاهدان، دانشگاه', images: ['https://picsum.photos/seed/camera/400/300'], seller: MOCK_USERS[1], createdAt: '۲ روز پیش', condition: 'Used - Good', tags: ['دوربین عکاسی', 'کانون'] },
  { id: 'l23', title: 'فرش ۹ متری ۷۰۰ شانه', description: 'تراکم ۲۵۵۰، طرح افشان، ۱۰۰ درصد آکریلیک.', price: 11000000, currency: 'تومان', category: 'خانه و آشپزخانه', location: 'اردبیل، باکری', images: ['https://picsum.photos/seed/carpet/400/300'], seller: MOCK_USERS[0], createdAt: '۲ روز پیش', condition: 'New', tags: ['فرش', 'کاشان'] },
  { id: 'l24', title: 'کت و شلوار مردانه برند هاکوپیان', description: 'سایز ۵۲، مناسب برای قد ۱۸۰، یک بار پوشیده شده.', price: 5500000, currency: 'تومان', category: 'وسایل شخصی', location: 'بجنورد، ۱۷ شهریور', images: ['https://picsum.photos/seed/suit/400/300'], seller: MOCK_USERS[1], createdAt: '۲ روز پیش', condition: 'Used - Like New', tags: ['پوشاک', 'کت'] },
  { id: 'l25', title: 'خرید و فروش ضایعات فلزی', description: 'بهترین قیمت، خرید در محل، نقدی.', price: 0, currency: 'توافقی', category: 'خدمات', location: 'قزوین، خیام', images: ['https://picsum.photos/seed/scrap/400/300'], seller: MOCK_USERS[0], createdAt: '۲ روز پیش', condition: 'Used - Fair', tags: ['نظافت', 'ضایعات'] },
  { id: 'l26', title: 'استخدام حسابدار خانم تمام وقت', description: 'مسلط به نرم‌افزار سپیدار و گزارش‌های فصلی.', price: 15000000, currency: 'تومان', category: 'استخدام و کاریابی', location: 'بیرجند، معلم', images: ['https://picsum.photos/seed/accounting/400/300'], seller: MOCK_USERS[1], createdAt: '۳ روز پیش', condition: 'New', tags: ['حسابداری', 'شغل'] },
  { id: 'l27', title: 'موتور سیکلت هوندا کلیک ۱۵۰', description: 'مدل ۱۴۰۱، کم‌کارکرد، بیمه تا آخر سال.', price: 115000000, currency: 'تومان', category: 'وسایل نقلیه', location: 'بندرعباس، گلشهر', images: ['https://picsum.photos/seed/scooter/400/300'], seller: MOCK_USERS[0], createdAt: '۳ روز پیش', condition: 'Used - Like New', tags: ['موتورسیکلت', 'هوندا'] },
  { id: 'l28', title: 'تجهیزات کامل آرایشگاه مردانه', description: 'شامل ۳ صندلی، سرشور و میزهای کار.', price: 65000000, currency: 'تومان', category: 'تجهیزات و صنعتی', location: 'یاسوج، دولت‌آباد', images: ['https://picsum.photos/seed/barber/400/300'], seller: MOCK_USERS[1], createdAt: '۳ روز پیش', condition: 'Used - Good', tags: ['تجهیزات آرایشگاه', 'تجهیزات'] },
  { id: 'l29', title: 'ویلای ۳۰۰ متری شمال', description: 'نوساز، ۳ خواب مستر، حیاط‌سازی شده.', price: 8500000000, currency: 'تومان', category: 'املاک', location: 'نوشهر، سیسنگان', images: ['https://picsum.photos/seed/villa/400/300'], seller: MOCK_USERS[0], createdAt: '۴ روز پیش', condition: 'New', tags: ['ویلایی', 'شمال'] },
  { id: 'l30', title: 'دوچرخه ثابت باشگاهی', description: 'نمایشگر دیجیتال، تحمل وزن بالا، در حد نو.', price: 12500000, currency: 'تومان', category: 'سرگرمی و فراغت', location: 'خرم‌آباد، مطهری', images: ['https://picsum.photos/seed/gym/400/300'], seller: MOCK_USERS[1], createdAt: '۴ روز پیش', condition: 'Used - Good', tags: ['ورزشی', 'ورزش'] },
];
