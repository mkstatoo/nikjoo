
import React, { useState, useEffect, useRef } from 'react';

interface NavbarProps {
  onLocationClick: () => void;
  selectedLocations: string[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const RECENT_SEARCHES_KEY = 'nikjoo_recent_searches';

const Navbar: React.FC<NavbarProps> = ({ onLocationClick, selectedLocations, searchQuery, onSearchChange }) => {
  const [showRecent, setShowRecent] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (saved) setRecentSearches(JSON.parse(saved));

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowRecent(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    const updated = [trimmed, ...recentSearches.filter(s => s !== trimmed)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveSearch(searchQuery);
      setShowRecent(false);
      (e.target as HTMLInputElement).blur();
    }
  };

  const handleRecentClick = (query: string) => {
    onSearchChange(query);
    saveSearch(query);
    setShowRecent(false);
  };

  const handleSearchButtonClick = () => {
    saveSearch(searchQuery);
    setShowRecent(false);
  };

  const clearRecent = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('آیا از پاک کردن تمام تاریخچه جستجو اطمینان دارید؟')) {
      setRecentSearches([]);
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    }
  };

  const getLocationLabel = () => {
    if (selectedLocations.length === 0) return 'کل ایران';
    if (selectedLocations.length === 1) return selectedLocations[0];
    return `${selectedLocations[0]} + ${selectedLocations.length - 1} شهر`;
  };

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-100 p-3 flex flex-col gap-3 shadow-sm transition-all duration-300">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative" ref={dropdownRef}>
          <div className="flex items-center bg-gray-100 rounded-2xl px-3 py-2.5 gap-2 focus-within:ring-2 focus-within:ring-red-100 transition-all border-2 border-transparent focus-within:bg-white focus-within:border-red-500/20 group">
            <button 
              onClick={handleSearchButtonClick}
              className="p-1 text-gray-400 hover:text-red-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <input 
              type="text" 
              placeholder="چی لازم داری؟" 
              value={searchQuery}
              onFocus={() => setShowRecent(true)}
              onKeyDown={handleInputKeyDown}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full text-right font-bold text-gray-800 placeholder:text-gray-400 placeholder:font-medium"
            />
            
            {searchQuery ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onSearchChange('')} 
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="w-px h-4 bg-gray-200"></div>
                <button 
                  onClick={handleSearchButtonClick}
                  className="text-[10px] font-black text-red-700 whitespace-nowrap px-1 hover:scale-105 active:scale-95 transition-all"
                >
                  جستجو
                </button>
              </div>
            ) : null}
          </div>

          {showRecent && recentSearches.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="p-4 bg-gray-50/50 flex justify-between items-center border-b border-gray-100/50">
                <div className="flex items-center gap-2">
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">جستجوهای اخیر</span>
                </div>
                <button 
                  onClick={clearRecent} 
                  className="text-[9px] font-black text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-full transition-all flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7" strokeWidth="2.5"/></svg>
                  پاک کردن تاریخچه
                </button>
              </div>
              <div className="flex flex-col py-1">
                {recentSearches.map((query, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleRecentClick(query)}
                    className="flex items-center justify-between px-5 py-3.5 text-right text-xs font-bold text-gray-700 hover:bg-red-50/50 hover:text-red-700 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-3.5 h-3.5 text-gray-300 group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="2.5" strokeLinecap="round"/>
                      </svg>
                      {query}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button 
          onClick={onLocationClick}
          className="flex items-center gap-2 border-2 border-gray-100 rounded-2xl px-4 py-2.5 text-sm text-gray-700 font-bold active:bg-gray-100 hover:border-red-100 transition-all whitespace-nowrap overflow-hidden max-w-[160px] shadow-sm bg-white"
        >
          <span className="text-red-600 shrink-0">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </span>
          <span className="truncate text-xs">{getLocationLabel()}</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
