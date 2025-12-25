
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { CATEGORIES, MOCK_LISTINGS, SUB_CATEGORIES } from '../constants';
import ListingCard from '../components/ListingCard';
import { Listing } from '../types';

interface HomeProps {
  onListingClick: (id: string) => void;
  selectedLocations: string[];
  searchQuery: string;
}

type SortOption = 'newest' | 'relevance' | 'price-low' | 'price-high';

const Home: React.FC<HomeProps> = ({ onListingClick, selectedLocations, searchQuery }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [isChanging, setIsChanging] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const sortMenuRef = useRef<HTMLDivElement>(null);

  // Auto-switch to relevance when searching
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setSortBy('relevance');
    } else if (sortBy === 'relevance') {
      setSortBy('newest');
    }
  }, [searchQuery]);

  // Click outside to close sort menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
        setShowSortMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsChanging(true);
    const timer = setTimeout(() => setIsChanging(false), 300);
    return () => clearTimeout(timer);
  }, [activeCategory, activeSubCategory, searchQuery, sortBy]);

  const calculateRelevance = (listing: Listing, query: string) => {
    const q = query.toLowerCase().trim();
    const t = listing.title.toLowerCase();
    const d = listing.description.toLowerCase();
    let score = 0;

    if (t === q) score += 100;
    else if (t.startsWith(q)) score += 50;
    else if (t.includes(q)) score += 20;

    // Word based match
    const queryWords = q.split(/\s+/);
    queryWords.forEach(word => {
      if (t.includes(word)) score += 10;
      if (d.includes(word)) score += 2;
    });

    return score;
  };

  const filteredListings = useMemo(() => {
    let listings = [...MOCK_LISTINGS];
    
    // Filter by cities
    if (selectedLocations.length > 0) {
      listings = listings.filter(listing => 
        selectedLocations.some(loc => listing.location.includes(loc))
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      listings = listings.filter(listing => 
        listing.title.toLowerCase().includes(query) || 
        listing.description.toLowerCase().includes(query)
      );
    }

    // Filter by main category
    if (activeCategory) {
      listings = listings.filter(listing => listing.category === activeCategory);
    }

    // Filter by sub-category
    if (activeSubCategory) {
      listings = listings.filter(listing => 
        listing.tags && listing.tags.includes(activeSubCategory)
      );
    }

    // Sorting logic
    listings.sort((a, b) => {
      switch (sortBy) {
        case 'relevance':
          if (!searchQuery) return 0;
          return calculateRelevance(b, searchQuery) - calculateRelevance(a, searchQuery);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
        default:
          // In real app we'd use timestamps, here we use original order/id
          return b.id.localeCompare(a.id);
      }
    });

    return listings;
  }, [selectedLocations, activeCategory, activeSubCategory, searchQuery, sortBy]);

  const handleCategoryClick = (catName: string) => {
    if (activeCategory === catName) {
      setActiveCategory(null);
      setActiveSubCategory(null);
    } else {
      setActiveCategory(catName);
      setActiveSubCategory(null);
    }
  };

  const getFilterLabel = () => {
    let label = selectedLocations.length === 0 ? 'همه آگهی‌ها' : 
                selectedLocations.length === 1 ? `آگهی‌های ${selectedLocations[0]}` : 
                `آگهی‌های ${selectedLocations.length} شهر`;
    
    if (activeCategory) {
      label += ` در ${activeCategory}`;
    }
    return label;
  };

  const sortOptions: { value: SortOption; label: string; hideWithoutSearch?: boolean }[] = [
    { value: 'relevance', label: 'مرتبط‌ترین', hideWithoutSearch: true },
    { value: 'newest', label: 'جدیدترین' },
    { value: 'price-low', label: 'ارزان‌ترین' },
    { value: 'price-high', label: 'گران‌ترین' },
  ];

  return (
    <div className="pb-24 bg-white min-h-screen">
      {/* Category Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm transition-all duration-500">
        <div className="flex items-center gap-5 p-4 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map(cat => (
            <div 
              key={cat.id} 
              onClick={() => handleCategoryClick(cat.name)}
              className={`flex flex-col items-center gap-2 cursor-pointer shrink-0 transition-all duration-500 group ${activeCategory === cat.name ? 'scale-110' : 'opacity-60 hover:opacity-100 hover:scale-105'}`}
            >
              <div className={`w-16 h-16 rounded-[22px] flex items-center justify-center text-3xl transition-all duration-500 shadow-sm ${activeCategory === cat.name ? 'bg-gradient-to-br from-red-600 to-red-800 text-white shadow-xl shadow-red-200 -rotate-3' : 'bg-gray-100 text-gray-700 group-hover:bg-gray-200'}`}>
                {cat.icon}
              </div>
              <span className={`text-[11px] font-black whitespace-nowrap tracking-tight ${activeCategory === cat.name ? 'text-red-700' : 'text-gray-500'}`}>
                {cat.name}
              </span>
              {activeCategory === cat.name && (
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></div>
              )}
            </div>
          ))}
        </div>

        {/* Sub-category bar */}
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeCategory ? 'max-h-24 opacity-100 border-t border-gray-50 bg-gray-50/30' : 'max-h-0 opacity-0'}`}>
          {activeCategory && SUB_CATEGORIES[activeCategory] && (
            <div className="px-4 py-3 flex items-center gap-3 overflow-x-auto scrollbar-hide">
              <button 
                onClick={() => setActiveSubCategory(null)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all duration-300 border ${activeSubCategory === null ? 'bg-red-700 text-white border-red-700 shadow-lg shadow-red-100' : 'bg-white text-gray-600 border-gray-200 hover:border-red-300'}`}
              >
                همه {activeCategory}
              </button>
              {SUB_CATEGORIES[activeCategory].map(sub => (
                <button 
                  key={sub}
                  onClick={() => setActiveSubCategory(sub)}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all duration-300 border ${activeSubCategory === sub ? 'bg-red-700 text-white border-red-700 shadow-lg shadow-red-100' : 'bg-white text-gray-600 border-gray-200 hover:border-red-300'}`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filter status and Sorting */}
      <div className="px-6 py-4 flex justify-between items-center border-b border-gray-50 bg-white relative">
        <div className="flex flex-col text-right">
           <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">در حال نمایش</span>
           <h2 className="text-sm font-black text-gray-900 flex items-center gap-1.5 flex-row-reverse">
             {getFilterLabel()}
             {activeSubCategory && (
               <>
                 <svg className="w-3 h-3 text-gray-300 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="3" strokeLinecap="round"/></svg>
                 <span className="text-red-700">{activeSubCategory}</span>
               </>
             )}
             {searchQuery && (
               <>
                 <svg className="w-3 h-3 text-gray-300 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="3" strokeLinecap="round"/></svg>
                 <span className="text-gray-400">جستجوی: "{searchQuery}"</span>
               </>
             )}
           </h2>
        </div>
        
        <div className="relative" ref={sortMenuRef}>
           <button 
             onClick={() => setShowSortMenu(!showSortMenu)}
             className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black transition-all border ${showSortMenu ? 'bg-red-50 border-red-200 text-red-700' : 'bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100'}`}
           >
             <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
             {sortOptions.find(o => o.value === sortBy)?.label || 'مرتب‌سازی'}
           </button>

           {showSortMenu && (
             <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
               {sortOptions.map(option => (
                 (!option.hideWithoutSearch || searchQuery.length > 0) && (
                   <button
                     key={option.value}
                     onClick={() => {
                       setSortBy(option.value);
                       setShowSortMenu(false);
                     }}
                     className={`w-full text-right px-5 py-3 text-xs font-bold transition-colors ${sortBy === option.value ? 'text-red-700 bg-red-50' : 'text-gray-600 hover:bg-gray-50'}`}
                   >
                     {option.label}
                   </button>
                 )
               ))}
             </div>
           )}
        </div>
      </div>

      {/* Listings List */}
      <div className={`flex flex-col transition-all duration-500 ${isChanging ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 divide-y divide-gray-50">
            {filteredListings.map(listing => (
              <ListingCard key={listing.id} listing={listing} onClick={onListingClick} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 px-10 text-center">
            <div className="w-28 h-28 bg-gray-50 rounded-[40px] flex items-center justify-center mb-8 shadow-inner rotate-6">
               <svg className="w-14 h-14 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
               </svg>
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-3">آگهی‌ای پیدا نشد!</h3>
            <p className="text-xs text-gray-400 leading-7 max-w-xs font-medium">
              شاید بهتر باشد فیلترها را کمی تغییر دهید یا در دسته‌بندی دیگری جستجو کنید.
            </p>
            <button 
              onClick={() => { setActiveCategory(null); setActiveSubCategory(null); setSortBy('newest'); }}
              className="mt-10 px-8 py-3 bg-red-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-red-100 active:scale-95 transition-all"
            >
              پاک کردن فیلترها
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
