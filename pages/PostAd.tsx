
import React, { useState, useEffect, useRef } from 'react';
import { CATEGORIES, SUB_CATEGORIES } from '../constants';
import { suggestListingOptimization } from '../services/gemini';
import { User, Listing } from '../types';

const CITY_COORDS: Record<string, [number, number]> = {
  'تهران': [35.6892, 51.3890],
  'مشهد': [36.2972, 59.6067],
  'اصفهان': [32.6546, 51.6680],
  'شیراز': [29.6103, 52.5311],
  'تبریز': [38.0962, 46.2731],
  'اهواز': [31.3183, 48.6706],
  'قم': [34.6416, 50.8746],
  'کرج': [35.8327, 50.9915],
  'رشت': [37.2808, 49.5831],
  'کرمان': [30.2839, 57.0833],
};

interface InputWrapperProps {
  label: string;
  children?: React.ReactNode;
  required?: boolean;
}

const InputWrapper = ({ label, children, required = false }: InputWrapperProps) => (
  <div className="relative border-b border-gray-100 py-3 group focus-within:border-red-600 transition-all">
    <label className="block text-[10px] font-black text-gray-400 mb-1 uppercase tracking-tighter">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    {children}
  </div>
);

interface PostAdProps {
  onComplete: () => void;
  onAddListing: (ad: Listing) => void;
  currentUser: User;
  defaultLocation: string;
}

