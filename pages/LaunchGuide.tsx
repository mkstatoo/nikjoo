import React, { useState } from 'react';

interface LaunchGuideProps {
  onBack: () => void;
}

const LaunchGuide: React.FC<LaunchGuideProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'checklist' | 'domain' | 'env'>('checklist');

  return (
    <div className="pb-24 bg-gray-50 min-h-screen text-right" dir="rtl">
      <div className="p-4 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          <h2 className="text-lg font-black text-gray-900">داشبورد راه‌اندازی نیکجو</h2>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-6 py-8">
        <div className="flex bg-gray-200 p-1 rounded-2xl mb-8 overflow-x-auto scrollbar-hide">
          <button 
            onClick={() => setActiveTab('checklist')}
            className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black whitespace-nowrap transition-all ${activeTab === 'checklist' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
          >
            چک‌لیست فنی
          </button>
          <button 
            onClick={() => setActiveTab('env')}
            className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black whitespace-nowrap transition-all ${activeTab === 'env' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
          >
            کلیدهای API
          </button>
          <button 
            onClick={() => setActiveTab('domain')}
            className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black whitespace-nowrap transition-all ${activeTab === 'domain' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
          >
            دامنه و DNS
          </button>
        </div>

        {activeTab === 'checklist' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
             <div className="bg-[#12141d] p-8 rounded-[2.5rem] text-white shadow-2xl mb-6">
                <h3 className="text-xl font-black mb-2 text-red-500">وضعیت استقرار: نهایی</h3>
                <p className="text-[10px] text-gray-400 leading-6">تمامی سیستم‌های هوشمند (Moderation, Support AI) با موفقیت تست شده‌اند و آماده انتشار عمومی هستند.</p>
             </div>
             
             <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center justify-between">
                <span className="text-sm font-bold text-gray-900">سرویس پیامک (SMS.ir)</span>
                <span className="bg-green-100 text-green-700 text-[9px] px-3 py-1 rounded-full font-black">فعال</span>
             </div>
             <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center justify-between">
                <span className="text-sm font-bold text-gray-900">هوش مصنوعی (Gemini)</span>
                <span className="bg-green-100 text-green-700 text-[9px] px-3 py-1 rounded-full font-black">فعال</span>
             </div>
          </div>
        )}
        
        {activeTab === 'domain' && (
          <div className="bg-blue-50 p-8 rounded-[2.5rem] border border-blue-100 animate-in fade-in">
             <h3 className="font-black text-blue-900 mb-4 flex items-center gap-2">🌐 تنظیمات DNS</h3>
             <p className="text-xs text-blue-800 leading-6 mb-6">برای اتصال دامنه اختصاصی به Netlify، رکوردهای زیر را تنظیم کنید:</p>
             <div className="bg-white p-4 rounded-2xl border border-blue-200 overflow-x-auto">
                <code className="text-xs font-mono block text-gray-600 whitespace-nowrap">A Record: 75.2.60.5</code>
                <code className="text-xs font-mono block text-gray-600 whitespace-nowrap mt-2">CNAME: nikjoomarket.ir {"->"} your-site.netlify.app</code>
             </div>
          </div>
        )}

        {activeTab === 'env' && (
          <div className="bg-red-50 p-8 rounded-[2.5rem] border border-red-100 animate-in fade-in">
             <h3 className="font-black text-red-900 mb-4 flex items-center gap-2">🔑 متغیرهای محیطی</h3>
             <p className="text-xs text-red-800 leading-6 mb-4">اطمینان حاصل کنید که کلیدهای زیر در تنظیمات هاست (Environment Variables) تعریف شده‌اند:</p>
             <div className="space-y-2">
                <div className="bg-white p-3 rounded-xl border border-red-200 flex justify-between items-center">
                   <span className="text-[10px] font-black font-mono">API_KEY</span>
                   <span className="text-[10px] text-green-600 font-bold">تایید شده</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-red-200 flex justify-between items-center">
                   <span className="text-[10px] font-black font-mono">SMS_API_KEY</span>
                   <span className="text-[10px] text-green-600 font-bold">تایید شده</span>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LaunchGuide;