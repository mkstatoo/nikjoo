
import React, { useMemo, useState, useEffect } from 'react';
import { CATEGORIES } from '../constants';
import ListingCard from '../components/ListingCard';
import { Listing, Banner } from '../types';
import { db } from '../services/db';

interface HomeProps {
  listings: Listing[];
  banners: Banner[];
  onListingClick: (id: string) => void;
  selectedLocations: string[];
  searchQuery: string;
  bookmarkedIds?: string[];
  onToggleBookmark?: (id: string) => void;
  onAddAlert: () => void;
}

const Home: React.FC<HomeProps> = ({ 
  listings,
  banners,
  onListingClick, 
  selectedLocations, 
  searchQuery,
  bookmarkedIds = [],
  onToggleBookmark,
  onAddAlert
}) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>(() => db.getUserPreferences().viewMode);

  const handleToggleView = (mode: 'list' | 'grid') => {
    setViewMode(mode);
    db.setUserPreferences({ viewMode: mode });
  };

  const filteredListings = useMemo(() => {
    let list = [...listings].filter(l => l.status === 'active');
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
    <div className="pb-24 bg-white min-h-screen text-right" dir="rtl">
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

      <div className="px-4 py-3 flex justify-between items-center bg-gray-50/50 border-b border-gray-100">
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">نمایش {filteredListings.length} آگهی</span>
        </div>
        <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200">
           <button 
             onClick={() => handleToggleView('list')}
             className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-red-700 text-white shadow-md' : 'text-gray-400'}`}
           >
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2.5" strokeLinecap="round"/></svg>
           </button>
           <button 
             onClick={() => handleToggleView('grid')}
             className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-red-700 text-white shadow-md' : 'text-gray-400'}`}
           >
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" strokeWidth="2.5"/></svg>
           </button>
        </div>
      </div>

      {(searchQuery || activeCategory) && (
        <div className="p-4 bg-red-50/50 border-b border-red-100">
           <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-gray-900">نتایج برای: {searchQuery || activeCategory}</p>
                <p className="text-[10px] text-gray-400 mt-1">از آگهی‌های جدید با هشدار باخبر شوید.</p>
              </div>
              <button onClick={onAddAlert} className="bg-red-700 text-white px-4 py-2 rounded-xl text-[10px] font-black">ثبت هشدار</button>
           </div>
        </div>
      )}

      <div className={`p-4 ${viewMode === 'grid' ? 'grid grid-cols-2 gap-4' : 'flex flex-col divide-y divide-gray-100'}`}>
        {filteredListings.length > 0 ? (
          filteredListings.map((listing, index) => (
            <React.Fragment key={listing.id}>
              <ListingCard 
                listing={listing} 
                onClick={onListingClick}
                isBookmarked={bookmarkedIds.includes(listing.id)}
                onToggleBookmark={onToggleBookmark}
                viewMode={viewMode}
              />
              {viewMode === 'list' && banners.map(banner => (
                banner.position === index + 1 && (
                  <div key={banner.id} className="py-4">
                     <a href={banner.link} className="block relative h-32 rounded-[2.5rem] overflow-hidden shadow-md group border-4 border-white">
                        <img src={banner.imageUrl} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-6 text-center">
                           <span className="text-white font-black text-xl">{banner.title}</span>
                        </div>
                     </a>
                  </div>
                )
              ))}
            </React.Fragment>
          ))
        ) : (
          <div className={`${viewMode === 'grid' ? 'col-span-2' : ''} py-40 text-center font-black text-gray-300`}>موردی یافت نشد</div>
        )}
      </div>
    </div>
  );
};

export default Home;