
import React, { useState } from 'react';
import { Listing } from '../types';
import { CONDITION_MAP } from '../constants';

interface ListingDetailProps {
  listing: Listing;
  isAdmin?: boolean;
  onAdminDelete?: () => void;
  onBack: () => void;
  onChat: (sellerId: string) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
}

const ListingDetail: React.FC<ListingDetailProps> = ({ 
  listing, 
  isAdmin,
  onAdminDelete,
  onBack, 
  onChat, 
  isBookmarked = false, 
  onToggleBookmark 
}) => {
  const [activeImage, setActiveImage] = useState(0);

  const handleShare = async () => {
    let shareUrl = window.location.href;
    try {
      const url = new URL(shareUrl);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        shareUrl = `${window.location.origin}${window.location.pathname}?id=${listing.id}`;
      }
    } catch (e) {
      shareUrl = window.location.origin;
    }

    const shareData = {
      title: listing.title,
      text: `آگهی "${listing.title}" را در نیکجو ببینید:`,
      url: shareUrl
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert('لینک آگهی در حافظه کپی شد.');
      }
    } catch (error) {
      console.error('Share failed');
    }
  };

  const handleReport = () => {
    const reason = window.prompt("علت گزارش تخلف چیست؟ (کلاهبرداری، محتوای نامناسب، قیمت غیر واقعی و ...)");
    if (reason) {
      alert("گزارش شما با موفقیت ثبت شد و توسط تیم نظارت بررسی خواهد شد. ممنون از همکاری شما.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-6 pb-40" dir="rtl">
      {isAdmin && (
        <div className="mb-6 bg-red-50 border border-red-200 p-4 rounded-3xl flex justify-between items-center animate-in slide-in-from-top-4 duration-500">
           <div className="flex items-center gap-2">
              <span className="text-lg">🛡️</span>
              <span className="text-xs font-black text-red-800">پنل مدیریت: این آگهی را بررسی کنید.</span>
           </div>
           <button 
             onClick={onAdminDelete}
             className="bg-red-700 text-white px-4 py-2 rounded-xl text-[10px] font-black hover:bg-red-800 transition-colors"
           >
             حذف فوری آگهی
           </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 font-black text-sm">
          <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeWidth="2.5"/></svg>
          بازگشت
        </button>
        <div className="flex gap-3">
          <button 
            onClick={handleReport}
            className="p-2.5 rounded-2xl border bg-gray-50 text-gray-400 hover:text-red-700 hover:bg-red-50 transition-all"
            title="گزارش تخلف"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </button>
          <button 
            onClick={handleShare}
            className="p-2.5 rounded-2xl border bg-gray-50 text-gray-500 hover:text-red-700 hover:bg-red-50 transition-all"
            title="اشتراک‌گذاری"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
          <button onClick={onToggleBookmark} className={`p-2.5 rounded-2xl border transition-all ${isBookmarked ? 'bg-red-700 text-white shadow-md border-red-700' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
            <svg className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" strokeWidth="2"/></svg>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-gray-100 shadow-xl border-4 border-white">
          <img src={listing.images[activeImage]} alt="" className="w-full h-full object-cover" />
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 leading-tight">{listing.title}</h1>
            <p className="text-gray-500 text-sm font-bold">{listing.location}</p>
          </div>

          <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
            <div className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-2">قیمت نهایی</div>
            <div className="text-4xl font-black text-red-700">{listing.price.toLocaleString()} <span className="text-lg">تومان</span></div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-black text-gray-900">توضیحات آگهی</h3>
            <p className="text-gray-600 leading-8 text-sm font-medium">{listing.description}</p>
          </div>
          
          <div className="fixed bottom-20 left-4 right-4 z-40 flex gap-4 max-w-4xl mx-auto">
            <button 
              onClick={() => onChat(listing.seller.id)}
              className="flex-1 bg-red-700 text-white font-black py-5 rounded-[2.5rem] shadow-2xl border-4 border-white"
            >
              چت با فروشنده
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;