
import React from 'react';
import { Listing } from '../types';

interface ListingCardProps {
  listing: Listing;
  onClick: (id: string) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (id: string) => void;
  viewMode?: 'list' | 'grid';
}

const ListingCard: React.FC<ListingCardProps> = ({ 
  listing, 
  onClick, 
  isBookmarked = false, 
  onToggleBookmark,
  viewMode = 'list'
}) => {
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleBookmark) onToggleBookmark(listing.id);
  };

  // نمای شبکه‌ای (Grid)
  if (viewMode === 'grid') {
    return (
      <div 
        onClick={() => onClick(listing.id)}
        className="flex flex-col bg-white border border-gray-100 rounded-[2rem] overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group animate-in fade-in zoom-in-95"
      >
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img 
            src={listing.images[0]} 
            alt={listing.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <button 
            onClick={handleBookmarkClick}
            className={`absolute top-3 left-3 p-2 rounded-xl backdrop-blur-md transition-all z-10 ${isBookmarked ? 'bg-red-700 text-white shadow-lg' : 'bg-black/20 text-white/80 hover:bg-black/40'}`}
          >
            <svg className="w-3.5 h-3.5" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
          {listing.status === 'sold' && (
             <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">فروخته شد</span>
             </div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-1 gap-2">
          <h3 className="text-xs font-black text-gray-900 line-clamp-2 h-10 leading-5">
            {listing.title}
          </h3>
          <div className="mt-auto">
            <p className="text-sm font-black text-red-700">
              {listing.price.toLocaleString()} <span className="text-[10px]">تومان</span>
            </p>
            <div className="flex items-center justify-between mt-2">
               <span className="text-[9px] text-gray-400 font-bold">{listing.location.split('،')[1] || listing.location}</span>
               <div className="flex items-center gap-1 opacity-60">
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeWidth="2"/></svg>
                  <span className="text-[8px] font-bold">{listing.views || 0}</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // نمای لیستی (Standard List)
  return (
    <div 
      onClick={() => onClick(listing.id)}
      className="flex items-center gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors relative group animate-in fade-in slide-in-from-right-4"
    >
      <div className="flex-1 flex flex-col justify-between h-24 py-1 text-right">
        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-6">
          {listing.icon && <span className="ml-1 text-base">{listing.icon}</span>}
          {listing.title}
        </h3>
        
        <div className="space-y-1">
          <p className="text-xs text-red-700 font-black">
            {listing.price > 0 ? `${listing.price.toLocaleString()} ${listing.currency}` : listing.currency}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
               <span className="text-[9px] font-black text-amber-700">{listing.seller.rating}</span>
               <svg className="w-2.5 h-2.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            </div>
            <span className="text-[10px] text-gray-400 font-medium">
              {listing.createdAt} در {listing.location.split('،')[1] || listing.location}
            </span>
          </div>
        </div>
      </div>
      
      <div className="relative w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100">
        <img src={listing.images[0]} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
        <div className="absolute top-2 left-2">
          <button 
            onClick={handleBookmarkClick}
            className={`p-1.5 rounded-xl backdrop-blur-md transition-all ${isBookmarked ? 'bg-red-700 text-white' : 'bg-black/20 text-white/80'}`}
          >
            <svg className="w-3 h-3" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" strokeWidth="2.5"/></svg>
          </button>
        </div>
        {listing.status === 'sold' && (
           <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-[8px] bg-white text-black font-black px-2 py-0.5 rounded">فروخته شد</span>
           </div>
        )}
      </div>
    </div>
  );
};

export default ListingCard;