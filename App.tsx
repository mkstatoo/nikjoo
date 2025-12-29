
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ListingDetail from './pages/ListingDetail';
import PostAd from './pages/PostAd';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import About from './pages/About';
import LocationSelector from './pages/LocationSelector';
import LaunchGuide from './pages/LaunchGuide';
import AuthModal from './components/AuthModal';
import Bookmarks from './pages/Bookmarks';
import Legal from './pages/Legal';
import { MOCK_LISTINGS, MOCK_USERS, MOCK_BANNERS } from './constants';
import { User, Listing, Banner, SavedSearch } from './types';
import { db } from './services/db';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isSplashActive, setIsSplashActive] = useState(true);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [selectedLocations, setSelectedLocations] = useState<string[]>(['تهران']);
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [initialChatTab, setInitialChatTab] = useState<'my' | 'ai'>('my');
  const [searchQuery, setSearchQuery] = useState('');
  const [legalInitialTab, setLegalInitialTab] = useState<'tos' | 'privacy'>('tos');
  const [logoError, setLogoError] = useState(false);
  
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('nikjoo_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(!!currentUser);
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(() => {
    const saved = localStorage.getItem('nikjoo_alerts');
    return saved ? JSON.parse(saved) : [];
  });
  const [banners, setBanners] = useState<Banner[]>(() => {
    const saved = localStorage.getItem('nikjoo_banners');
    return saved ? JSON.parse(saved) : MOCK_BANNERS;
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [listings, bookmarks] = await Promise.all([
          db.getListings(),
          db.getBookmarks()
        ]);
        setAllListings(listings);
        setBookmarkedIds(bookmarks);
      } catch (err) {
        console.error("Error loading initial data:", err);
      } finally {
        // حداقل 2 ثانیه نمایش اسپلش برای زیبایی
        setTimeout(() => setIsSplashActive(false), 2000);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    localStorage.setItem('nikjoo_alerts', JSON.stringify(savedSearches));
  }, [savedSearches]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('nikjoo_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('nikjoo_user');
    }
  }, [currentUser]);

  const toggleBookmark = async (id: string) => {
    const updated = await db.toggleBookmark(id);
    setBookmarkedIds(updated);
  };

  const handleAddAlert = (query: string) => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    if (savedSearches.length >= 3) {
      alert("⚠️ محدودیت: شما حداکثر ۳ هشدار فعال می‌توانید داشته باشید.");
      return;
    }
    const newAlert: SavedSearch = {
      id: 'a' + Date.now(),
      query: query || 'همه آگهی‌ها',
      location: selectedLocations[0] || 'سراسر ایران',
      createdAt: 'امروز'
    };
    setSavedSearches([newAlert, ...savedSearches]);
    alert("✅ هشدار جستجو فعال شد.");
  };

  const handleRemoveAlert = (id: string) => {
    setSavedSearches(prev => prev.filter(s => s.id !== id));
  };

  const navigateTo = (page: string, options?: { chatTab?: 'my' | 'ai', forceAuth?: boolean, legalTab?: 'tos' | 'privacy' }) => {
    if (options?.forceAuth && !isLoggedIn) {
      setPendingAction({ page, options: { ...options, forceAuth: false } });
      setShowAuthModal(true);
      return;
    }
    if (options?.chatTab) setInitialChatTab(options.chatTab);
    if (options?.legalTab) setLegalInitialTab(options.legalTab);
    setCurrentPage(page);
    setSelectedListingId(null);
    window.scrollTo(0, 0);
  };

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<{page: string, options?: any} | null>(null);

  const handleAuthSuccess = (phone: string) => {
    const foundUser = MOCK_USERS.find(u => u.phone === phone) || {
       id: 'u_' + Date.now(),
       name: phone === '09120000000' ? 'مدیر سیستم' : 'کاربر جدید',
       avatar: `https://picsum.photos/seed/${phone}/100/100`,
       joinedDate: 'اسفند ۱۴۰۳',
       rating: 5.0,
       role: phone === '09120000000' ? 'admin' : 'user',
       phone,
       isVerified: true,
       preferences: { viewMode: 'list', theme: 'light', notifications: true }
    };
    setCurrentUser(foundUser as User);
    setIsLoggedIn(true);
    if (pendingAction) {
      navigateTo(pendingAction.page, pendingAction.options);
      setPendingAction(null);
    }
  };

  const handleListingClick = async (id: string) => {
    await db.incrementView(id);
    setAllListings(prev => prev.map(l => l.id === id ? { ...l, views: (l.views || 0) + 1 } : l));
    setSelectedListingId(id);
    setCurrentPage('detail');
    window.scrollTo(0, 0);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      await db.addSearchQuery(query);
    }
  };

  if (isSplashActive) {
    return (
      <div className="fixed inset-0 z-[300] bg-white flex flex-col items-center justify-center overflow-hidden">
        <div className="relative flex flex-col items-center animate-in fade-in zoom-in-95 duration-700">
           
           <div className="w-32 h-32 mb-8 animate-logo flex items-center justify-center">
             {!logoError ? (
               <img 
                 src="logo.png" 
                 alt="Nikjoo Logo" 
                 className="w-full h-full object-contain"
                 onError={() => setLogoError(true)}
               />
             ) : (
               <div className="w-full h-full bg-red-700 rounded-[2rem] flex items-center justify-center shadow-2xl">
                 <span className="text-white text-5xl font-black">N</span>
               </div>
             )}
           </div>

           <h1 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">نیکجو مارکت</h1>
           
           <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
           </div>
           
           <p className="fixed bottom-12 text-[9px] font-black text-gray-300 tracking-[0.4em] uppercase">Powered by Gemini AI</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {(currentPage === 'home' || currentPage === 'bookmarks') && (
        <Navbar 
          onLocationClick={() => setShowLocationSelector(true)} 
          selectedLocations={selectedLocations} 
          searchQuery={searchQuery}
          onSearchChange={handleSearch}
        />
      )}
      
      {showLocationSelector && (
        <LocationSelector 
          initialSelected={selectedLocations}
          onConfirm={(sel) => { setSelectedLocations(sel); setShowLocationSelector(false); }} 
          onBack={() => setShowLocationSelector(false)} 
        />
      )}

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => { setShowAuthModal(false); setPendingAction(null); }}
        onSuccess={handleAuthSuccess}
        onNavigateToLegal={(tab) => { setShowAuthModal(false); navigateTo('legal', { legalTab: tab }); }}
      />

      <main className="flex-1 overflow-x-hidden">
        {(() => {
          switch (currentPage) {
            case 'home':
              return <Home 
                listings={allListings}
                banners={banners}
                onListingClick={handleListingClick} 
                selectedLocations={selectedLocations} 
                searchQuery={searchQuery}
                bookmarkedIds={bookmarkedIds}
                onToggleBookmark={toggleBookmark}
                onAddAlert={() => handleAddAlert(searchQuery)}
              />;
            case 'detail':
              const listing = allListings.find(l => l.id === selectedListingId);
              if (!listing) return null;
              return <ListingDetail 
                listing={listing} 
                isAdmin={currentUser?.role === 'admin' || currentUser?.id === listing.seller.id}
                onAdminDelete={async () => {
                  if (window.confirm("حذف آگهی؟")) {
                    await db.deleteListing(listing.id);
                    setAllListings(prev => prev.filter(l => l.id !== listing.id));
                    navigateTo('home');
                  }
                }}
                onBack={() => navigateTo('home')} 
                onChat={() => navigateTo('chat', { forceAuth: true })}
                isBookmarked={bookmarkedIds.includes(listing.id)}
                onToggleBookmark={() => toggleBookmark(listing.id)}
              />;
            case 'bookmarks':
              return <Bookmarks 
                listings={allListings}
                onListingClick={handleListingClick}
                bookmarkedIds={bookmarkedIds}
                onToggleBookmark={toggleBookmark}
                savedSearches={savedSearches}
                onRemoveAlert={handleRemoveAlert}
              />;
            case 'post':
              return <PostAd 
                onComplete={() => {
                  db.getListings().then(setAllListings);
                  navigateTo('home');
                }} 
                onAddListing={async (ad) => {
                  await db.saveListing(ad);
                }}
                currentUser={currentUser!}
                defaultLocation={selectedLocations[0] || 'تهران'} 
              />;
            case 'chat':
              return <Chat initialTab={initialChatTab} isAdmin={currentUser?.role === 'admin'} />;
            case 'profile':
              return <Profile 
                currentUser={currentUser}
                allListings={allListings}
                banners={banners}
                setBanners={setBanners}
                onLogin={() => setShowAuthModal(true)}
                onLogout={() => { setCurrentUser(null); setIsLoggedIn(false); navigateTo('home'); }}
                onNavigateToAbout={() => navigateTo('about')} 
                onNavigateToSupport={() => navigateTo('chat', { chatTab: 'ai' })}
                onAdClick={handleListingClick}
                onNavigateToPost={() => navigateTo('post', { forceAuth: true })}
                onNavigateToLaunch={() => navigateTo('launch-roadmap')}
                onNavigateToBookmarks={() => navigateTo('bookmarks')}
              />;
            case 'about':
              return <About onBack={() => navigateTo('profile')} />;
            case 'launch-roadmap':
              return <LaunchGuide onBack={() => navigateTo('profile')} />;
            case 'legal':
              return <Legal onBack={() => navigateTo('profile')} initialTab={legalInitialTab} />;
            default:
              return null;
          }
        })()}
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 flex justify-around items-center px-2 py-2 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
        <button onClick={() => navigateTo('home')} className={`flex flex-col items-center gap-1 ${currentPage === 'home' ? 'text-red-700' : 'text-gray-400'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          <span className="text-[10px] font-bold">آگهی‌ها</span>
        </button>
        <button onClick={() => navigateTo('bookmarks')} className={`flex flex-col items-center gap-1 ${currentPage === 'bookmarks' ? 'text-red-700' : 'text-gray-400'}`}>
          <svg className="w-5 h-5" fill={currentPage === 'bookmarks' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
          <span className="text-[10px] font-bold">نشان‌ها</span>
        </button>
        <button onClick={() => navigateTo('post', { forceAuth: true })} className="flex flex-col items-center gap-1 text-gray-400">
          <div className={`p-1 border-2 rounded-lg -mt-1 ${currentPage === 'post' ? 'border-red-700 text-red-700' : 'border-gray-400'}`}>
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          </div>
          <span className={`text-[10px] font-bold ${currentPage === 'post' ? 'text-red-700' : ''}`}>ثبت آگهی</span>
        </button>
        <button onClick={() => navigateTo('chat', { forceAuth: true })} className={`flex flex-col items-center gap-1 ${currentPage === 'chat' ? 'text-red-700' : 'text-gray-400'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          <span className="text-[10px] font-bold">چت</span>
        </button>
        <button onClick={() => navigateTo('profile')} className={`flex flex-col items-center gap-1 ${['profile', 'about', 'launch-roadmap', 'legal'].includes(currentPage) ? 'text-red-700' : 'text-gray-400'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          <span className="text-[10px] font-bold">حساب من</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
