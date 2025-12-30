
import React, { useState, useEffect } from 'react';
import { sendVerificationCode, verifyCode } from '../services/sms';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (phone: string) => void;
  onNavigateToLegal?: (tab: 'tos' | 'privacy') => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, onNavigateToLegal }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(120);
  const [error, setError] = useState('');

  const isAdminPhone = phone === '09120000000';

  useEffect(() => {
    let interval: any;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isOpen) return null;

  const handleSendOtp = async () => {
    if (!/^09\d{9}$/.test(phone)) {
      setError('لطفاً یک شماره موبایل معتبر وارد کنید (مثلاً 09123456789)');
      return;
    }
    setError('');
    setIsLoading(true);
    
    // اگر شماره ادمین بود، مستقیم به مرحله بعد برو
    if (isAdminPhone) {
      setIsLoading(false);
      setStep('otp');
      setTimer(999);
      return;
    }

    const success = await sendVerificationCode(phone);
    setIsLoading(false);
    if (success) {
      setStep('otp');
      setTimer(120);
    } else {
      setError('خطا در ارسال پیامک. لطفاً دوباره تلاش کنید.');
    }
  };

  const handleVerify = async () => {
    if (otp.length < 4 && !isAdminPhone) {
      setError('کد تایید معتبر نیست');
      return;
    }
    setError('');
    setIsLoading(true);
    
    // برای ادمین هر کدی یا ورود مستقیم پذیرفته است
    const success = isAdminPhone ? true : await verifyCode(phone, otp);
    
    setIsLoading(false);
    if (success) {
      onSuccess(phone);
      onClose();
      // ریست کردن فرم برای استفاده بعدی
      setStep('phone');
      setPhone('');
      setOtp('');
    } else {
      setError('کد وارد شده صحیح نیست');
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" dir="rtl">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border-4 border-white">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black text-gray-900 tracking-tighter">
              {isAdminPhone ? 'ورود مدیر ارشد' : (step === 'phone' ? 'ورود یا ثبت‌نام' : 'تایید شماره موبایل')}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" strokeLinecap="round"/></svg>
            </button>
          </div>

          {step === 'phone' ? (
            <div className="space-y-6">
              <p className="text-sm text-gray-500 font-medium leading-7">
                {isAdminPhone 
                  ? 'خوش آمدید قربان. برای دسترسی به پنل مدیریت دکمه زیر را بزنید.' 
                  : 'برای استفاده از امکانات نیکجو، شماره موبایل خود را وارد کنید.'}
              </p>
              <div className="relative">
                <input 
                  type="tel"
                  placeholder="0912XXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full bg-gray-50 border-2 rounded-2xl px-6 py-4 text-left font-black tracking-widest text-lg focus:bg-white outline-none transition-all ${isAdminPhone ? 'border-red-700 text-red-700' : 'border-gray-100 focus:border-red-700'}`}
                />
                {isAdminPhone && (
                  <div className="absolute -top-3 right-4 bg-red-700 text-white text-[8px] px-2 py-1 rounded-full font-black animate-bounce shadow-lg">
                    حساب مدیریت شناسایی شد 🛡️
                  </div>
                )}
              </div>
              {error && <p className="text-xs text-red-600 font-bold">{error}</p>}
              <button 
                onClick={handleSendOtp}
                disabled={isLoading}
                className="w-full bg-red-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-red-100 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? 'در حال بررسی...' : (isAdminPhone ? 'تایید هویت مدیر' : 'دریافت کد تایید')}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {isAdminPhone ? (
                <div className="text-center py-4">
                   <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-700 text-3xl mx-auto mb-4 border border-red-100">🛡️</div>
                   <p className="text-sm font-black text-gray-900 mb-2">دسترسی سطح ادمین آماده است</p>
                   <p className="text-[10px] text-gray-400 font-bold mb-6">نیازی به وارد کردن کد برای شماره مدیریت نیست.</p>
                   <button 
                    onClick={handleVerify}
                    className="w-full bg-gray-900 text-white font-black py-4 rounded-2xl shadow-xl active:scale-95 transition-all"
                  >
                    ورود فوری به پنل مدیریت
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-500 font-medium leading-7 text-center">
                    کد ۵ رقمی ارسال شده به شماره <span className="text-gray-900 font-black">{phone}</span> را وارد کنید.
                  </p>
                  <div className="relative">
                    <input 
                      type="number"
                      placeholder="— — — — —"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 text-center font-black tracking-[0.5em] text-2xl focus:border-red-700 focus:bg-white outline-none transition-all"
                      autoFocus
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    {timer > 0 ? (
                      <span className="text-gray-400">ارسال مجدد در {formatTime(timer)} m</span>
                    ) : (
                      <button onClick={handleSendOtp} className="text-red-700 hover:underline">ارسال مجدد کد</button>
                    )}
                    <button onClick={() => { setStep('phone'); setError(''); }} className="text-blue-700">ویرایش شماره</button>
                  </div>
                  {error && <p className="text-xs text-red-600 font-bold">{error}</p>}
                  <button 
                    onClick={handleVerify}
                    disabled={isLoading}
                    className="w-full bg-red-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-red-100 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isLoading ? 'در حال تایید...' : 'تایید و ورود'}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
        <div className="bg-gray-50 p-6 text-center border-t border-gray-100">
          <p className="text-[10px] text-gray-400 font-bold leading-5">
            نیکجو مارکت؛ پلتفرم هوشمند خرید و فروش بدون واسطه
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;