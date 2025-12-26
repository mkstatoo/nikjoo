
import React from 'react';
import { MOCK_LISTINGS } from '../constants';
import ListingCard from '../components/ListingCard';

interface BookmarksProps {
  onListingClick: (id: string) => void;
  bookmarkedIds: string[];
  onToggleBookmark: (id: string) => void;
}

const Bookmarks: React.FC<BookmarksProps> = ({ onListingClick, bookmarkedIds, onToggleBookmark }) => {
  const savedListings = MOCK_LISTINGS.filter(listing => bookmarkedIds.includes(listing.id));

  return (
    <div className="pb-24 bg-white min-h-screen text-right" dir="rtl">
      {/* Header */}
      <div className="p-6 bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-red-50 text-red-700 rounded-2xl flex items-center justify-center">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tighter">نشان‌ها</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">آگهی‌های ذخیره شده شما</p>
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto">
        {savedListings.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {savedListings.map(listing => (
              <ListingCard 
                key={listing.id} 
                listing={listing} 
                onClick={onListingClick}
                isBookmarked={true}
                onToggleBookmark={onToggleBookmark}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 px-10 text-center animate-in fade-in duration-700">
            <div className="w-32 h-32 bg-gray-50 rounded-[45px] flex items-center justify-center mb-8 shadow-inner rotate-3 border-4 border-white">
               <svg className="w-16 h-16 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
               </svg>
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-3 tracking-tighter">هنوز هیچ آگهی را نشان نکرده‌اید</h3>
            <p className="text-xs text-gray-400 leading-7 max-w-[240px] font-medium mx-auto">
              آگهی‌هایی که نشان می‌کنید در این بخش نمایش داده می‌شوند تا بعداً به راحتی به آن‌ها دسترسی داشته باشید.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-10 px-10 py-3.5 bg-gray-900 text-white rounded-2xl font-black text-xs shadow-xl transition-all active:scale-95"
            >
              مشاهده آگهی‌ها
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
