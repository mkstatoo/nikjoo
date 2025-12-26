
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

  const getLocationLabel = () => {
    if (selectedLocations.length === 0) return 'کل ایران';
    if (selectedLocations.length === 1) return selectedLocations[0];
    return `${selectedLocations[0]} + ${selectedLocations.length - 1} شهر`;
  };

  const saveSearch = (query: string) => {
    if (!query.trim()) return;
    const updated = [query.trim(), ...recentSearches.filter(s => s !== query.trim())].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveSearch(searchQuery);
      setShowRecent(false);
    }
  };

  const clearRecent = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-100 p-3 flex flex-col gap-3 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative" ref={dropdownRef}>
          <div className="flex items-center bg-gray-100 rounded-xl px-3 py-2 gap-2 focus-within:ring-2 focus-within:ring-red-100 transition-all border border-transparent focus-within:bg-white">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="جستجو در نیکجو..." 
              value={searchQuery}
              onFocus={() => setShowRecent(true)}
              onKeyDown={handleInputKeyDown}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full text-right font-medium"
            />
            
            {searchQuery && (
              <button onClick={() => onSearchChange('')} className="p-1 text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>

          {showRecent && recentSearches.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-3 bg-gray-50 flex justify-between items-center border-b border-gray-100">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">جستجوهای اخیر</span>
                <button onClick={clearRecent} className="text-[9px] font-black text-red-700 hover:underline">پاک کردن</button>
              </div>
              <div className="flex flex-col">
                {recentSearches.map((query, idx) => (
                  <button 
                    key={idx}
                    onClick={() => {
                      onSearchChange(query);
                      setShowRecent(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-right text-xs font-bold text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {query}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button 
          onClick={onLocationClick}
          className="flex items-center gap-1 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 font-medium active:bg-gray-50 transition-colors whitespace-nowrap overflow-hidden max-w-[150px] shadow-sm"
        >
          <span className="text-gray-400 shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </span>
          <span className="truncate">{getLocationLabel()}</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
