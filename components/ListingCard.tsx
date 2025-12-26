
import React from 'react';
import { Listing } from '../types';

interface ListingCardProps {
  listing: Listing;
  onClick: (id: string) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (id: string) => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, onClick, isBookmarked = false, onToggleBookmark }) => {
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleBookmark) {
      onToggleBookmark(listing.id);
    }
  };

  return (
    <div 
      onClick={() => onClick(listing.id)}
      className="flex items-center gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors relative group"
    >
      <div className="flex-1 flex flex-col justify-between h-24 py-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-6 flex-1">
            {listing.icon && <span className="ml-1 text-base">{listing.icon}</span>}
            {listing.title}
          </h3>
        </div>
        
        <div className="space-y-1">
          <p className="text-xs text-red-700 font-black">
            {listing.price > 0 ? `${listing.price.toLocaleString()} ${listing.currency}` : listing.currency}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400 font-medium">
              {listing.createdAt} در {listing.location.split('،')[1] || listing.location}
            </span>
            {/* Prominent Seller Rating Badge */}
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 shadow-sm transition-transform group-hover:scale-105">
               <svg className="w-2.5 h-2.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
               </svg>
               <span className="text-[9px] font-black text-amber-700">{listing.seller.rating}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="relative w-28 h-28 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100">
        <img 
          src={listing.images[0]} 
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Bookmark Button */}
        <button 
          onClick={handleBookmarkClick}
          className={`absolute top-1 left-1 p-1.5 rounded-full backdrop-blur-md transition-all z-10 ${isBookmarked ? 'bg-red-700 text-white shadow-lg' : 'bg-black/20 text-white/80 hover:bg-black/40'}`}
        >
          <svg className="w-3 h-3" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>

        {listing.category === 'اجتماعی' && (
           <div className="absolute top-1 right-1 bg-black/50 text-white text-[9px] px-1 rounded flex items-center gap-1">
              <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/></svg>
              فوری
           </div>
        )}
      </div>
    </div>
  );
};

export default ListingCard;
