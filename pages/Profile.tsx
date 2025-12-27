
import React, { useState } from 'react';
import { User, Banner, Listing } from '../types';
import ListingCard from '../components/ListingCard';

interface ProfileProps {
  currentUser: User | null;
  allListings: Listing[];
  banners: Banner[];
  setBanners: React.Dispatch<React.SetStateAction<Banner[]>>;
  onLogin: () => void;
  onLogout: () => void;
  onNavigateToAbout: () => void;
  onNavigateToSupport: () => void;
  onAdClick: (id: string) => void;
  onNavigateToPost: () => void;
  onNavigateToLaunch: () => void;
  onNavigateToBookmarks: () => void;
}

const Profile: React.FC<ProfileProps> = ({ 
  currentUser, 
  allListings,
  banners,
  setBanners,
  onLogin, 
  onLogout, 
  onNavigateToAbout, 
  onNavigateToSupport, 
  onAdClick, 
  onNavigateToPost, 
  onNavigateToLaunch,
  onNavigateToBookmarks
}) => {
  const [view, setView] = useState<'menu' | 'admin-users' | 'admin-banners' | 'my-ads'>('menu');
  
  // Banner Form State
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [bannerForm, setBannerForm] = useState<Partial<Banner>>({
    name: '',
    imageUrl: '',
    price: 0,
    position: 3,
    link: '#',
    title: ''
  });

  const isAdmin = currentUser?.role === 'admin';
  const myAds = allListings.filter(l => l.seller.id === currentUser?.id);

  const openAddBanner = () => {
    setEditingBanner(null);
    setBannerForm({ name: '', imageUrl: '', price: 0, position: 3, link: '#', title: '' });
    setShowBannerModal(true);
  };

  const openEditBanner = (banner: Banner) => {
    setEditingBanner(banner);
    setBannerForm(banner);
    setShowBannerModal(true);
  };

  const handleSaveBanner = () => {
    if (!bannerForm.name || !bannerForm.imageUrl || !bannerForm.title) {
      alert("لطفاً تمام فیلدهای ستاره‌دار را تکمیل کنید.");
      return;
    }

    if (editingBanner) {
      setBanners(prev => prev.map(b => b.id === editingBanner.id ? { ...b, ...bannerForm } as Banner : b));
    } else {
      const newBanner: Banner = {
        id: 'b' + Date.now(),
        name: bannerForm.name!,
        imageUrl: bannerForm.imageUrl!,
        price: Number(bannerForm.price) || 0,
        position: Number(bannerForm.position) || 3,
        link: bannerForm.link || '#',
        title: bannerForm.title!
      };
      setBanners(prev => [...prev, newBanner]);
    }
    setShowBannerModal(false);
  };

  if (view === 'my-ads') {
    return (
      <div className="pb-24 bg-white min-h-screen text-right" dir="rtl">
        <div className="p-4 flex items-center gap-3 border-b border-gray-100 bg-white sticky top-0 z-10">
          <button onClick={() => setView('menu')} className="p-1"><svg className="w-6 h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2.5"/></svg></button>
          <h2 className="text-lg font-black text-gray-900">آگهی‌های من ({myAds.length})</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {myAds.length > 0 ? (
            myAds.map(ad => <ListingCard key={ad.id} listing={ad} onClick={onAdClick} />)
          ) : (
            <div className="py-20 text-center px-10">
               <p className="text-gray-400 font-bold mb-6">شما هنوز هیچ آگهی ثبت نکرده‌اید.</p>
               <button onClick={onNavigateToPost} className="bg-red-700 text-white px-8 py-3 rounded-2xl font-black text-xs">ثبت اولین آگهی</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (view === 'admin-banners') {
    return (
      <div className="pb-24 bg-white min-h-screen text-right" dir="rtl">
        <div className="p-4 flex items-center justify-between border-b border-gray-100 bg-red-50/30 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button onClick={() => setView('menu')} className="p-1"><svg className="w-6 h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2.5"/></svg></button>
            <h2 className="text-lg font-black text-gray-900">مدیریت تبلیغات</h2>
          </div>
          <button onClick={openAddBanner} className="bg-red-700 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black shadow-lg active:scale-95 transition-all">ایجاد بنر جدید</button>
        </div>

        <div className="p-6 space-y-6">
           {banners.map(banner => (
             <div key={banner.id} className="relative rounded-[2.5rem] overflow-hidden shadow-xl h-48 border-4 border-white group bg-gray-100 flex items-center justify-center">
                {banner.imageUrl ? (
                  <img 
                    src={banner.imageUrl} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                    alt={banner.title} 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/800x400/e2e8f0/94a3b8?text=تصویر+یافت+نشد';
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-300">
                     <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="1.5"/></svg>
                     <span className="text-[10px] font-black uppercase tracking-widest">بدون تصویر</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-6 flex flex-col justify-end">
                   <p className="text-white font-black text-lg">{banner.title}</p>
                   <p className="text-[10px] text-white/60 mb-3">{banner.name} • قیمت: {banner.price.toLocaleString()} تومان</p>
                   <div className="flex justify-between items-center">
                      <p className="text-[10px] text-white/70 font-bold">نمایش بعد از آگهی {banner.position}</p>
                      <div className="flex gap-2">
                        <button onClick={() => openEditBanner(banner)} className="bg-white/20 backdrop-blur-md text-white p-2.5 rounded-2xl hover:bg-white hover:text-gray-900 transition-all border border-white/20">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeWidth="2.5"/></svg>
                        </button>
                        <button onClick={() => { if(window.confirm("حذف بنر؟")) setBanners(prev => prev.filter(b => b.id !== banner.id)); }} className="bg-red-700/80 backdrop-blur-md text-white p-2.5 rounded-2xl hover:bg-red-700 transition-all border border-white/20">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7" strokeWidth="2.5"/></svg>
                        </button>
                      </div>
                   </div>
                </div>
             </div>
           ))}
        </div>

        {showBannerModal && (
          <div className="fixed inset-0 z-[150] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-xl rounded-[3rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300 my-8">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-black text-gray-900">{editingBanner ? 'ویرایش بنر تبلیغاتی' : 'ایجاد بنر جدید'}</h3>
                    <button onClick={() => setShowBannerModal(false)} className="text-gray-400 hover:text-red-700 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" strokeLinecap="round"/></svg>
                    </button>
                </div>

                <div className="space-y-6">
                  {/* Banner Internal Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">نام داخلی بنر (برای ادمین) *</label>
                    <input 
                      type="text" 
                      value={bannerForm.name} 
                      onChange={e => setBannerForm({...bannerForm, name: e.target.value})} 
                      className="w-full bg-gray-50 p-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-red-700 transition-all text-sm font-bold" 
                      placeholder="مثلاً: جشنواره عیدانه - سایدبار" 
                    />
                  </div>

                  {/* Banner Title (On Image) */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">متن روی بنر (عنوان نمایشی) *</label>
                    <input 
                      type="text" 
                      value={bannerForm.title} 
                      onChange={e => setBannerForm({...bannerForm, title: e.target.value})} 
                      className="w-full bg-gray-50 p-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-red-700 transition-all text-sm font-bold" 
                      placeholder="مثلاً: ۵۰٪ تخفیف محصولات دیجیتال" 
                    />
                  </div>

                  {/* Image URL */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">آدرس تصویر بنر (URL) *</label>
                    <input 
                      type="text" 
                      value={bannerForm.imageUrl} 
                      onChange={e => setBannerForm({...bannerForm, imageUrl: e.target.value})} 
                      className="w-full bg-gray-50 p-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-red-700 transition-all text-sm font-bold text-left" 
                      dir="ltr"
                      placeholder="https://example.com/banner.jpg" 
                    />
                  </div>

                  {/* Price and Position Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">قیمت اجاره (تومان)</label>
                      <input 
                        type="number" 
                        value={bannerForm.price} 
                        onChange={e => setBannerForm({...bannerForm, price: Number(e.target.value)})} 
                        className="w-full bg-gray-50 p-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-red-700 transition-all text-sm font-bold" 
                        placeholder="مثلاً: ۵۰۰۰۰۰" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">موقعیت نمایش (بعد از آگهی X)</label>
                      <input 
                        type="number" 
                        value={bannerForm.position} 
                        onChange={e => setBannerForm({...bannerForm, position: Number(e.target.value)})} 
                        className="w-full bg-gray-50 p-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-red-700 transition-all text-sm font-bold" 
                        placeholder="مثلاً: ۳" 
                      />
                    </div>
                  </div>

                  {/* Link Destination */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">لینک مقصد بنر (URL)</label>
                    <input 
                      type="text" 
                      value={bannerForm.link} 
                      onChange={e => setBannerForm({...bannerForm, link: e.target.value})} 
                      className="w-full bg-gray-50 p-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-red-700 transition-all text-sm font-bold text-left" 
                      dir="ltr"
                      placeholder="#" 
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-6">
                    <button 
                      onClick={handleSaveBanner} 
                      className="flex-1 bg-red-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-red-100 active:scale-95 transition-all"
                    >
                      ذخیره اطلاعات بنر
                    </button>
                    <button 
                      onClick={() => setShowBannerModal(false)} 
                      className="flex-1 bg-gray-100 text-gray-500 font-black py-4 rounded-2xl active:scale-95 transition-all"
                    >
                      انصراف
                    </button>
                  </div>
                </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="pb-24 bg-white min-h-screen text-right" dir="rtl">
      {/* Profile Header */}
      <div className="bg-gray-50 pt-20 pb-12 px-6 border-b border-gray-100">
        <div className="max-w-xl mx-auto flex flex-col items-center">
          <div className="w-24 h-24 bg-white rounded-[32px] shadow-xl border-4 border-white overflow-hidden mb-6">
            <img src={currentUser ? currentUser.avatar : 'https://picsum.photos/seed/guest/200'} alt="" className="w-full h-full object-cover" />
          </div>
          {currentUser ? (
            <div className="text-center">
              <h1 className="text-2xl font-black text-gray-900 tracking-tighter">{currentUser.name}</h1>
              <p className="text-[10px] font-black text-gray-400 mt-2 uppercase tracking-widest">{currentUser.role === 'admin' ? '🛡️ مدیر سیستم' : 'کاربر ویژه نیکجو'}</p>
              <button onClick={onLogout} className="text-[9px] text-red-700 font-black mt-6 hover:underline">خروج از حساب</button>
            </div>
          ) : (
            <button onClick={onLogin} className="bg-red-700 text-white px-10 py-3.5 rounded-2xl font-black text-xs">ورود / ثبت‌نام</button>
          )}
        </div>
      </div>

      <div className="max-w-xl mx-auto py-10 px-4 space-y-3">
        {currentUser && (
          <div onClick={() => setView('my-ads')} className="flex items-center justify-between p-6 bg-red-50/50 border border-red-100 rounded-[2rem] cursor-pointer hover:bg-red-50">
             <div className="flex items-center gap-4">
               <span className="text-xl">📋</span>
               <span className="text-sm font-black text-gray-800">آگهی‌های من</span>
             </div>
             <span className="bg-red-700 text-white text-[10px] font-black px-3 py-1 rounded-full">{myAds.length}</span>
          </div>
        )}

        {isAdmin && (
          <div className="grid grid-cols-2 gap-4 pb-6">
             <button onClick={() => setView('admin-banners')} className="p-8 bg-gray-900 text-white rounded-[2.5rem] flex flex-col items-center gap-2">
                <span className="text-2xl">📢</span>
                <span className="text-[10px] font-black uppercase">تبلیغات</span>
             </button>
             <button onClick={onNavigateToLaunch} className="p-8 bg-red-700 text-white rounded-[2.5rem] flex flex-col items-center gap-2">
                <span className="text-2xl">🚀</span>
                <span className="text-[10px] font-black uppercase">لانچ</span>
             </button>
          </div>
        )}

        {[
          { label: 'نشان‌ها و ذخیره‌شده‌ها', icon: '🔖', action: onNavigateToBookmarks },
          { label: 'پشتیبانی هوشمند (AI)', icon: '🤖', action: onNavigateToSupport },
          { label: 'درباره نیکجو مارکت', icon: '🏢', action: onNavigateToAbout },
        ].map((item, idx) => (
          <div key={idx} onClick={item.action} className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-[2rem] hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center gap-4">
               <span className="text-xl">{item.icon}</span>
               <span className="text-sm font-black text-gray-800">{item.label}</span>
            </div>
            <svg className="w-5 h-5 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="3" strokeLinecap="round"/></svg>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
