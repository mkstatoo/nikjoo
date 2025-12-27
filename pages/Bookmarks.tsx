
import React, { useState } from 'react';
import { Listing, SavedSearch } from '../types';
import ListingCard from '../components/ListingCard';

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
  const [activeTab, setActiveTab] = useState<'listings' | 'alerts'>('listings');
  const savedListings = listings.filter(listing => bookmarkedIds.includes(listing.id));

  return (
    <div className="pb-24 bg-white min-h-screen text-right" dir="rtl">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-black text-gray-900">نشان‌ها و هشدارها</h1>
        <div className="flex gap-4 mt-6">
           <button 
             onClick={() => setActiveTab('listings')}
             className={`flex-1 py-3 rounded-2xl text-xs font-black transition-all ${activeTab === 'listings' ? 'bg-red-700 text-white shadow-xl' : 'bg-gray-50 text-gray-400 border border-gray-100'}`}
           >
             آگهی‌های نشان‌شده
           </button>
           <button 
             onClick={() => setActiveTab('alerts')}
             className={`flex-1 py-3 rounded-2xl text-xs font-black transition-all ${activeTab === 'alerts' ? 'bg-red-700 text-white shadow-xl' : 'bg-gray-50 text-gray-400 border border-gray-100'}`}
           >
             هشدارهای جستجو
           </button>
        </div>
      </div>

      <div className="divide-y divide-gray-50">
        {activeTab === 'listings' ? (
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
        ) : (
          <div className="p-4 space-y-4">
            {savedSearches.length > 0 ? (
              savedSearches.map(alert => (
                <div key={alert.id} className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 flex items-center justify-between group hover:border-red-200 transition-all">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm">🔔</div>
                      <div>
                        <h3 className="text-sm font-black text-gray-900">{alert.query}</h3>
                        <p className="text-[10px] text-gray-400 mt-1">{alert.location} • {alert.createdAt}</p>
                      </div>
                   </div>
                   <button 
                     onClick={() => onRemoveAlert(alert.id)}
                     className="p-3 text-gray-300 hover:text-red-700 transition-colors"
                   >
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2.5"/></svg>
                   </button>
                </div>
              ))
            ) : (
              <div className="py-40 text-center text-gray-300 font-black">هشداری ثبت نشده است</div>
            )}
            <p className="text-[9px] text-center text-gray-400 font-bold px-10 leading-5">
              💡 شما می‌توانید حداکثر ۳ هشدار فعال داشته باشید. سیستم به صورت خودکار آگهی‌های مطابق با جستجوی شما را پایش می‌کند.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;