const PostAd: React.FC<PostAdProps> = ({ onComplete, onAddListing, currentUser, defaultLocation }) => {
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  
  const [locationName, setLocationName] = useState(defaultLocation === 'کل ایران' ? 'تهران' : defaultLocation);
  const [latLng, setLatLng] = useState<{lat: number, lng: number} | null>(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>(CITY_COORDS[locationName] || [35.6892, 51.3890]);

  const [images, setImages] = useState<string[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [attributes, setAttributes] = useState<Record<string, any>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const city = defaultLocation === 'کل ایران' ? 'تهران' : defaultLocation;
    setLocationName(city);
    if (CITY_COORDS[city]) setMapCenter(CITY_COORDS[city]);
  }, [defaultLocation]);

  const handleAttributeChange = (name: string, value: any) => {
    setAttributes(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // In real app, we'd upload to a server. Here we use object URLs.
      const newImages = Array.from(files).map((file: File) => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImages].slice(0, 10));
    }
  };

  const handleAiOptimize = async () => {
    if (!title) return;
    setIsOptimizing(true);
    const result = await suggestListingOptimization(title, description);
    if (result) {
      if (result.suggestedTitle) setTitle(result.suggestedTitle);
      if (result.suggestedDescription) setDescription(result.suggestedDescription);
    }
    setIsOptimizing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !subCategory || !title || !price) {
      alert("لطفاً تمام فیلدهای ضروری را تکمیل کنید.");
      return;
    }

    const newAd: Listing = {
      id: 'l' + Date.now(),
      title,
      description,
      price: Number(price),
      currency: 'تومان',
      category,
      location: `ایران، ${locationName}`,
      images: images.length > 0 ? images : ['https://picsum.photos/seed/placeholder/400/300'],
      seller: currentUser,
      createdAt: 'لحظاتی پیش',
      condition: attributes.condition || 'Used - Good',
      tags: [subCategory, ...(attributes.brand ? [attributes.brand] : [])]
    };

    onAddListing(newAd);
    alert("آگهی شما با موفقیت ثبت شد و در لیست آگهی‌ها قرار گرفت.");
    onComplete();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-32" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
        <button onClick={onComplete} className="text-gray-400 hover:text-gray-900 transition-colors">
           <svg className="w-6 h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <h1 className="text-xl font-black text-gray-900 tracking-tighter">ثبت آگهی جدید</h1>
        <div className="w-6 h-6"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-12">
          
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-2xl bg-red-50 flex items-center justify-center text-red-700 text-xs font-black">۱</div>
              <h2 className="text-lg font-black text-gray-900">دسته‌بندی و محل</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputWrapper label="دسته اصلی" required>
                <select value={category} onChange={(e) => { setCategory(e.target.value); setSubCategory(''); }} className="w-full bg-transparent outline-none text-sm font-bold text-gray-800 appearance-none">
                  <option value="">انتخاب کنید</option>
                  {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </InputWrapper>

              {category && (
                <InputWrapper label="زیردسته" required>
                  <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} className="w-full bg-transparent outline-none text-sm font-bold text-gray-800 appearance-none">
                    <option value="">انتخاب کنید</option>
                    {SUB_CATEGORIES[category]?.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </InputWrapper>
              )}
            </div>

            <div onClick={() => setShowMapModal(true)} className="p-5 rounded-3xl bg-gray-50 border border-gray-100 cursor-pointer hover:border-red-400 transition-all">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-red-700">📍</div>
                 <div className="flex-1">
                    <p className="text-sm font-black text-gray-900">{locationName}</p>
                    <p className="text-[10px] text-gray-400 mt-1">تغییر موقعیت روی نقشه</p>
                 </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
             <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-2xl bg-red-50 flex items-center justify-center text-red-700 text-xs font-black">۲</div>
              <h2 className="text-lg font-black text-gray-900">محتوای آگهی</h2>
             </div>

             <InputWrapper label="عنوان آگهی" required>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثلاً: آیفون ۱۵ پرومکس سلامت باتری ۱۰۰" className="w-full bg-transparent outline-none text-sm font-black text-gray-900" />
             </InputWrapper>
             
             <div className="bg-gray-50 border-2 border-gray-100 rounded-3xl p-5 focus-within:border-red-600 transition-all">
                <label className="block text-[10px] font-black text-red-700 mb-2 uppercase">قیمت (تومان) *</label>
                <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" placeholder="عدد وارد کنید" className="w-full bg-transparent outline-none text-2xl font-black text-gray-900" />
             </div>

             <InputWrapper label="توضیحات">
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} placeholder="ویژگی‌های کالا..." className="w-full bg-transparent outline-none text-sm font-medium text-gray-700 mt-2 resize-none leading-7" />
             </InputWrapper>

             <div className="space-y-4">
                <label className="text-sm font-black text-gray-900">تصاویر آگهی ({images.length}/۱۰)</label>
                <div className="flex flex-wrap gap-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="w-24 h-24 rounded-2xl overflow-hidden relative border border-gray-100 group">
                      <img src={img} className="w-full h-full object-cover" alt="" />
                      <button onClick={() => setImages(images.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-red-700 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                         <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3"/></svg>
                      </button>
                    </div>
                  ))}
                  <button onClick={() => fileInputRef.current?.click()} className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 hover:border-red-700 transition-all">
                    <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="2.5"/></svg>
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} hidden multiple accept="image/*" />
                </div>
             </div>
          </div>

          <button onClick={handleSubmit} className="w-full bg-red-700 text-white font-black py-5 rounded-[2.5rem] shadow-2xl active:scale-95 transition-all text-lg">
            انتشار آگهی
          </button>
        </div>

        <div className="hidden md:block">
          <div className="bg-[#12141d] p-8 rounded-[3.5rem] text-white shadow-2xl sticky top-24">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-xl">✨</div>
                <h3 className="font-black text-lg">دستیار هوشمند</h3>
             </div>
             <p className="text-[11px] text-gray-400 leading-6 mb-8">
                نیکجو با استفاده از هوش مصنوعی آگهی شما را تحلیل کرده و پیشنهاداتی برای فروش سریع‌تر ارائه می‌دهد.
             </p>
             <button onClick={handleAiOptimize} disabled={isOptimizing || !title} className="w-full bg-red-700 text-white font-black py-4 rounded-2xl disabled:opacity-50">
                {isOptimizing ? 'در حال تحلیل...' : 'بهینه‌سازی با AI'}
             </button>
          </div>
        </div>
      </div>

      {showMapModal && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden flex flex-col h-[70vh]">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                 <h3 className="font-black">تعیین موقعیت روی نقشه</h3>
                 <button onClick={() => setShowMapModal(false)}>بستن</button>
              </div>
              <div className="flex-1 bg-gray-100 relative">
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-8 h-8 bg-red-700 rounded-full border-4 border-white shadow-xl"></div>
                 </div>
                 <p className="absolute bottom-4 left-0 right-0 text-center text-[10px] text-gray-400">شبیه‌ساز نقشه: مرکز تصویر موقعیت آگهی است.</p>
              </div>
              <div className="p-6">
                 <button onClick={() => setShowMapModal(false)} className="w-full bg-red-700 text-white font-black py-4 rounded-2xl">تایید این موقعیت</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default PostAd;
