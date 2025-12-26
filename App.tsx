
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
import { MOCK_LISTINGS } from './constants';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [selectedLocations, setSelectedLocations] = useState<string[]>(['تهران']);
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [initialChatTab, setInitialChatTab] = useState<'my' | 'ai'>('my');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('nikjoo_logged_in') === 'true');
  const [userPhone, setUserPhone] = useState(() => localStorage.getItem('nikjoo_user_phone') || '');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<{page: string, options?: any} | null>(null);

  useEffect(() => {
    localStorage.setItem('nikjoo_logged_in', isLoggedIn.toString());
    localStorage.setItem('nikjoo_user_phone', userPhone);
  }, [isLoggedIn, userPhone]);

  const navigateTo = (page: string, options?: { chatTab?: 'my' | 'ai', forceAuth?: boolean }) => {
    // If action requires auth and user is not logged in
    if (options?.forceAuth && !isLoggedIn) {
      setPendingAction({ page, options: { ...options, forceAuth: false } });
      setShowAuthModal(true);
      return;
    }

    if (options?.chatTab) {
      setInitialChatTab(options.chatTab);
    } else {
      setInitialChatTab('my');
    }
    setCurrentPage(page);
    setSelectedListingId(null);
    window.scrollTo(0, 0);
  };

  const handleAuthSuccess = (phone: string) => {
    setIsLoggedIn(true);
    setUserPhone(phone);
    if (pendingAction) {
      navigateTo(pendingAction.page, pendingAction.options);
      setPendingAction(null);
    }
  };

  const handleListingClick = (id: string) => {
    setSelectedListingId(id);
    setCurrentPage('detail');
    window.scrollTo(0, 0);
  };

  const handleConfirmLocation = (selected: string[]) => {
    setSelectedLocations(selected);
    setShowLocationSelector(false);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return <Home 
          onListingClick={handleListingClick} 
          selectedLocations={selectedLocations} 
          searchQuery={searchQuery}
        />;
      case 'detail':
        const listing = MOCK_LISTINGS.find(l => l.id === selectedListingId);
        if (!listing) return <Home onListingClick={handleListingClick} selectedLocations={selectedLocations} searchQuery={searchQuery} />;
        return <ListingDetail listing={listing} onBack={() => navigateTo('home')} onChat={() => navigateTo('chat', { forceAuth: true })} />;
      case 'post':
        return <PostAd onComplete={() => navigateTo('home')} defaultLocation={selectedLocations[0] || 'تهران'} />;
      case 'chat':
        return <Chat initialTab={initialChatTab} />;
      case 'profile':
        return <Profile 
          isLoggedIn={isLoggedIn}
          userPhone={userPhone}
          onLogin={() => setShowAuthModal(true)}
          onLogout={() => { setIsLoggedIn(false); setUserPhone(''); navigateTo('home'); }}
          onNavigateToAbout={() => navigateTo('about')} 
          onNavigateToSupport={() => navigateTo('chat', { chatTab: 'ai' })}
          onAdClick={handleListingClick}
          onNavigateToPost={() => navigateTo('post', { forceAuth: true })}
          onNavigateToLaunch={() => navigateTo('launch-roadmap')}
        />;
      case 'about':
        return <About onBack={() => navigateTo('profile')} />;
      case 'launch-roadmap':
        return <LaunchGuide onBack={() => navigateTo('profile')} />;
      default:
        return <Home onListingClick={handleListingClick} selectedLocations={selectedLocations} searchQuery={searchQuery} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {currentPage === 'home' && (
        <Navbar 
          onLocationClick={() => setShowLocationSelector(true)} 
          selectedLocations={selectedLocations} 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      )}
      
      {showLocationSelector && (
        <LocationSelector 
          initialSelected={selectedLocations}
          onConfirm={handleConfirmLocation} 
          onBack={() => setShowLocationSelector(false)} 
        />
      )}

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => { setShowAuthModal(false); setPendingAction(null); }}
        onSuccess={handleAuthSuccess}
      />

      <main className="flex-1 overflow-x-hidden">
        {renderContent()}
      </main>
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 flex justify-around items-center px-2 py-2 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
        <button onClick={() => navigateTo('home')} className={`flex flex-col items-center gap-1 ${currentPage === 'home' ? 'text-red-700' : 'text-gray-400'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          <span className="text-[10px] font-bold">آگهی‌ها</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
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
        <button onClick={() => navigateTo('profile')} className={`flex flex-col items-center gap-1 ${['profile', 'about', 'launch-roadmap'].includes(currentPage) ? 'text-red-700' : 'text-gray-400'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          <span className="text-[10px] font-bold">حساب من</span>
        </button>
      </div>
    </div>
  );
};

export default App;
