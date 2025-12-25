
import React from 'react';

interface AboutProps {
  onBack: () => void;
}

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "حمید نیکجو",
    role: "مدیر عامل و بنیان‌گذار",
    bio: "متخصص استراتژی کسب و کار با بیش از ۱۰ سال سابقه در حوزه تجارت الکترونیک.",
    image: "https://picsum.photos/seed/ceo/150/150"
  },
  {
    name: "رها علوی",
    role: "مدیر فنی",
    bio: "علاقه‌مند به تکنولوژی‌های نوین و هوش مصنوعی، رهبر تیم توسعه نرم‌افزار نیکجو.",
    image: "https://picsum.photos/seed/cto/150/150"
  },
  {
    name: "سپهر راد",
    role: "مدیر طراحی و محصول",
    bio: "تمرکز بر تجربه کاربری ساده و لذت‌بخش برای تمام کاربران نیکجو.",
    image: "https://picsum.photos/seed/pdm/150/150"
  }
];

const About: React.FC<AboutProps> = ({ onBack }) => {
  return (
    <div className="pb-24 bg-white min-h-screen text-right" dir="rtl">
      <div className="p-4 flex items-center gap-3 border-b border-gray-100 bg-white sticky top-0 z-10 shadow-sm">
        <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
          <svg className="w-6 h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <h2 className="text-lg font-black text-gray-900">درباره نیکجو</h2>
      </div>

      <div className="max-w-xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <div className="w-24 h-24 bg-red-700 rounded-3xl mx-auto flex items-center justify-center text-white text-5xl font-black shadow-xl rotate-3 mb-6">ن</div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-4">نیکجو مارکت‌پلیس</h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">The Future of Local Trading</p>
        </div>

        <div className="space-y-16">
          <section>
            <h3 className="text-xl font-black text-gray-900 mb-6 border-r-4 border-red-700 pr-3">ماموریت ما</h3>
            <p className="text-gray-600 leading-8 text-sm font-medium">
              نیکجو با هدف ایجاد بازاری امن، هوشمند و در دسترس برای همه ایرانیان طراحی شده است. ما باور داریم که خرید و فروش کالاهای دست‌دوم نه تنها به اقتصاد خانواده‌ها کمک می‌کند، بلکه گامی موثر در جهت حفظ محیط زیست و مصرف پایدار است.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-black text-gray-900 mb-8 border-r-4 border-red-700 pr-3">تیم ما</h3>
            <div className="grid grid-cols-1 gap-8">
              {TEAM_MEMBERS.map((member, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-gray-50 rounded-[2rem] border border-gray-100 group hover:border-red-200 transition-all">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg shrink-0 group-hover:scale-105 transition-transform">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center sm:text-right">
                    <h4 className="text-lg font-black text-gray-900 mb-1">{member.name}</h4>
                    <p className="text-red-700 text-[10px] font-black uppercase mb-3 tracking-widest">{member.role}</p>
                    <p className="text-xs text-gray-500 leading-6 font-medium">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
              <div className="text-3xl mb-3">✨</div>
              <h4 className="font-black text-gray-900 mb-2">هوش مصنوعی</h4>
              <p className="text-xs text-gray-500 leading-6">ثبت آگهی با کمک دستیار هوشمند برای جذب سریع‌تر خریداران.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
              <div className="text-3xl mb-3">🛡️</div>
              <h4 className="font-black text-gray-900 mb-2">امنیت بالا</h4>
              <p className="text-xs text-gray-500 leading-6">سیستم‌های پیشرفته تشخیص کلاهبرداری و احراز هویت هوشمند.</p>
            </div>
          </div>

          <div className="rounded-[2.5rem] overflow-hidden shadow-2xl relative h-64 border-4 border-white">
            <img 
              src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=1000" 
              alt="Marketplace Team" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-red-900/80 to-transparent flex items-end p-8 text-white">
               <div>
                 <p className="font-black text-lg">همراه شما در هر معامله</p>
                 <p className="text-xs opacity-80">تیم پشتیبانی نیکجو ۲۴ ساعته در کنار شماست.</p>
               </div>
            </div>
          </div>

          <section className="text-center pt-8 border-t border-gray-100">
            <p className="text-gray-400 text-xs font-bold leading-6 mb-2">
              ساخته شده با ❤️ در تهران
            </p>
            <p className="text-gray-300 text-[10px] uppercase font-black tracking-widest">© 2025 Nikjoo Marketplace Group</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
