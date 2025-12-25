
import React, { useState, useEffect, useRef } from 'react';
import { CATEGORIES, SUB_CATEGORIES } from '../constants';
import { suggestListingOptimization } from '../services/gemini';

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
  defaultLocation: string;
}

const PostAd: React.FC<PostAdProps> = ({ onComplete, defaultLocation }) => {
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
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const city = defaultLocation === 'کل ایران' ? 'تهران' : defaultLocation;
    setLocationName(city);
    if (CITY_COORDS[city]) setMapCenter(CITY_COORDS[city]);
  }, [defaultLocation]);

  const handleAttributeChange = (name: string, value: any) => {
    setAttributes(prev => ({ ...prev, [name]: value }));
  };

  const renderDynamicFields = () => {
    if (!category) return null;

    const conditionNeeded = ['وسایل نقلیه', 'کالای دیجیتال', 'خانه و آشپزخانه', 'وسایل شخصی'].includes(category);
    const brandNeeded = ['وسایل نقلیه', 'کالای دیجیتال'].includes(category);

    const commonCondition = (
      <InputWrapper label="وضعیت کالا" required>
        <select 
          value={attributes.condition || ''} 
          onChange={e => handleAttributeChange('condition', e.target.value)} 
          className="w-full bg-transparent outline-none text-sm font-bold text-gray-800 appearance-none"
        >
          <option value="">انتخاب کنید</option>
          <option value="New">نو (آکبند)</option>
          <option value="Used - Like New">در حد نو</option>
          <option value="Used - Good">کارکرده - تمیز</option>
          <option value="Used - Fair">کارکرده - دارای خط و خش</option>
        </select>
      </InputWrapper>
    );

    const brandInput = (
      <InputWrapper label="برند" required>
        <input 
          type="text" 
          placeholder="نام برند را وارد کنید" 
          value={attributes.brand || ''} 
          onChange={e => handleAttributeChange('brand', e.target.value)} 
          className="w-full bg-transparent outline-none text-sm font-bold text-gray-800" 
        />
      </InputWrapper>
    );

    return (
      <div className="bg-gray-50/50 rounded-[2.5rem] p-6 sm:p-8 space-y-8 border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-500 shadow-sm">
        <div className="flex items-center gap-3">
           <div className="w-1.5 h-6 bg-red-700 rounded-full"></div>
           <h3 className="text-lg font-black text-gray-900">مشخصات فنی {subCategory || category}</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
          {brandNeeded && brandInput}
          {conditionNeeded && commonCondition}

          {/* املاک */}
          {category === 'املاک' && (
            <>
              <InputWrapper label="متراژ (متر)" required>
                <input type="number" placeholder="مثلاً ۹۵" onChange={e => handleAttributeChange('area', e.target.value)} className="w-full bg-transparent outline-none text-sm font-bold text-gray-800" />
              </InputWrapper>
              {subCategory !== 'زمین' && (
                <>
                  <InputWrapper label="تعداد اتاق">
                    <select onChange={e => handleAttributeChange('rooms', e.target.value)} className="w-full bg-transparent outline-none text-sm font-bold text-gray-800 appearance-none">
                      <option value="0">بدون اتاق</option>
                      <option value="1">۱</option>
                      <option value="2">۲</option>
                      <option value="3">۳</option>
                      <option value="4+">۴ یا بیشتر</option>
                    </select>
                  </InputWrapper>
                  <InputWrapper label="سال ساخت">
                    <input type="number" placeholder="مثلاً ۱۴۰۰" onChange={e => handleAttributeChange('build_year', e.target.value)} className="w-full bg-transparent outline-none text-sm font-bold text-gray-800" />
                  </InputWrapper>
                </>
              )}
            </>
          )}

          {/* استخدام و کاریابی */}
          {category === 'استخدام و کاریابی' && (
            <>
              <InputWrapper label="نوع همکاری" required>
                <select onChange={e => handleAttributeChange('job_type', e.target.value)} className="w-full bg-transparent outline-none text-sm font-bold text-gray-800 appearance-none">
                  <option value="full_time">تمام وقت</option>
                  <option value="part_time">پاره وقت</option>
                  <option value="remote">دورکاری</option>
                  <option value="project">پروژه‌ای</option>
                </select>
              </InputWrapper>
              <InputWrapper label="حقوق پیشنهادی">
                <select onChange={e => handleAttributeChange('salary', e.target.value)} className="w-full bg-transparent outline-none text-sm font-bold text-gray-800 appearance-none">
                  <option value="ministry">حقوق وزارت کار</option>
                  <option value="10-15">۱۰ تا ۱۵ میلیون</option>
                  <option value="negotiable">توافقی</option>
                </select>
              </InputWrapper>
            </>
          )}
        </div>
      </div>
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file: File) => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImages].slice(0, 10));
    }
  };

  const handleAiOptimize = async () => {
    if (!title) {
      alert("لطفاً ابتدا عنوانی وارد کنید.");
      return;
    }
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
    if (!latLng) {
      alert("لطفاً موقعیت آگهی را روی نقشه مشخص کنید.");
      return;
    }
    if (!category || !subCategory || !title || !price) {
      alert("لطفاً فیلدهای ضروری را تکمیل کنید.");
      return;
    }
    alert("آگهی شما با موفقیت ثبت شد.");
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-2">
              <div className="relative border-b border-gray-100 py-3">
                <label className="block text-[10px] font-black text-gray-400 mb-1">دسته اصلی *</label>
                <select value={category} onChange={(e) => { setCategory(e.target.value); setSubCategory(''); }} className="w-full bg-transparent outline-none text-sm font-bold text-gray-800 appearance-none">
                  <option value="">انتخاب کنید</option>
                  {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              {category && (
                <div className="relative border-b border-gray-100 py-3 animate-in fade-in duration-300">
                  <label className="block text-[10px] font-black text-gray-400 mb-1">زیردسته *</label>
                  <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} className="w-full bg-transparent outline-none text-sm font-bold text-gray-800 appearance-none">
                    <option value="">انتخاب کنید</option>
                    {SUB_CATEGORIES[category]?.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              )}
            </div>

            <div 
              onClick={() => setShowMapModal(true)}
              className="mx-2 mt-4 p-5 rounded-3xl bg-gray-50 border border-gray-100 group cursor-pointer hover:border-red-400 transition-all active:scale-[0.98]"
            >
              <div className="flex items-center justify-between mb-3">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">موقعیت روی نقشه *</label>
                 {latLng && <span className="text-[10px] text-green-600 bg-green-50 px-2 py-1 rounded-full font-black">✓ ثبت شد</span>}
              </div>
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-red-700">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeWidth="2"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2"/></svg>
                 </div>
                 <div className="flex-1">
                    <p className="text-sm font-black text-gray-900">{locationName}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{latLng ? 'موقعیت جغرافیایی تأیید شد' : 'برای تعیین نقطه دقیق کلیک کنید'}</p>
                 </div>
              </div>
            </div>
          </div>

          {renderDynamicFields()}

          <div className="space-y-8">
             <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-2xl bg-red-50 flex items-center justify-center text-red-700 text-xs font-black">۲</div>
              <h2 className="text-lg font-black text-gray-900">محتوای آگهی</h2>
             </div>

             <div className="relative border-b border-gray-100 py-3">
                <label className="block text-[10px] font-black text-gray-400 mb-1">عنوان آگهی *</label>
                <input ref={titleInputRef} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثلاً: آیفون ۱۵ پرومکس سلامت باتری ۱۰۰" className="w-full bg-transparent outline-none text-sm font-black text-gray-900 mt-2" />
             </div>
             
             <div className="relative border border-gray-100 rounded-2xl px-5 py-4 bg-gray-50/20">
                <label className="block text-[10px] font-black text-red-700 mb-1">قیمت (تومان) *</label>
                <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" placeholder="عدد وارد کنید" className="w-full bg-transparent outline-none text-lg font-black text-gray-900" />
             </div>

             <div className="relative border-b border-gray-100 py-3">
                <label className="block text-[10px] font-black text-gray-400 mb-1">توضیحات</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} placeholder="ویژگی‌های کالا..." className="w-full bg-transparent outline-none text-sm font-medium text-gray-700 mt-2 resize-none leading-7" />
             </div>

             <div className="space-y-4">
                <label className="text-sm font-black text-gray-900">تصاویر آگهی ({images.length}/۱۰)</label>
                <div className="flex flex-wrap gap-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="w-24 h-24 rounded-2xl overflow-hidden relative shadow-sm border border-gray-100">
                      <img src={img} className="w-full h-full object-cover" alt="" />
                    </div>
                  ))}
                  <button onClick={() => fileInputRef.current?.click()} className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 hover:border-red-700 transition-all">
                    <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="2.5" strokeLinecap="round"/></svg>
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} hidden multiple accept="image/*" />
                </div>
             </div>
          </div>

          <button onClick={handleSubmit} className="w-full bg-red-700 hover:bg-red-800 text-white font-black py-5 rounded-[2.5rem] shadow-2xl transition-all active:scale-[0.98] text-lg">
            انتشار آگهی
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-[#12141d] p-8 rounded-[3.5rem] text-white shadow-2xl sticky top-24 overflow-hidden border border-white/5">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl border border-white/10 shadow-inner">✨</div>
                <h3 className="font-black text-lg">ارتقا با AI</h3>
              </div>
              <button 
                onClick={handleAiOptimize} 
                disabled={isOptimizing || !title} 
                className="w-full bg-red-700 hover:bg-red-600 text-white font-black py-4 rounded-2xl shadow-xl disabled:opacity-50 transition-colors"
              >
                {isOptimizing ? 'در حال تحلیل...' : 'بهینه‌سازی محتوا'}
              </button>
              <p className="mt-8 text-[11px] text-gray-400 leading-6">
                هوش مصنوعی نیکجو متن شما را بررسی کرده و بهترین عنوان و توضیحات را برای جذب مشتری پیشنهاد می‌دهد.
              </p>
            </div>
          </div>
        </div>
      </div>

      {showMapModal && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-md flex items-center justify-center p-0 sm:p-8 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl rounded-none sm:rounded-[3.5rem] h-full sm:h-[85vh] flex flex-col overflow-hidden relative shadow-2xl">
            <div className="absolute top-6 left-6 right-6 z-10 flex justify-between items-center pointer-events-none">
               <button onClick={() => setShowMapModal(false)} className="pointer-events-auto w-12 h-12 bg-white/90 backdrop-blur rounded-2xl shadow-2xl flex items-center justify-center text-gray-900">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" strokeLinecap="round"/></svg>
               </button>
            </div>
            <div className="flex-1 relative bg-gray-100">
              <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                scrolling="no" 
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapCenter[1]-0.01},${mapCenter[0]-0.01},${mapCenter[1]+0.01},${mapCenter[0]+0.01}&layer=mapnik&marker=${mapCenter[0]},${mapCenter[1]}`}
                className="w-full h-full grayscale opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="flex flex-col items-center -mt-10">
                   <div className="bg-gray-900 text-white text-[9px] font-black px-4 py-2 rounded-full mb-3 shadow-2xl animate-bounce">نقطه آگهی</div>
                   <div className="w-10 h-10 bg-red-700 rounded-full shadow-[0_0_30px_rgba(185,28,28,0.5)] flex items-center justify-center border-4 border-white">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                   </div>
                </div>
              </div>
            </div>
            <div className="p-8 bg-white border-t border-gray-100">
               <button 
                  onClick={() => { setLatLng({lat: mapCenter[0], lng: mapCenter[1]}); setShowMapModal(false); }}
                  className="w-full bg-red-700 text-white font-black py-5 rounded-[2.5rem] text-lg shadow-2xl active:scale-95 transition-all hover:bg-red-800"
               >
                  تأیید موقعیت مکانی
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostAd;
