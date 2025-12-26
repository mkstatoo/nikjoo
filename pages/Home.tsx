
import React, { useMemo, useState, useEffect } from 'react';
import { CATEGORIES } from '../constants';
import ListingCard from '../components/ListingCard';
import { Listing, Banner } from '../types';

interface HomeProps {
  listings: Listing[];
  banners: Banner[];
  onListingClick: (id: string) => void;
  selectedLocations: string[];
  searchQuery: string;
  bookmarkedIds?: string[];
  onToggleBookmark?: (id: string) => void;
}

const Home: React.FC<HomeProps> = ({ 
  listings,
  banners,
  onListingClick, 
  selectedLocations, 
  searchQuery,
  bookmarkedIds = [],
  onToggleBookmark
}) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredListings = useMemo(() => {
    let list = [...listings];
    if (selectedLocations.length > 0) {
      list = list.filter(l => selectedLocations.some(loc => l.location.includes(loc)));
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(l => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q));
    }
    if (activeCategory) list = list.filter(l => l.category === activeCategory);
    return list;
  }, [listings, selectedLocations, activeCategory, searchQuery]);

  return (
    <div className="pb-24 bg-white min-h-screen">
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center gap-6 p-4 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map(cat => (
            <div 
              key={cat.id} 
              onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
              className={`flex flex-col items-center gap-2 cursor-pointer shrink-0 transition-all ${activeCategory === cat.name ? 'scale-110' : 'opacity-60'}`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border ${activeCategory === cat.name ? 'bg-red-700 text-white border-red-700 shadow-lg' : 'bg-gray-50 border-gray-100'}`}>
                {cat.icon}
              </div>
              <span className="text-[10px] font-black">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 divide-y-2 divide-gray-100">
        {filteredListings.length > 0 ? (
          filteredListings.map((listing, index) => (
            <React.Fragment key={listing.id}>
              <ListingCard 
                listing={listing} 
                onClick={onListingClick}
                isBookmarked={bookmarkedIds.includes(listing.id)}
                onToggleBookmark={onToggleBookmark}
              />
              {banners.map(banner => (
                banner.position === index + 1 && (
                  <div key={banner.id} className="p-4 bg-gray-50 border-y-2 border-gray-100">
                     <a href={banner.link} className="block relative h-32 rounded-3xl overflow-hidden shadow-sm group border-2 border-white">
                        <img src={banner.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                           <span className="text-white font-black text-xl">{banner.title}</span>
                        </div>
                     </a>
                  </div>
                )
              ))}
            </React.Fragment>
          ))
        ) : (
          <div className="py-40 text-center font-black text-gray-300">آگهی‌ای پیدا نشد</div>
        )}
      </div>
    </div>
  );
};

export default Home;
