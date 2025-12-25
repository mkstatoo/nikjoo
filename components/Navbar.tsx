
import React from 'react';

interface NavbarProps {
  onLocationClick: () => void;
  selectedLocations: string[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLocationClick, selectedLocations, searchQuery, onSearchChange }) => {
  const getLocationLabel = () => {
    if (selectedLocations.length === 0) return 'کل ایران';
    if (selectedLocations.length === 1) return selectedLocations[0];
    return `${selectedLocations[0]} + ${selectedLocations.length - 1} شهر`;
  };

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-100 p-3 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center bg-gray-100 rounded-lg px-3 py-2 gap-2 focus-within:ring-2 focus-within:ring-red-100 transition-all">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="جستجو در همه آگهی‌ها" 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full text-right"
          />
          {searchQuery && (
            <button onClick={() => onSearchChange('')} className="p-1 text-gray-400 hover:text-gray-600">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>
        <button 
          onClick={onLocationClick}
          className="flex items-center gap-1 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 font-medium active:bg-gray-50 transition-colors whitespace-nowrap overflow-hidden max-w-[150px]"
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
