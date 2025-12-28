
import React, { useState, useEffect, useRef } from 'react';
import { CATEGORIES, SUB_CATEGORIES } from '../constants';
import { suggestListingOptimization, moderateContent } from '../services/gemini';
import { User, Listing } from '../types';

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
  
  // Anti-Bot States
  const [hpValue, setHpValue] = useState(''); // Honeypot
  const [formStartTime] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [locationName, setLocationName] = useState(defaultLocation === 'کل ایران' ? 'تهران' : defaultLocation);
  const [showMapModal, setShowMapModal] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [attributes, setAttributes] = useState<Record<string, any>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Honeypot check
    if (hpValue) {
      console.warn("Bot detected via Honeypot");
      return;
    }

    // 2. Submission timing check
    const timeTaken = (Date.now() - formStartTime) / 1000;
    if (timeTaken < 4) {
      alert("سیستم امنیتی: لطفاً فرم را با دقت بیشتری پر کنید (ثبت خیلی سریع مجاز نیست).");
      return;
    }

    if (!category || !subCategory || !title || !price) {
      alert("لطفاً تمام فیلدهای ضروری را تکمیل کنید.");
      return;
    }

    setIsSubmitting(true);

    // 3. AI Security & Spam Check
    const modResult = await moderateContent(`${title} ${description}`);
    if (!modResult.isSafe || modResult.isBotLikely) {
      alert(`⚠️ متاسفانه آگهی شما توسط سیستم امنیتی رد شد.\nعلت: ${modResult.reason || 'محتوای مشکوک یا رباتیک'}`);
      setIsSubmitting(false);
      return;
    }

    // Fixed: Added missing required properties 'views' and 'status' to satisfy the Listing interface.
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
      tags: [subCategory, ...(attributes.brand ? [attributes.brand] : [])],
      views: 0,
      status: 'active'
    };

    onAddListing(newAd);
    alert("آگهی شما با موفقیت ثبت شد و در صف انتشار قرار گرفت.");
    onComplete();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-32" dir="rtl">
      {/* Honeypot field (hidden from humans) */}
      <div className="opacity-0 absolute -z-50 pointer-events-none h-0 w-0 overflow-hidden">
        <input 
          type="text" 
          value={hpValue} 
          onChange={(e) => setHpValue(e.target.value)} 
          tabIndex={-1} 
          autoComplete="off" 
        />
      </div>

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

          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className={`w-full bg-red-700 text-white font-black py-5 rounded-[2.5rem] shadow-2xl active:scale-95 transition-all text-lg flex items-center justify-center gap-3 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                در حال بررسی امنیتی...
              </>
            ) : 'انتشار آگهی'}
          </button>
        </div>

        <div className="hidden md:block">
          <div className="bg-[#12141d] p-8 rounded-[3.5rem] text-white shadow-2xl sticky top-24">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-xl">🛡️</div>
                <h3 className="font-black text-lg">امنیت نیکجو</h3>
             </div>
             <p className="text-[11px] text-gray-400 leading-6 mb-8">
                نیکجو از لایه‌های امنیتی هوشمند برای شناسایی ربات‌ها و آگهی‌های اسپم استفاده می‌کند. تمامی محتوا توسط Gemini AI پایش می‌شود.
             </p>
             <button onClick={handleAiOptimize} disabled={isOptimizing || !title} className="w-full bg-white/10 text-white font-black py-4 rounded-2xl disabled:opacity-50 hover:bg-white/20 transition-all">
                {isOptimizing ? 'در حال تحلیل...' : 'بهینه‌سازی با هوش مصنوعی'}
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
                 <p className="absolute bottom-4 left-0 right-0 text-center text-[10px] text-gray-400">شبیه‌ساز نقشه نیکجو</p>
              </div>
              <div className="p-6">
                 <button onClick={() => setShowMapModal(false)} className="w-full bg-red-700 text-white font-black py-4 rounded-2xl">تایید موقعیت</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default PostAd;
