
import React, { useState } from 'react';
import { MOCK_LISTINGS, MOCK_USERS } from '../constants';
import ListingCard from '../components/ListingCard';

interface ProfileMenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
}

interface ProfileProps {
  isLoggedIn: boolean;
  userPhone: string;
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
  isLoggedIn, 
  userPhone, 
  onLogin, 
  onLogout, 
  onNavigateToAbout, 
  onNavigateToSupport, 
  onAdClick, 
  onNavigateToPost, 
  onNavigateToLaunch,
  onNavigateToBookmarks
}) => {
  const [view, setView] = useState<'menu' | 'my-ads' | 'wallet'>('menu');
  const [userName, setUserName] = useState(isLoggedIn ? 'کاربر نیکجو' : 'مهمان');
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [myAds, setMyAds] = useState(MOCK_LISTINGS.filter(ad => ad.seller.id === MOCK_USERS[0].id));

  const menuItems: ProfileMenuItem[] = [
    { 
      id: 'launch-roadmap', 
      title: 'نقشه راه انتشار (چک‌لیست)', 
      icon: <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> 
    },
    { 
      id: 'my-ads', 
      title: 'مدیریت تمام آگهی‌ها', 
      icon: <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> 
    },
    { 
      id: 'support', 
      title: 'پشتیبانی آنلاین (هوشمند)', 
      icon: <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg> 
    },
    { 
      id: 'wallet', 
      title: 'کیف پول و پرداخت‌ها', 
      icon: <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg> 
    },
    { 
      id: 'bookmarks', 
      title: 'نشان‌ها', 
      icon: <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg> 
    },
    { 
      id: 'about', 
      title: 'درباره نیکجو', 
      icon: <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> 
    },
  ];

  const handleSaveProfile = () => {
    setUserName(tempName);
    setIsEditing(false);
  };

  const handleDeleteAd = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("آیا از حذف این آگهی اطمینان دارید؟ این عمل غیرقابل بازگشت است.")) {
      setMyAds(prev => prev.filter(ad => ad.id !== id));
      alert("آگهی با موفقیت حذف شد.");
    }
  };

  if (view === 'wallet') {
    return (
      <div className="pb-24 bg-white min-h-screen text-right" dir="rtl">
        <div className="p-4 flex items-center gap-3 border-b border-gray-100 bg-gray-50/50 sticky top-0 z-10">
          <button onClick={() => setView('menu')} className="p-1 hover:bg-white rounded-full transition-colors">
            <svg className="w-6 h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          <h2 className="text-lg font-black text-gray-900">کیف پول و پرداخت‌ها</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-32 px-10 text-center animate-in fade-in zoom-in duration-500">
           <div className="w-24 h-24 bg-blue-50 rounded-[40px] flex items-center justify-center mb-8 shadow-inner border-4 border-white rotate-3">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
           </div>
           <h3 className="text-xl font-black text-gray-900 mb-3 tracking-tighter">بخش مالی در حال آماده‌سازی است</h3>
           <p className="text-xs text-gray-400 leading-7 max-w-xs font-medium">
             این ویژگی به زودی فعال خواهد شد. شما قادر خواهید بود تمامی تراکنش‌ها، خرید بسته‌های آگهی و مدیریت دارایی‌های خود را مستقیماً در <span className="text-red-700 font-black">نیکجو</span> انجام دهید.
           </p>
           <button 
             onClick={() => setView('menu')}
             className="mt-10 px-8 py-3 bg-gray-900 text-white rounded-2xl font-black text-sm shadow-xl transition-all active:scale-95"
           >
             فهمیدم، بازگشت
           </button>
        </div>
      </div>
    );
  }

  if (view === 'my-ads') {
    return (
      <div className="pb-24 bg-white min-h-screen text-right" dir="rtl">
        <div className="p-4 flex items-center gap-3 border-b border-gray-100 bg-gray-50/50 sticky top-0 z-10">
          <button onClick={() => setView('menu')} className="p-1 hover:bg-white rounded-full transition-colors">
            <svg className="w-6 h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          <h2 className="text-lg font-black text-gray-900">مدیریت آگهی‌های من</h2>
        </div>
        <div className="flex flex-col">
          {myAds.length > 0 ? (
            myAds.map(ad => (
              <div key={ad.id} className="relative group">
                <ListingCard listing={ad} onClick={onAdClick} />
                <button 
                  onClick={(e) => handleDeleteAd(ad.id, e)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-red-50 text-red-700 p-2.5 rounded-xl border border-red-100 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 hover:text-white"
                  title="حذف آگهی"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            ))
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center px-10">
               <div className="text-5xl mb-4 opacity-20">📭</div>
               <p className="text-gray-400 font-bold mb-6">هنوز هیچ آگهی ثبت نکرده‌اید.</p>
               <button onClick={onNavigateToPost} className="bg-red-700 text-white px-8 py-3 rounded-2xl font-black text-sm shadow-xl shadow-red-100">ثبت اولین آگهی</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 bg-white min-h-screen text-right" dir="rtl">
      {/* Header Section */}
      <div className="bg-gray-50 pt-16 pb-12 px-6 border-b border-gray-100 relative">
        <div className="max-w-xl mx-auto flex flex-col items-center">
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center text-3xl shadow-2xl border-4 border-white overflow-hidden relative group">
              <img src={isLoggedIn ? MOCK_USERS[0].avatar : 'https://picsum.photos/seed/guest/200'} alt="" className="w-full h-full object-cover" />
              {/* Subtle Overlay Signature */}
              <div className="absolute inset-x-0 bottom-0 bg-black/40 backdrop-blur-sm py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                 <p className="text-[7px] text-white font-black text-center tracking-widest uppercase italic">Free for ever</p>
              </div>
            </div>
            {isLoggedIn && (
              <div className="absolute -top-2 -right-2 bg-green-500 text-white p-1.5 rounded-full border-4 border-white shadow-lg" title="شماره تایید شده">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            )}
          </div>

          <div className="text-center w-full">
            {!isLoggedIn ? (
              <div className="space-y-4">
                <h1 className="text-2xl font-black text-gray-900 tracking-tighter">به نیکجو خوش آمدید</h1>
                <p className="text-xs text-gray-400 font-medium">سریع، مطمئن و <span className="text-gray-900">رایگان برای همیشه</span></p>
                <button 
                  onClick={onLogin}
                  className="bg-red-700 text-white px-10 py-3 rounded-2xl font-black text-sm shadow-xl shadow-red-100 hover:bg-red-800 transition-all active:scale-95"
                >
                  ورود / ثبت‌نام
                </button>
              </div>
            ) : (
              <>
                {isEditing ? (
                  <div className="flex flex-col items-center gap-3">
                    <input 
                      autoFocus
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="text-2xl font-black text-center text-gray-900 border-b-2 border-red-700 outline-none bg-transparent px-2 py-1 w-full max-w-[250px]"
                    />
                    <div className="flex gap-2">
                      <button onClick={handleSaveProfile} className="bg-red-700 text-white px-4 py-1.5 rounded-lg text-sm font-bold">ذخیره</button>
                      <button onClick={() => { setIsEditing(false); setTempName(userName); }} className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded-lg text-sm font-bold">لغو</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1 mb-2">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tighter">{userName}</h1>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] italic opacity-50">Free for ever</p>
                  </div>
                )}
                <div className="flex flex-col items-center gap-1">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">
                    شماره: {userPhone} • نیکجو پلاس
                  </p>
                  <button onClick={onLogout} className="text-[9px] text-red-700 font-black mt-2 underline opacity-50 hover:opacity-100">خروج از حساب</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* NEW: My Recent Ads Section */}
      <div className="max-w-xl mx-auto py-8 px-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
             <div className="w-1 h-6 bg-red-700 rounded-full"></div>
             <h2 className="text-lg font-black text-gray-900">آگهی‌های اخیر شما</h2>
          </div>
          <button onClick={() => setView('my-ads')} className="text-xs font-bold text-red-700 hover:underline">مشاهده همه</button>
        </div>

        <div className="space-y-4">
          {myAds.length > 0 ? (
            myAds.slice(0, 3).map(ad => (
              <div key={ad.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:border-red-200 transition-all cursor-pointer group" onClick={() => onAdClick(ad.id)}>
                <div className="flex items-center p-3 gap-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                    <img src={ad.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-black text-gray-900 truncate mb-1">{ad.title}</h3>
                    <p className="text-xs text-gray-500 mb-2">{ad.price.toLocaleString()} تومان</p>
                    <div className="flex items-center gap-2">
                       <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                       <span className="text-[10px] font-bold text-gray-400">فعال در سایت</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 p-8 text-center">
               <p className="text-xs text-gray-400 font-bold mb-4 leading-6">تاکنون آگهی ثبت نکرده‌اید.</p>
               <button onClick={onNavigateToPost} className="bg-white text-gray-900 border border-gray-200 px-6 py-2 rounded-xl text-xs font-black shadow-sm">ثبت آگهی جدید</button>
            </div>
          )}
        </div>
      </div>

      {/* Menu List Section */}
      <div className="max-w-xl mx-auto border-t border-gray-50 pt-4">
        {menuItems.map((item) => (
          <div 
            key={item.id} 
            onClick={() => {
              if (item.id === 'my-ads') setView('my-ads');
              if (item.id === 'wallet') setView('wallet');
              if (item.id === 'about') onNavigateToAbout();
              if (item.id === 'support') onNavigateToSupport();
              if (item.id === 'launch-roadmap') onNavigateToLaunch();
              if (item.id === 'bookmarks') onNavigateToBookmarks();
            }}
            className="flex items-center justify-between p-5 hover:bg-gray-50 cursor-pointer transition-colors active:scale-[0.99] group"
          >
            <div className="flex items-center gap-4">
              <span className="shrink-0 transition-colors group-hover:text-red-700">{item.icon}</span>
              <span className={`text-sm font-bold ${item.id === 'launch-roadmap' ? 'text-red-700' : 'text-gray-800'}`}>{item.title}</span>
            </div>
            <svg className="w-4 h-4 text-gray-300 group-hover:text-red-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
            </svg>
          </div>
        ))}
      </div>
      
      {/* Brand Watermark Footer */}
      <div className="py-12 flex flex-col items-center gap-2 opacity-10 grayscale select-none mt-auto">
         <p className="text-[10px] font-black tracking-[0.5em] uppercase italic">Free for ever</p>
         <div className="w-1 h-1 bg-gray-900 rounded-full"></div>
      </div>
    </div>
  );
};

export default Profile;
