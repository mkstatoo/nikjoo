
import React from 'react';
import { Listing } from '../types';
import ListingCard from '../components/ListingCard';

interface BookmarksProps {
  listings: Listing[];
  onListingClick: (id: string) => void;
  bookmarkedIds: string[];
  onToggleBookmark: (id: string) => void;
}

const Bookmarks: React.FC<BookmarksProps> = ({ listings, onListingClick, bookmarkedIds, onToggleBookmark }) => {
  const savedListings = listings.filter(listing => bookmarkedIds.includes(listing.id));

  return (
    <div className="pb-24 bg-white min-h-screen text-right" dir="rtl">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-black text-gray-900">نشان‌ها</h1>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">آگهی‌های ذخیره شده شما</p>
      </div>

      <div className="divide-y divide-gray-50">
        {savedListings.length > 0 ? (
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
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
