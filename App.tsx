
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.tsx';
import Home from './pages/Home.tsx';
import ListingDetail from './pages/ListingDetail.tsx';
import PostAd from './pages/PostAd.tsx';
import Chat from './pages/Chat.tsx';
import Profile from './pages/Profile.tsx';
import About from './pages/About.tsx';
import LocationSelector from './pages/LocationSelector.tsx';
import LaunchGuide from './pages/LaunchGuide.tsx';
import AuthModal from './components/AuthModal.tsx';
import Bookmarks from './pages/Bookmarks.tsx';
import Legal from './pages/Legal.tsx';
import { MOCK_LISTINGS, MOCK_USERS, MOCK_BANNERS } from './constants.tsx';
import { User, Listing, Banner } from './types.ts';
import { db } from './services/db.ts';

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
    try {
      const saved = localStorage.getItem('nikjoo_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [isLoggedIn, setIsLoggedIn] = useState(!!currentUser);
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [banners, setBanners] = useState<Banner[]>(MOCK_BANNERS);

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
        console.error("Data load failed:", err);
      } finally {
        setTimeout(() => setIsSplashActive(false), 2000);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (currentUser) localStorage.setItem('nikjoo_user', JSON.stringify(currentUser));
    else localStorage.removeItem('nikjoo_user');
    setIsLoggedIn(!!currentUser);
  }, [currentUser]);

  const toggleBookmark = async (id: string) => {
    const updated = await db.toggleBookmark(id);
    setBookmarkedIds(updated);
  };

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<{page: string, options?: any} | null>(null);

  const navigateTo = (page: string, options?: any) => {
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

  const handleAuthSuccess = (phone: string) => {
    const foundUser = MOCK_USERS.find(u => u.phone === phone) || {
       id: 'u_' + Date.now(),
       name: 'کاربر جدید',
       avatar: `https://picsum.photos/seed/${phone}/100/100`,
       joinedDate: '۱۴۰۳',
       rating: 5.0,
       role: phone === '09120000000' ? 'admin' : 'user',
       phone,
       preferences: { viewMode: 'list', theme: 'light', notifications: true }
    };
    setCurrentUser(foundUser as User);
    if (pendingAction) {
      navigateTo(pendingAction.page, pendingAction.options);
      setPendingAction(null);
    }
  };

  if (isSplashActive) {
    return (
      <div className="fixed inset-0 z-[300] bg-white flex flex-col items-center justify-center overflow-hidden">
        <div className="relative flex flex-col items-center animate-in fade-in zoom-in-95 duration-700">
           <div className="w-32 h-32 mb-8 animate-logo flex items-center justify-center">
             {!logoError ? (
               <img src="logo.png" alt="Nikjoo Logo" className="w-full h-full object-contain" onError={() => setLogoError(true)} />
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
          onSearchChange={(q) => { setSearchQuery(q); db.addSearchQuery(q); }}
        />
      )}
      
      {showLocationSelector && (
        <LocationSelector 
          initialSelected={selectedLocations}
          onConfirm={(sel) => { setSelectedLocations(sel); setShowLocationSelector(false); }} 
          onBack={() => setShowLocationSelector(false)} 
        />
      )}

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onSuccess={handleAuthSuccess} />

      <main className="flex-1 overflow-x-hidden">
        {(() => {
          switch (currentPage) {
            case 'home':
              return <Home 
                listings={allListings}
                banners={banners}
                onListingClick={async (id) => {
                   await db.incrementView(id);
                   setSelectedListingId(id);
                   setCurrentPage('detail');
                }} 
                selectedLocations={selectedLocations} 
                searchQuery={searchQuery}
                bookmarkedIds={bookmarkedIds}
                onToggleBookmark={toggleBookmark}
                onAddAlert={() => {}}
              />;
            case 'detail':
              const listing = allListings.find(l => l.id === selectedListingId);
              if (!listing) return null;
              return <ListingDetail 
                listing={listing} 
                isAdmin={currentUser?.role === 'admin' || currentUser?.id === listing.seller.id}
                onBack={() => setCurrentPage('home')} 
                onChat={() => navigateTo('chat', { forceAuth: true })}
                isBookmarked={bookmarkedIds.includes(listing.id)}
                onToggleBookmark={() => toggleBookmark(listing.id)}
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
                onLogout={() => { setCurrentUser(null); setIsLoggedIn(false); setCurrentPage('home'); }}
                onNavigateToAbout={() => setCurrentPage('about')} 
                onNavigateToSupport={() => navigateTo('chat', { chatTab: 'ai' })}
                onAdClick={(id) => { setSelectedListingId(id); setCurrentPage('detail'); }}
                onNavigateToPost={() => navigateTo('post', { forceAuth: true })}
                onNavigateToLaunch={() => setCurrentPage('launch-roadmap')}
                onNavigateToBookmarks={() => setCurrentPage('bookmarks')}
              />;
            case 'post':
              return <PostAd 
                onComplete={() => setCurrentPage('home')} 
                onAddListing={async (ad) => { await db.saveListing(ad); db.getListings().then(setAllListings); }}
                currentUser={currentUser!}
                defaultLocation={selectedLocations[0] || 'تهران'} 
              />;
            case 'bookmarks':
              return <Bookmarks 
                listings={allListings}
                onListingClick={(id) => { setSelectedListingId(id); setCurrentPage('detail'); }}
                bookmarkedIds={bookmarkedIds}
                onToggleBookmark={toggleBookmark}
                savedSearches={[]}
                onRemoveAlert={() => {}}
              />;
            case 'about': return <About onBack={() => setCurrentPage('profile')} />;
            case 'launch-roadmap': return <LaunchGuide onBack={() => setCurrentPage('profile')} />;
            case 'legal': return <Legal onBack={() => setCurrentPage('profile')} initialTab={legalInitialTab} />;
            default: return null;
          }
        })()}
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 flex justify-around items-center px-2 py-2 shadow-lg">
        <button onClick={() => setCurrentPage('home')} className={`flex flex-col items-center gap-1 ${currentPage === 'home' ? 'text-red-700' : 'text-gray-400'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          <span className="text-[10px] font-bold">آگهی‌ها</span>
        </button>
        <button onClick={() => setCurrentPage('bookmarks')} className={`flex flex-col items-center gap-1 ${currentPage === 'bookmarks' ? 'text-red-700' : 'text-gray-400'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
          <span className="text-[10px] font-bold">نشان‌ها</span>
        </button>
        <button onClick={() => navigateTo('post', { forceAuth: true })} className={`flex flex-col items-center gap-1 ${currentPage === 'post' ? 'text-red-700' : 'text-gray-400'}`}>
          <div className="p-1 border-2 rounded-lg -mt-1"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg></div>
          <span className="text-[10px] font-bold">ثبت آگهی</span>
        </button>
        <button onClick={() => navigateTo('chat', { forceAuth: true })} className={`flex flex-col items-center gap-1 ${currentPage === 'chat' ? 'text-red-700' : 'text-gray-400'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          <span className="text-[10px] font-bold">چت</span>
        </button>
        <button onClick={() => setCurrentPage('profile')} className={`flex flex-col items-center gap-1 ${['profile', 'about', 'legal'].includes(currentPage) ? 'text-red-700' : 'text-gray-400'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          <span className="text-[10px] font-bold">حساب من</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
