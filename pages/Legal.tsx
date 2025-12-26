
import React, { useState } from 'react';

interface LegalProps {
  onBack: () => void;
  initialTab?: 'tos' | 'privacy';
}

const Legal: React.FC<LegalProps> = ({ onBack, initialTab = 'tos' }) => {
  const [activeTab, setActiveTab] = useState<'tos' | 'privacy'>(initialTab);

  return (
    <div className="pb-24 bg-white min-h-screen text-right" dir="rtl">
      {/* Header */}
      <div className="p-4 flex items-center gap-3 border-b border-gray-100 bg-white sticky top-0 z-20 shadow-sm">
        <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
          <svg className="w-6 h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <h2 className="text-lg font-black text-gray-900">بخش حقوقی نیکجو</h2>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Tab Switcher */}
        <div className="flex bg-gray-100 p-1 rounded-2xl mb-10">
          <button 
            onClick={() => setActiveTab('tos')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all ${activeTab === 'tos' ? 'bg-white text-red-700 shadow-sm' : 'text-gray-500'}`}
          >
            شرایط و قوانین
          </button>
          <button 
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all ${activeTab === 'privacy' ? 'bg-white text-red-700 shadow-sm' : 'text-gray-500'}`}
          >
            حریم خصوصی
          </button>
        </div>

        <div className="prose prose-sm max-w-none animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'tos' ? (
            <div className="space-y-8 text-gray-700 leading-8">
              <section>
                <h3 className="text-xl font-black text-gray-900 mb-4">۱. تعاریف و کلیات</h3>
                <p className="text-sm">
                  استفاده از اپلیکیشن «نیکجو» به معنای پذیرش کامل تمام شرایط مندرج در این صفحه است. نیکجو یک پلتفرم واسط برای ثبت آگهی و برقراری ارتباط مستقیم بین خریدار و فروشنده است و در هیچ‌یک از مراحل معامله دخالتی ندارد.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-black text-gray-900 mb-4">۲. مسئولیت کاربران</h3>
                <ul className="list-disc list-inside space-y-3 text-sm pr-2">
                  <li>کاربران متعهد می‌شوند که اطلاعات صحیح و واقعی (نام، شماره تماس و جزئیات کالا) را وارد کنند.</li>
                  <li>درج هرگونه آگهی خلاف قوانین جاری کشور، کالاهای ممنوعه و محتوای غیراخلاقی ممنوع است.</li>
                  <li>مسئولیت بررسی کیفیت کالا، اصالت سند و امنیت معامله کاملاً بر عهده طرفین معامله است.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-black text-gray-900 mb-4">۳. امنیت معاملات</h3>
                <div className="bg-red-50 p-5 rounded-3xl border border-red-100">
                  <p className="text-xs text-red-800 font-bold leading-7">
                    نیکجو به هیچ عنوان سیستم پرداخت امن (Escrow) ندارد. اکیداً توصیه می‌شود از پرداخت بیعانه قبل از رویت کالا و اطمینان از صحت آن خودداری فرمایید. معاملات حضوری در اماکن عمومی و شلوغ بهترین روش معامله است.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-black text-gray-900 mb-4">۴. مسدودسازی حساب</h3>
                <p className="text-sm">
                  در صورت گزارش تخلف توسط سایر کاربران یا احراز هرگونه فعالیت مشکوک، نیکجو این حق را برای خود محفوظ می‌دارد که بدون اطلاع قبلی، حساب کاربری متخلف را مسدود و آگهی‌های وی را حذف نماید.
                </p>
              </section>
            </div>
          ) : (
            <div className="space-y-8 text-gray-700 leading-8">
              <section>
                <h3 className="text-xl font-black text-gray-900 mb-4">۱. اطلاعات دریافتی</h3>
                <p className="text-sm">
                  نیکجو برای ارائه خدمات خود، شماره موبایل شما را برای احراز هویت دریافت می‌کند. همچنین در صورت اجازه شما، موقعیت مکانی برای نمایش آگهی‌های نزدیک و دسترسی به گالری برای آپلود تصاویر آگهی مورد استفاده قرار می‌گیرد.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-black text-gray-900 mb-4">۲. استفاده از داده‌ها</h3>
                <p className="text-sm">
                  ما از داده‌های شما (مانند سوابق جستجو) برای شخصی‌سازی تجربه کاربری و بهبود الگوریتم‌های هوش مصنوعی نیکجو استفاده می‌کنیم. اطلاعات تماس شما فقط برای افرادی که روی دکمه «نمایش شماره» یا «چت» کلیک می‌کنند (طبق تنظیمات آگهی شما) نمایش داده می‌شود.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-black text-gray-900 mb-4">۳. کوکی‌ها و ابزارهای تحلیلی</h3>
                <p className="text-sm">
                  نیکجو از کوکی‌ها برای حفظ وضعیت ورود شما و تحلیل ترافیک وب‌سایت استفاده می‌کند. این اطلاعات به صورت ناشناس و صرفاً جهت ارتقای کیفیت سرویس‌دهی جمع‌آوری می‌شوند.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-black text-gray-900 mb-4">۴. امنیت اطلاعات</h3>
                <p className="text-sm">
                  تمامی اطلاعات کاربران بر روی سرورهای امن ذخیره شده و با استفاده از پروتکل‌های رمزنگاری پیشرفته محافظت می‌شوند. ما متعهد هستیم که اطلاعات شما را به هیچ شخص ثالثی (مگر با حکم قضایی) ارائه ندهیم.
                </p>
              </section>
            </div>
          )}
        </div>

        <div className="mt-16 p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 text-center">
          <p className="text-[10px] text-gray-400 font-bold leading-6">
            آخرین به‌روزرسانی: اسفند ۱۴۰۳<br/>
            این سند بر اساس قوانین تجارت الکترونیک جمهوری اسلامی ایران تدوین شده است.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Legal;
