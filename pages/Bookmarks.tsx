
import React, { useState, useEffect } from 'react';
import { Listing, SavedSearch, RecentSearch } from '../types';
import ListingCard from '../components/ListingCard';
import { db } from '../services/db';

interface BookmarksProps {
  listings: Listing[];
  onListingClick: (id: string) => void;
  bookmarkedIds: string[];
  onToggleBookmark: (id: string) => void;
  savedSearches: SavedSearch[];
  onRemoveAlert: (id: string) => void;
}

const Bookmarks: React.FC<BookmarksProps> = ({ 
  listings, 
  onListingClick, 
  bookmarkedIds, 
  onToggleBookmark,
  savedSearches,
  onRemoveAlert
}) => {
  const [activeTab, setActiveTab] = useState<'listings' | 'alerts' | 'history'>('listings');
  const [recentHistory, setRecentHistory] = useState<RecentSearch[]>([]);
  
  useEffect(() => {
    const loadHistory = async () => {
      const history = await db.getSearchHistory();
      setRecentHistory(history);
    };
    if (activeTab === 'history') loadHistory();
  }, [activeTab]);

  const savedListings = listings.filter(listing => bookmarkedIds.includes(listing.id));

  const removeHistoryItem = async (id: string) => {
    await db.deleteHistoryItem(id);
    setRecentHistory(prev => prev.filter(h => h.id !== id));
  };

  const clearAllHistory = async () => {
    await db.clearHistory();
    setRecentHistory([]);
  };

  return (
    <div className="pb-24 bg-white min-h-screen text-right" dir="rtl">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-black text-gray-900">نشان‌ها و تاریخچه</h1>
        <div className="flex gap-2 mt-6 overflow-x-auto scrollbar-hide pb-2">
           {[
             { id: 'listings', label: 'آگهی‌ها' },
             { id: 'alerts', label: 'هشدارها' },
             { id: 'history', label: 'تاریخچه جستجو' }
           ].map(tab => (
             <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`shrink-0 px-6 py-3 rounded-2xl text-[10px] font-black transition-all ${activeTab === tab.id ? 'bg-red-700 text-white shadow-xl' : 'bg-gray-50 text-gray-400 border border-gray-100'}`}
             >
               {tab.label}
             </button>
           ))}
        </div>
      </div>

      <div className="divide-y divide-gray-50">
        {activeTab === 'listings' && (
          savedListings.length > 0 ? (
            savedListings.map(listing => (
              <ListingCard 
                key={listing.id} 
                listing={listing} 
                onClick={onListingClick}
                isBookmarked={true}
                onToggleBookmark={onToggleBookmark}
              />
            ))
          ) : (
            <div className="py-40 text-center text-gray-300 font-black">هنوز آگهی‌ای نشان نکرده‌اید</div>
          )
        )}

        {activeTab === 'alerts' && (
          <div className="p-4 space-y-4">
            {savedSearches.length > 0 ? (
              savedSearches.map(alert => (
                <div key={alert.id} className="p-6 bg-gray-50 rounded-[2.5rem] border border-gray-100 flex items-center justify-between group hover:border-red-200 transition-all">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm">🔔</div>
                      <div>
                        <h3 className="text-sm font-black text-gray-900">{alert.query}</h3>
                        <p className="text-[10px] text-gray-400 mt-1">{alert.location} • {alert.createdAt}</p>
                      </div>
                   </div>
                   <button onClick={() => onRemoveAlert(alert.id)} className="p-3 text-gray-300 hover:text-red-700">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2.5"/></svg>
                   </button>
                </div>
              ))
            ) : (
              <div className="py-40 text-center text-gray-300 font-black">هشداری ثبت نشده است</div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="p-4 space-y-4">
            {recentHistory.length > 0 ? (
              <>
                <div className="flex justify-between items-center px-4 mb-2">
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">جستجوهای اخیر شما</span>
                   <button onClick={clearAllHistory} className="text-[9px] font-black text-red-700 bg-red-50 px-3 py-1.5 rounded-xl">پاکسازی کل تاریخچه</button>
                </div>
                {recentHistory.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-[1.5rem] hover:bg-gray-50 transition-all group shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-red-50 group-hover:text-red-700 transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="2.5"/></svg>
                      </div>
                      <div>
                        <span className="text-sm font-bold text-gray-700 block">{item.query}</span>
                        <span className="text-[8px] text-gray-400 uppercase font-black">{new Date(item.timestamp).toLocaleTimeString('fa-IR')}</span>
                      </div>
                    </div>
                    <button onClick={() => removeHistoryItem(item.id)} className="text-gray-200 hover:text-red-700 p-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3"/></svg>
                    </button>
                  </div>
                ))}
              </>
            ) : (
              <div className="py-40 text-center text-gray-300 font-black">تاریخچه‌ای موجود نیست</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;