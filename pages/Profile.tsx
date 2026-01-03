
import React, { useState, useMemo, useEffect } from 'react';
import { User, Banner, Listing, UserNotification } from '../types';
import ListingCard from '../components/ListingCard';
import { db } from '../services/db';

interface ProfileProps {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
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

const ITEMS_PER_PAGE = 10;
const AVATAR_PRESETS = [
  'https://picsum.photos/seed/1/200',
  'https://picsum.photos/seed/2/200',
  'https://picsum.photos/seed/3/200',
  'https://picsum.photos/seed/4/200',
  'https://picsum.photos/seed/5/200',
  'https://picsum.photos/seed/auth/200',
];

const Profile: React.FC<ProfileProps> = ({ 
  currentUser, 
  setCurrentUser,
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
  const [view, setView] = useState<'menu' | 'admin-users' | 'admin-banners' | 'my-ads' | 'security' | 'edit-profile' | 'notifications'>('menu');
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Edit Profile States
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editAvatar, setEditAvatar] = useState(currentUser?.avatar || '');

  const [statusFilter, setStatusFilter] = useState<Listing['status'] | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (view === 'notifications') {
      db.getNotifications().then(setNotifications);
    }
  }, [view]);

  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name);
      setEditAvatar(currentUser.avatar);
    }
  }, [currentUser]);

  const myAds = useMemo(() => {
    let ads = allListings.filter(l => l.seller.id === currentUser?.id);
    if (statusFilter !== 'all') ads = ads.filter(a => a.status === statusFilter);
    return ads;
  }, [allListings, currentUser, statusFilter]);

  const handleSaveProfile = async () => {
    if (!currentUser) return;
    setIsUpdating(true);
    const updated = await db.updateUser(currentUser.id, { name: editName, avatar: editAvatar });
    if (updated) {
      setCurrentUser(updated);
      setView('menu');
      alert('پروفایل با موفقیت بروزرسانی شد.');
    }
    setIsUpdating(false);
  };

  const handleAccountDeletion = async () => {
    if (window.confirm("آیا از حذف کامل حساب کاربری و تمامی آگهی‌های خود اطمینان دارید؟ این عمل غیرقابل بازگشت است.")) {
      if (currentUser) {
        await db.deleteUser(currentUser.id);
        onLogout();
        alert("حساب شما با موفقیت حذف شد.");
      }
    }
  };

  if (view === 'notifications') {
    return (
      <div className="pb-24 bg-white min-h-screen text-right animate-in fade-in slide-in-from-left-4 duration-300" dir="rtl">
        <div className="p-4 flex items-center gap-3 border-b border-gray-100 bg-white sticky top-0 z-10 shadow-sm">
          <button onClick={() => setView('menu')} className="p-1"><svg className="w-6 h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2.5"/></svg></button>
          <h2 className="text-lg font-black text-gray-900">اعلان‌ها</h2>
        </div>
        <div className="p-4 space-y-4">
          {notifications.length > 0 ? (
            notifications.map(n => (
              <div key={n.id} className={`p-5 rounded-[2rem] border transition-all ${n.isRead ? 'bg-white border-gray-100' : 'bg-red-50/30 border-red-100 shadow-sm'}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${n.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                    {n.type === 'success' ? '✅' : '🔔'}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-sm font-black text-gray-900">{n.title}</h4>
                      <span className="text-[9px] text-gray-400 font-bold">{n.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-6">{n.message}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center text-gray-300 font-black">اعلانی وجود ندارد</div>
          )}
        </div>
      </div>
    );
  }

  if (view === 'edit-profile') {
    return (
      <div className="pb-24 bg-white min-h-screen text-right animate-in fade-in slide-in-from-right-4 duration-300" dir="rtl">
        <div className="p-4 flex items-center gap-3 border-b border-gray-100 bg-white sticky top-0 z-10 shadow-sm">
          <button onClick={() => setView('menu')} className="p-1"><svg className="w-6 h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2.5"/></svg></button>
          <h2 className="text-lg font-black text-gray-900">ویرایش حساب کاربری</h2>
        </div>
        <div className="p-6 space-y-8 max-w-xl mx-auto">
          <div className="flex flex-col items-center gap-6">
            <div className="relative group">
              <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl bg-gray-100">
                <img src={editAvatar} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-red-700 text-white p-2 rounded-xl shadow-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeWidth="2"/><path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2"/></svg>
              </div>
            </div>
            
            <div className="w-full">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-2">نام نمایشی</label>
              <input 
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-red-700 focus:bg-white rounded-[1.5rem] px-6 py-4 text-sm font-black text-gray-900 outline-none transition-all"
                placeholder="نام خود را وارد کنید"
              />
            </div>

            <div className="w-full">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4 px-2">انتخاب تصویر پروفایل</label>
              <div className="grid grid-cols-3 gap-4">
                {AVATAR_PRESETS.map((p, i) => (
                  <button 
                    key={i}
                    onClick={() => setEditAvatar(p)}
                    className={`aspect-square rounded-2xl overflow-hidden border-4 transition-all ${editAvatar === p ? 'border-red-700 scale-105 shadow-lg' : 'border-white bg-gray-50 opacity-60 hover:opacity-100'}`}
                  >
                    <img src={p} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={handleSaveProfile}
            disabled={isUpdating || !editName.trim()}
            className="w-full bg-red-700 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-red-100 active:scale-95 transition-all disabled:opacity-50 mt-4"
          >
            {isUpdating ? 'در حال ثبت...' : 'ذخیره تغییرات'}
          </button>
        </div>
      </div>
    );
  }

  if (view === 'security') {
    return (
      <div className="pb-24 bg-white min-h-screen text-right animate-in fade-in slide-in-from-bottom-4 duration-300" dir="rtl">
        <div className="p-4 flex items-center gap-3 border-b border-gray-100 bg-white sticky top-0 z-10 shadow-sm">
          <button onClick={() => setView('menu')} className="p-1"><svg className="w-6 h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2.5"/></svg></button>
          <h2 className="text-lg font-black text-gray-900">امنیت و حریم خصوصی</h2>
        </div>
        <div className="p-6 space-y-6">
           <div className="bg-red-50 p-6 rounded-[2rem] border border-red-100">
              <h3 className="text-red-700 font-black text-sm mb-2">حذف حساب کاربری</h3>
              <p className="text-[10px] text-red-600 font-bold leading-6 mb-6">با حذف حساب، تمامی آگهی‌ها، نشان‌ها و اطلاعات شما برای همیشه از سرورهای نیکجو پاک خواهد شد.</p>
              <button 
                onClick={handleAccountDeletion}
                className="w-full bg-red-700 text-white font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all"
              >
                حذف دائمی حساب کاربری
              </button>
           </div>
        </div>
      </div>
    );
  }

  if (view === 'menu') {
    return (
      <div className="pb-24 bg-white min-h-screen text-right animate-in fade-in duration-500" dir="rtl">
        <div className="bg-gray-50 pt-20 pb-12 px-6 border-b border-gray-100">
          <div className="max-w-xl mx-auto flex flex-col items-center">
            <div className="relative mb-6">
              <div className="w-28 h-28 bg-white rounded-[32px] shadow-2xl border-4 border-white overflow-hidden group">
                <img src={currentUser ? currentUser.avatar : 'https://picsum.photos/seed/guest/200'} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              </div>
              {currentUser && (
                <button 
                  onClick={() => setView('edit-profile')}
                  className="absolute bottom-0 -right-2 bg-white text-gray-900 p-2.5 rounded-2xl shadow-xl border border-gray-100 active:scale-90 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              )}
            </div>
            {currentUser ? (
              <div className="text-center">
                <h1 className="text-2xl font-black text-gray-900 tracking-tighter">{currentUser.name}</h1>
                <p className="text-[10px] font-black text-gray-400 mt-2 uppercase tracking-widest">{currentUser.role === 'admin' ? '🛡️ مدیر سیستم' : 'کاربر ویژه نیکجو'}</p>
                <div className="flex gap-4 mt-6">
                  <button onClick={() => setView('edit-profile')} className="bg-white border border-gray-200 text-gray-700 px-6 py-2 rounded-xl text-[10px] font-black shadow-sm active:scale-95 transition-all">ویرایش حساب</button>
                  <button onClick={onLogout} className="bg-red-50 text-red-700 border border-red-100 px-6 py-2 rounded-xl text-[10px] font-black shadow-sm active:scale-95 transition-all">خروج</button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <h2 className="text-lg font-black text-gray-900 mb-4">به نیکجو خوش آمدید</h2>
                <button onClick={onLogin} className="bg-red-700 text-white px-10 py-3.5 rounded-2xl font-black text-xs shadow-lg shadow-red-100 active:scale-95 transition-all">ورود / ثبت‌نام</button>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-xl mx-auto py-8 px-4 space-y-3">
          {currentUser && (
            <>
              <div onClick={() => setView('my-ads')} className="flex items-center justify-between p-6 bg-red-700 text-white rounded-[2.5rem] cursor-pointer hover:bg-red-800 transition-all shadow-xl shadow-red-100">
                 <div className="flex items-center gap-4">
                   <span className="text-xl">📋</span>
                   <span className="text-sm font-black">آگهی‌های من</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <span className="bg-white/20 text-white text-[10px] font-black px-3 py-1 rounded-full">{myAds.length}</span>
                   <svg className="w-5 h-5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="3" strokeLinecap="round"/></svg>
                 </div>
              </div>

              <div onClick={() => setView('notifications')} className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-[2.5rem] hover:bg-gray-50 cursor-pointer transition-all">
                <div className="flex items-center gap-4">
                   <span className="text-xl">🔔</span>
                   <span className="text-sm font-black text-gray-800">اعلان‌ها</span>
                </div>
                <div className="flex items-center gap-2">
                   <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse"></span>
                   <svg className="w-5 h-5 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="3" strokeLinecap="round"/></svg>
                </div>
              </div>
              
              <div onClick={() => setView('security')} className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-[2.5rem] hover:bg-gray-50 cursor-pointer transition-all">
                <div className="flex items-center gap-4">
                   <span className="text-xl">🔒</span>
                   <span className="text-sm font-black text-gray-800">امنیت و حریم خصوصی</span>
                </div>
                <svg className="w-5 h-5 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="3" strokeLinecap="round"/></svg>
              </div>
            </>
          )}

          {/* ... admin options and other menu items ... */}
          {[
            { label: 'نشان‌ها و ذخیره‌شده‌ها', icon: '🔖', action: onNavigateToBookmarks },
            { label: 'پشتیبانی هوشمند (AI)', icon: '🤖', action: onNavigateToSupport },
            { label: 'درباره نیکجو مارکت', icon: '🏢', action: onNavigateToAbout },
          ].map((item, idx) => (
            <div key={idx} onClick={item.action} className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-[2rem] hover:bg-gray-50 cursor-pointer transition-all">
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
  }

  return null;
};

export default Profile;
