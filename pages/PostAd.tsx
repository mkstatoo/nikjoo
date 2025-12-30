
import React, { useState, useEffect, useRef } from 'react';
import { CATEGORIES, SUB_CATEGORIES } from '../constants.tsx';
import { suggestListingOptimization, moderateContent } from '../services/gemini.ts';
import { User, Listing } from '../types.ts';

interface InputWrapperProps {
  label: string;
  children?: React.ReactNode;
  required?: boolean;
}

const InputWrapper = ({ label, children, required = false }: InputWrapperProps) => (
  <div className="relative border-b border-gray-100 py-3 group focus-within:border-red-600 transition-all text-right">
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
  const [hpValue, setHpValue] = useState(''); 
  const [formStartTime] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationName, setLocationName] = useState(defaultLocation === 'کل ایران' ? 'تهران' : defaultLocation);
  const [showMapModal, setShowMapModal] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file: File) => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImages].slice(0, 10));
    }
  };

  const removeImage = (idx: number) => {
    setImages(prev => {
      const filtered = prev.filter((_, i) => i !== idx);
      if (mainImageIndex === idx) setMainImageIndex(0);
      else if (mainImageIndex > idx) setMainImageIndex(mainImageIndex - 1);
      return filtered;
    });
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
    if (hpValue) return;
    const timeTaken = (Date.now() - formStartTime) / 1000;
    if (timeTaken < 5) {
      alert("سیستم امنیتی: لطفاً فرم را با دقت بیشتری تکمیل کنید.");
      return;
    }
    if (!category || !subCategory || !title || !price) {
      alert("لطفاً تمام فیلدهای ضروری (*) را تکمیل کنید.");
      return;
    }

    setIsSubmitting(true);
    const modResult = await moderateContent(`${title} ${description}`);
    if (!modResult.isSafe) {
      alert(`⚠️ محتوای آگهی تایید نشد: ${modResult.reason}`);
      setIsSubmitting(false);
      return;
    }

    let finalImages = [...images];
    if (finalImages.length > 0) {
      const mainImg = finalImages.splice(mainImageIndex, 1)[0];
      finalImages.unshift(mainImg);
    } else {
      finalImages = ['https://picsum.photos/seed/placeholder/400/300'];
    }

    const newAd: Listing = {
      id: 'l' + Date.now(),
      title,
      description,
      price: Number(price),
      currency: 'تومان',
      category,
      location: `ایران، ${locationName}`,
      images: finalImages,
      seller: currentUser,
      createdAt: 'لحظاتی پیش',
      condition: 'Used - Good',
      tags: [subCategory],
      views: 0,
      status: 'active'
    };

    onAddListing(newAd);
    alert("آگهی شما با موفقیت ثبت شد.");
    onComplete();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-32" dir="rtl">
      <div className="opacity-0 absolute -z-50 pointer-events-none h-0 w-0 overflow-hidden">
        <input type="text" value={hpValue} onChange={(e) => setHpValue(e.target.value)} tabIndex={-1} autoComplete="off" />
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
                    <p className="text-[10px] text-gray-400 mt-1">تغییر موقعیت روی نقشه هوشمند</p>
                 </div>
              </div>
            </div>
          </div>

          <div className="space-y-8 text-right">
             <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-2xl bg-red-50 flex items-center justify-center text-red-700 text-xs font-black">۲</div>
              <h2 className="text-lg font-black text-gray-900">محتوای آگهی</h2>
             </div>
             <InputWrapper label="عنوان آگهی" required>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثلاً: سامسونگ S23 Ultra" className="w-full bg-transparent outline-none text-sm font-black text-gray-900 text-right" />
             </InputWrapper>
             <div className="bg-gray-50 border-2 border-gray-100 rounded-3xl p-5 focus-within:border-red-600 transition-all">
                <label className="block text-[10px] font-black text-red-700 mb-2 uppercase text-right">قیمت نهایی (تومان) *</label>
                <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" placeholder="مبلغ را وارد کنید" className="w-full bg-transparent outline-none text-2xl font-black text-gray-900 text-right" />
             </div>
             <InputWrapper label="توضیحات">
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} placeholder="ویژگی‌ها..." className="w-full bg-transparent outline-none text-sm font-medium text-gray-700 mt-2 resize-none leading-7 text-right" />
             </InputWrapper>
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-black text-gray-900">تصاویر (تا ۱۰ عدد)</label>
                </div>
                <div className="flex flex-wrap gap-4">
                  {images.map((img, idx) => (
                    <div key={idx} onClick={() => setMainImageIndex(idx)} className={`w-28 h-28 rounded-2xl overflow-hidden relative border-4 transition-all cursor-pointer group ${mainImageIndex === idx ? 'border-red-700 shadow-lg scale-105' : 'border-gray-100'}`}>
                      <img src={img} className="w-full h-full object-cover" alt="" />
                      {mainImageIndex === idx && <div className="absolute top-0 left-0 right-0 bg-red-700 text-white text-[8px] font-black py-1 text-center">عکس اصلی</div>}
                      <button onClick={(e) => { e.stopPropagation(); removeImage(idx); }} className="absolute bottom-1 right-1 bg-black/60 text-white p-1.5 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-red-700 transition-all">
                         <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3"/></svg>
                      </button>
                    </div>
                  ))}
                  {images.length < 10 && (
                    <button onClick={() => fileInputRef.current?.click()} className="w-28 h-28 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 hover:border-red-700 hover:bg-red-50 transition-all text-gray-300 hover:text-red-700">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="2.5"/></svg>
                    </button>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} hidden multiple accept="image/*" />
                </div>
             </div>
          </div>

          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className={`w-full bg-red-700 text-white font-black py-5 rounded-[2.5rem] shadow-2xl active:scale-95 transition-all text-lg flex items-center justify-center gap-3 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'در حال پایش امنیتی...' : 'تایید و انتشار آگهی'}
          </button>
        </div>

        <div className="hidden md:block">
          <div className="bg-[#12141d] p-8 rounded-[3.5rem] text-white shadow-2xl sticky top-24 text-right">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-xl">🛡️</div>
                <h3 className="font-black text-lg">امنیت هوشمند</h3>
             </div>
             <p className="text-[11px] text-gray-400 leading-6 mb-8">نیکجو از مدل‌های زبانی Gemini برای شناسایی آگهی‌های اسپم و کلاهبرداری استفاده می‌کند.</p>
             <button onClick={handleAiOptimize} disabled={isOptimizing || !title} className="w-full bg-white/10 text-white font-black py-4 rounded-2xl disabled:opacity-50 hover:bg-white/20 transition-all">
                {isOptimizing ? 'تحلیل...' : 'بهبود با AI'}
             </button>
          </div>
        </div>
      </div>

      {showMapModal && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden flex flex-col h-[70vh] text-right">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                 <h3 className="font-black">تعیین محدوده آگهی</h3>
                 <button onClick={() => setShowMapModal(false)} className="text-sm font-bold text-gray-400">بستن</button>
              </div>
              <div className="flex-1 bg-gray-100 relative">
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-red-700 rounded-full border-4 border-white shadow-xl animate-bounce"></div>
                 </div>
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