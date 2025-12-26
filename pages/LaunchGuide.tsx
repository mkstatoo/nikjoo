
import React, { useState } from 'react';

interface LaunchGuideProps {
  onBack: () => void;
}

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: 'technical' | 'legal' | 'marketing' | 'security';
  isCompleted: boolean;
}

const LaunchGuide: React.FC<LaunchGuideProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'checklist' | 'domain'>('checklist');
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: 'domain',
      title: 'اتصال دامنه اختصاصی',
      description: 'تنظیم رکوردهای DNS برای اتصال آدرس سفارشی.',
      category: 'technical',
      isCompleted: false
    },
    {
      id: 'hosting',
      title: 'استقرار در Netlify',
      description: 'پروژه با موفقیت مستقر شده است.',
      category: 'technical',
      isCompleted: true
    },
    {
      id: 'api-security',
      title: 'تنظیم API_KEY',
      description: 'کلید هوش مصنوعی در بخش Environment Variables وارد شده است.',
      category: 'security',
      isCompleted: true
    },
    {
      id: 'tos',
      title: 'تدوین قوانین و مقررات',
      description: 'نوشتن صفحه "قوانین و مقررات" برای جلب اعتماد کاربران.',
      category: 'legal',
      isCompleted: false
    }
  ]);

  const toggleItem = (id: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    ));
  };

  const progress = Math.round((checklist.filter(i => i.isCompleted).length / checklist.length) * 100);

  return (
    <div className="pb-24 bg-gray-50 min-h-screen text-right" dir="rtl">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          <h2 className="text-lg font-black text-gray-900">مرکز کنترل انتشار</h2>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-6 py-8">
        {/* Tab Switcher */}
        <div className="flex bg-gray-200 p-1 rounded-2xl mb-8">
          <button 
            onClick={() => setActiveTab('checklist')}
            className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'checklist' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
          >
            چک‌لیست نهایی
          </button>
          <button 
            onClick={() => setActiveTab('domain')}
            className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'domain' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
          >
            تنظیم دامنه (DNS)
          </button>
        </div>

        {activeTab === 'checklist' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Progress Card */}
            <div className="bg-[#12141d] rounded-[2.5rem] p-8 text-white shadow-2xl mb-10 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex justify-between items-end mb-4">
                  <h3 className="text-2xl font-black tracking-tighter">آمادگی انتشار</h3>
                  <span className="text-3xl font-black text-red-600">{progress}%</span>
                </div>
                <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden mb-4">
                  <div 
                    className="bg-red-600 h-full transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-gray-400 text-[10px] font-bold">برای لانچ رسمی نیکجو آماده‌اید؟</p>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-4">
              {checklist.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer flex gap-4 items-start ${
                    item.isCompleted ? 'bg-white border-green-100' : 'bg-white border-gray-100 shadow-sm'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center border-2 ${
                    item.isCompleted ? 'bg-green-50 border-green-200 text-green-600' : 'bg-gray-50 border-gray-100 text-gray-300'
                  }`}>
                    {item.isCompleted ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    ) : (
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h5 className={`font-black text-sm ${item.isCompleted ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{item.title}</h5>
                    <p className="text-[10px] text-gray-500 mt-1 leading-5">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="bg-blue-50 border border-blue-100 rounded-[2.5rem] p-8">
              <h4 className="font-black text-blue-900 text-lg mb-6 flex items-center gap-2">
                <span className="text-2xl">🌐</span>
                اتصال دامنه به Netlify
              </h4>
              
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-blue-800 font-bold mb-4">مرحله ۱: افزودن دامنه در پنل هاستینگ</p>
                  <p className="text-[11px] text-blue-700 leading-6 mb-4">
                    وارد سایت Netlify شوید، پروژه خود را انتخاب کنید و در بخش <strong>Domain Management</strong>، روی دکمه <strong>Add custom domain</strong> کلیک کنید و آدرس خود را (مثلاً nikjoo.com) وارد کنید.
                  </p>
                </div>

                <div className="pt-6 border-t border-blue-100">
                  <p className="text-xs text-blue-800 font-bold mb-4">مرحله ۲: تنظیم رکوردهای DNS در پنل دامنه</p>
                  <p className="text-[11px] text-blue-700 leading-6 mb-4">
                    وارد پنل مدیریت دامنه خود (مثل ایرنیک یا پنل شرکت ثبت‌کننده) شوید و رکوردهای زیر را تنظیم کنید:
                  </p>

                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-2xl border border-blue-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black text-gray-400">TYPE: A Record</span>
                        <span className="text-[10px] font-black text-blue-600">@ (Root)</span>
                      </div>
                      <code className="text-xs font-mono text-gray-900 block bg-gray-50 p-2 rounded-lg border border-gray-100 select-all">
                        75.2.60.5
                      </code>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-blue-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black text-gray-400">TYPE: CNAME</span>
                        <span className="text-[10px] font-black text-blue-600">www</span>
                      </div>
                      <code className="text-xs font-mono text-gray-900 block bg-gray-50 p-2 rounded-lg border border-gray-100 select-all">
                        nikjoo-marketplace.netlify.app
                      </code>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-blue-100">
                  <p className="text-xs text-blue-800 font-bold mb-4">مرحله ۳: فعال‌سازی SSL (HTTPS)</p>
                  <p className="text-[11px] text-blue-700 leading-6">
                    پس از تایید رکوردها (معمولاً ۱ تا ۲۴ ساعت)، در همان بخش Domain Management در Netlify، روی <strong>Verify DNS configuration</strong> کلیک کنید تا گواهی امنیتی SSL به صورت خودکار و رایگان فعال شود.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-100 rounded-3xl p-6">
               <div className="flex gap-4">
                  <span className="text-2xl">⚠️</span>
                  <p className="text-[10px] text-yellow-800 leading-6 font-bold">
                    نکته مهم: اگر از دامنه .ir استفاده می‌کنید، ممکن است تغییر DNS در سامانه ایرنیک تا ۲۴ ساعت زمان ببرد تا در کل اینترنت منتشر شود. صبور باشید!
                  </p>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LaunchGuide;
