
/**
 * Sends OTP via internal proxy
 */
export const sendVerificationCode = async (mobile: string): Promise<boolean> => {
  console.log(`[Nikjoo] Requesting OTP for ${mobile} via internal proxy...`);
  try {
    const res = await fetch('/api/sms/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: mobile })
    });
    
    const data = await res.json();
    if (res.ok && data.ok) {
      console.log('[Nikjoo] SMS Send Success:', data);
      return true;
    }
    console.error('[Nikjoo] SMS Send Failed:', data);
    return false;
  } catch (err) {
    console.error('[Nikjoo] SMS Fetch Error:', err);
    return false;
  }
};

/**
 * Verifies the code via internal proxy
 */
export const verifyCode = async (mobile: string, code: string): Promise<boolean> => {
  console.log(`[Nikjoo] Verifying code ${code} for ${mobile}...`);
  try {
    const res = await fetch('/api/sms/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile, code })
    });
    const data = await res.json();
    console.log('[Nikjoo] Verify Result:', data);
    return data.ok ?? false;
  } catch (err) {
    console.error('[Nikjoo] Verify Error:', err);
    return false;
  }
};
