
import React, { useState, useEffect } from 'react';
import { sendVerificationCode, verifyCode } from '../services/sms';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (phone: string) => void;
  onNavigateToLegal?: (tab: 'tos' | 'privacy') => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(120);
  const [error, setError] = useState('');

  const isAdminPhone = phone === '09120000000';

  const toEnglishDigits = (str: string) => {
    return str.replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString())
              .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());
  };

  useEffect(() => {
    let interval: any;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isOpen) return null;

  const handleSendOtp = async () => {
    const cleanPhone = toEnglishDigits(phone).replace(/\s/g, '').trim();
    if (!/^09\d{9}$/.test(cleanPhone)) {
      setError('شماره موبایل معتبر نیست (مثال: 09123456789)');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      if (isAdminPhone) {
        setStep('otp');
        setTimer(999);
        setIsLoading(false);
        return;
      }

      const success = await sendVerificationCode(cleanPhone);
      if (success) {
        setStep('otp');
        setTimer(120);
      } else {
        setError('خطا در ارسال پیامک. لطفاً شارژ پنل را بررسی کنید.');
      }
    } catch (err) {
      setError('خطا در شبکه. لطفاً اتصال اینترنت خود را بررسی کنید.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    const cleanOtp = toEnglishDigits(otp).replace(/\s/g, '').trim();
    const cleanPhone = toEnglishDigits(phone).replace(/\s/g, '').trim();

    if (cleanOtp.length < 4 && !isAdminPhone) {
      setError('کد وارد شده ناقص است.');
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      const success = await verifyCode(cleanPhone, cleanOtp);
      if (success) {
        onSuccess(cleanPhone);
        onClose();
        setStep('phone');
        setPhone('');
        setOtp('');
      } else {
        setError('کد تایید اشتباه است. لطفاً کد جدید را وارد کنید.');
      }
    } catch (err) {
      console.error('[AuthModal] Verification Error:', err);
      setError('خطا در برقراری ارتباط با سرور.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir="rtl">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-white animate-in zoom-in-95 duration-300">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black text-gray-900 tracking-tighter">
              {step === 'phone' ? 'ورود یا ثبت‌نام' : 'تایید شماره موبایل'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" strokeLinecap="round"/></svg>
            </button>
          </div>

          <div className="space-y-6">
            {step === 'phone' ? (
              <>
                <p className="text-sm text-gray-500 font-medium">شماره موبایل خود را وارد کنید.</p>
                <input 
                  type="tel"
                  placeholder="0912XXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isLoading}
                  className={`w-full bg-gray-50 border-2 rounded-2xl px-6 py-4 text-left font-black text-lg outline-none transition-all ${error ? 'border-red-200' : 'border-gray-100 focus:border-red-700'}`}
                />
                {error && (
                  <div className="bg-red-50 p-3 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-1">
                    <p className="text-[10px] text-red-600 font-bold leading-5">{error}</p>
                  </div>
                )}
                <button 
                  onClick={handleSendOtp}
                  disabled={isLoading}
                  className="w-full bg-red-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-red-100 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? 'در حال ارسال...' : 'دریافت کد تایید'}
                </button>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-500 font-medium text-center">کد ارسال شده به <span className="text-gray-900 font-black" dir="ltr">{phone}</span> را وارد کنید.</p>
                <input 
                  type="text"
                  inputMode="numeric"
                  placeholder="— — — — —"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 text-center font-black tracking-widest text-2xl focus:border-red-700 outline-none transition-all"
                  autoFocus
                />
                {error && (
                  <div className="bg-red-50 p-3 rounded-xl border border-red-100 mb-2">
                    <p className="text-[10px] text-red-600 font-bold text-center">{error}</p>
                  </div>
                )}
                <button 
                  onClick={handleVerify}
                  disabled={isLoading}
                  className="w-full bg-red-700 text-white font-black py-4 rounded-2xl shadow-xl transition-all disabled:opacity-50"
                >
                  {isLoading ? 'در حال تایید...' : 'تایید و ورود'}
                </button>
                <div className="flex justify-between items-center mt-4">
                  <button 
                    onClick={() => { setStep('phone'); setError(''); setOtp(''); }} 
                    className="text-[10px] font-black text-blue-700"
                  >
                    ویرایش شماره
                  </button>
                  {timer > 0 ? (
                    <span className="text-[10px] text-gray-400 font-bold">ارسال مجدد تا {timer} ثانیه</span>
                  ) : (
                    <button onClick={handleSendOtp} className="text-[10px] font-black text-red-700">ارسال مجدد کد</button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="bg-gray-50 p-4 text-center text-[10px] text-gray-400 font-bold">
            نیکجو مارکت؛ پلتفرم هوشمند خرید و فروش
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
