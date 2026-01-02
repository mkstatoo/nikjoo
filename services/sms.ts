/**
 * MeliPayamak Service Integration (Internal Proxy Version)
 */

/**
 * Sends a verification code (OTP) to the user's phone number.
 * This calls our own server's proxy to avoid CORS issues.
 */
export const sendVerificationCode = async (mobile: string): Promise<boolean> => {
  console.log(`[Nikjoo] Requesting OTP for ${mobile} via internal proxy...`);
  
  try {
    const response = await fetch('/api/sms/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: mobile
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log("[Nikjoo] SMS Proxy Success:", result);
      return true;
    } else {
      console.error("[Nikjoo] SMS Proxy Failed:", response.status);
      return false; 
    }
  } catch (error) {
    console.error("[Nikjoo] SMS Fetch Error:", error);
    return false; 
  }
};

/**
 * Verifies the code entered by the user.
 */
export const verifyCode = async (mobile: string, code: string): Promise<boolean> => {
  console.log(`[Nikjoo] Verifying code ${code} for ${mobile}...`);
  
  try {
    // شبیه‌سازی تایید کد برای محیط دمو
    await new Promise(resolve => setTimeout(resolve, 800));
    // هر کدی که با ۱ شروع شود یا کد تستی ۱۲۳۴۵
    return code === '12345' || (code.length >= 4 && code.startsWith('1'));
  } catch (error) {
    console.error("Verification error:", error);
    return false;
  }
};