
import React, { useState } from 'react';
import { PROVINCES, PROVINCES_WITH_CITIES } from '../constants';

interface LocationSelectorProps {
  onConfirm: (selected: string[]) => void;
  onBack: () => void;
  initialSelected?: string[];
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ onConfirm, onBack, initialSelected = [] }) => {
  const [selectedCities, setSelectedCities] = useState<string[]>(initialSelected);
  const [currentProvince, setCurrentProvince] = useState<string | null>(null);

  const handleProvinceClick = (province: string) => {
    setCurrentProvince(province);
  };

  const toggleCity = (city: string) => {
    if (selectedCities.includes(city)) {
      setSelectedCities(selectedCities.filter(c => c !== city));
    } else {
      setSelectedCities([...selectedCities, city]);
    }
  };

  const removeCity = (city: string) => {
    setSelectedCities(selectedCities.filter(c => c !== city));
  };

  const clearAll = () => {
    setSelectedCities([]);
    setCurrentProvince(null);
  };

  const handleBack = () => {
    if (currentProvince) {
      setCurrentProvince(null);
    } else {
      onBack();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-white flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={handleBack} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-gray-700 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-xl font-bold text-gray-900">
            {currentProvince ? `شهر‌های ${currentProvince}` : 'انتخاب شهر'}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-1 text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button className="p-1 text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>

      {/* Selected Tags Area */}
      <div className="p-4 flex flex-wrap gap-2 shrink-0 min-h-[60px] bg-white">
        {selectedCities.map(city => (
          <div 
            key={city}
            className="flex items-center gap-2 px-3 py-1.5 border border-red-700 rounded-lg text-red-700 text-sm font-medium animate-in fade-in zoom-in duration-200"
          >
            <button onClick={() => removeCity(city)} className="p-0.5">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
            {city}
          </div>
        ))}
        {selectedCities.length === 0 && <span className="text-xs text-gray-400 self-center">شهری انتخاب نشده است</span>}
      </div>

      {/* Main List */}
      <div className="flex-1 overflow-y-auto">
        {!currentProvince ? (
          <>
            {/* کل ایران */}
            <div 
              onClick={clearAll}
              className="flex items-center justify-between p-5 border-b border-gray-100 cursor-pointer active:bg-gray-50"
            >
              <span className="text-sm font-medium text-gray-800">همه شهرهای ایران</span>
              <div className="w-5 h-5 bg-red-600 rounded flex items-center justify-center text-white">
                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 12H4" strokeWidth="3" strokeLinecap="round"/></svg>
              </div>
            </div>

            {/* لیست استان‌ها */}
            {PROVINCES.map(province => (
              <div 
                key={province}
                onClick={() => handleProvinceClick(province)}
                className="flex items-center justify-between p-5 border-b border-gray-100 cursor-pointer hover:bg-gray-50 active:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-800">{province}</span>
                <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </div>
            ))}
          </>
        ) : (
          <>
            {/* کل استان */}
            <div 
              onClick={() => {
                const citiesInProvince = PROVINCES_WITH_CITIES[currentProvince];
                const allSelected = citiesInProvince.every(city => selectedCities.includes(city));
                if (allSelected) {
                  setSelectedCities(selectedCities.filter(c => !citiesInProvince.includes(c)));
                } else {
                  const newSelection = [...new Set([...selectedCities, ...citiesInProvince])];
                  setSelectedCities(newSelection);
                }
              }}
              className="flex items-center justify-between p-5 border-b border-gray-100 cursor-pointer active:bg-gray-50 bg-red-50/30"
            >
              <span className="text-sm font-bold text-red-700">همه شهرهای {currentProvince}</span>
              <div className={`w-5 h-5 rounded flex items-center justify-center border-2 ${PROVINCES_WITH_CITIES[currentProvince].every(city => selectedCities.includes(city)) ? 'bg-red-700 border-red-700 text-white' : 'border-gray-300'}`}>
                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>

            {/* لیست شهرها */}
            {PROVINCES_WITH_CITIES[currentProvince].map(city => (
              <div 
                key={city}
                onClick={() => toggleCity(city)}
                className="flex items-center justify-between p-5 border-b border-gray-100 cursor-pointer hover:bg-gray-50 active:bg-gray-50 transition-colors"
              >
                <span className={`text-sm font-medium ${selectedCities.includes(city) ? 'text-red-700 font-bold' : 'text-gray-800'}`}>
                  {city}
                </span>
                <div className={`w-5 h-5 rounded flex items-center justify-center border-2 ${selectedCities.includes(city) ? 'bg-red-700 border-red-700 text-white' : 'border-gray-300'}`}>
                   {selectedCities.includes(city) && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Footer Button */}
      <div className="p-4 border-t border-gray-100 bg-gray-50 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        <button 
          onClick={() => onConfirm(selectedCities)}
          className="w-full bg-red-700 text-white font-bold py-3.5 rounded-lg active:scale-[0.98] transition-all shadow-md"
        >
          تأیید ({selectedCities.length} انتخاب)
        </button>
      </div>
    </div>
  );
};

export default LocationSelector;