
import React, { useState } from 'react';
import { Listing } from '../types';

interface ListingDetailProps {
  listing: Listing;
  onBack: () => void;
  onChat: (sellerId: string) => void;
}

const ListingDetail: React.FC<ListingDetailProps> = ({ listing, onBack, onChat }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [showToast, setShowToast] = useState(false);

  const displayDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return dateStr;
    }
    return date.toLocaleDateString('fa-IR');
  };

  const getConditionLabel = (condition: string) => {
    const map: Record<string, string> = {
      'New': 'نو',
      'Used - Like New': 'در حد نو',
      'Used - Good': 'کارکرده تمیز',
      'Used - Fair': 'کارکرده معمولی'
    };
    return map[condition] || condition;
  };

  const handleShare = async () => {
    // ایجاد یک URL معتبر برای جلوگیری از خطای Invalid URL
    const url = window.location.href.startsWith('http') 
      ? window.location.href 
      : 'https://nikjoo.market/ad/' + listing.id;

    const shareData = {
      title: 'نیکجو - ' + listing.title,
      text: `آگهی "${listing.title}" را در نیکجو ببینید:\n`,
      url: url,
    };

    const copyToClipboardFallback = async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(`${shareData.text}${url}`);
        } else {
          // Legacy fallback for old browsers
          const textArea = document.createElement("textarea");
          textArea.value = `${shareData.text}${url}`;
          textArea.style.position = "fixed";
          textArea.style.left = "-9999px";
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } catch (err) {
        console.error('کپی انجام نشد:', err);
      }
    };

    try {
      // تلاش برای استفاده از سیستم اشتراک‌گذاری بومی
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await copyToClipboardFallback();
      }
    } catch (err) {
      // اگر اشتراک‌گذاری به هر دلیلی (مثل Permission یا URL) خطا داد، کپی انجام شود
      console.warn('Share API failed, using clipboard:', err);
      await copyToClipboardFallback();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-6 pb-40" dir="rtl">
      {/* پیام موقت (Toast) */}
      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-gray-900 text-white px-6 py-3 rounded-2xl text-xs font-black shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 flex items-center gap-2">
          <span>لینک آگهی کپی شد! 📋</span>
        </div>
      )}

      {/* هدر بالایی */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-red-700 transition-colors font-black text-sm"
        >
          <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          بازگشت
        </button>
        <div className="flex gap-3">
          <button 
            onClick={handleShare}
            className="p-2.5 bg-gray-50 rounded-2xl text-gray-500 hover:text-gray-900 transition-all border border-gray-100 active:scale-95 hover:bg-white hover:shadow-md"
            title="اشتراک‌گذاری"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {/* بخش تصاویر */}
        <div className="space-y-4">
          <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-gray-100 shadow-2xl relative border-4 border-white">
            <img 
              src={listing.images[activeImage]} 
              alt={listing.title} 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-[10px] font-black tracking-widest border border-white/20">
              {activeImage + 1} / {listing.images.length}
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-1">
            {listing.images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${activeImage === idx ? 'border-red-600 scale-95 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* اطلاعات آگهی */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-red-50 text-red-700 text-[10px] font-black px-3 py-1 rounded-full border border-red-100">
                {listing.category}
              </span>
              <span className="text-gray-400 text-[10px] font-bold">• {displayDate(listing.createdAt)}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 leading-tight">{listing.title}</h1>
            <p className="text-gray-500 text-sm font-bold flex items-center gap-2">
              <svg className="w-4 h-4 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {listing.location}
            </p>
          </div>

          <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 relative overflow-hidden group">
            <div className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-2">قیمت نهایی</div>
            <div className="text-4xl font-black text-red-700 tracking-tighter">
              {listing.price.toLocaleString()} <span className="text-lg font-bold mr-1">تومان</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-5 border border-gray-100 rounded-[2.5rem] bg-white shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-xl">
                <img src={listing.seller.avatar} alt={listing.seller.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-right">
                <p className="font-black text-gray-900">{listing.seller.name}</p>
                <p className="text-[10px] text-gray-400 font-bold mt-1">عضویت از {listing.seller.joinedDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-yellow-400 px-4 py-1.5 rounded-full text-white font-black text-xs">
              <span className="text-sm">★</span> {listing.seller.rating}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-5 bg-red-700 rounded-full"></div>
               <h3 className="text-lg font-black text-gray-900">توضیحات آگهی</h3>
            </div>
            <p className="text-gray-600 leading-8 text-sm font-medium whitespace-pre-wrap">
              {listing.description}
            </p>
          </div>

          {/* بخش مشخصات تکمیلی */}
          <div className="pt-6 border-t border-gray-50 space-y-6">
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-5 bg-gray-900 rounded-full"></div>
               <h3 className="text-lg font-black text-gray-900">مشخصات کالا</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl flex flex-col gap-1">
                <span className="text-[9px] text-gray-400 font-black uppercase">وضعیت</span>
                <span className="text-xs font-black text-gray-900">{getConditionLabel(listing.condition)}</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl flex flex-col gap-1">
                <span className="text-[9px] text-gray-400 font-black uppercase">دسته‌بندی</span>
                <span className="text-xs font-black text-gray-900">{listing.category}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {listing.tags.map(tag => (
                <span key={tag} className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-[10px] font-bold text-gray-600">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* دکمه‌های عملیاتی */}
          <div className="fixed bottom-20 left-4 right-4 z-40 flex gap-4 max-w-4xl mx-auto">
            <button 
              onClick={() => onChat(listing.seller.id)}
              className="flex-1 bg-red-700 hover:bg-red-800 text-white font-black py-5 rounded-[2.5rem] shadow-2xl transition-all transform active:scale-95 flex items-center justify-center gap-3 border-4 border-white"
            >
              چت با فروشنده
            </button>
            <button 
              onClick={() => window.location.href = `tel:09123456789`}
              className="w-16 bg-white hover:bg-gray-50 text-gray-900 rounded-[2.5rem] border-4 border-white shadow-2xl transition-all flex items-center justify-center"
            >
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
