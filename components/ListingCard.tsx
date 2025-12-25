
import React from 'react';
import { Listing } from '../types';

interface ListingCardProps {
  listing: Listing;
  onClick: (id: string) => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, onClick }) => {
  return (
    <div 
      onClick={() => onClick(listing.id)}
      className="flex items-center gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <div className="flex-1 flex flex-col justify-between h-24 py-1">
        <div>
          <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-6">
            {listing.title}
          </h3>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-500">
            {listing.price > 0 ? `${listing.price.toLocaleString()} ${listing.currency}` : listing.currency}
          </p>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-gray-400">{listing.createdAt} در {listing.location.split('،')[1] || listing.location}</span>
          </div>
        </div>
      </div>
      
      <div className="relative w-28 h-28 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100">
        <img 
          src={listing.images[0]} 
          alt={listing.title}
          className="w-full h-full object-cover"
        />
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
