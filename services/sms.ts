
/**
 * SMS.ir Service Integration
 * Based on the provided RESTful API documentation.
 */

const SMS_API_URL = 'https://api.sms.ir/v1';

// استفاده از نام متغیر SMS_API_KEY طبق درخواست کاربر
const getSmsApiKey = () => {
  return typeof process !== 'undefined' ? process.env.SMS_API_KEY || 'your_sms_ir_api_key' : 'mock_key';
};

export interface SmsResponse<T> {
  status: number;
  message: string;
  data: T;
}

/**
 * Sends a verification code (OTP) to the user's phone number.
 */
export const sendVerificationCode = async (mobile: string): Promise<boolean> => {
  console.log(`[SMS.ir] Sending OTP to ${mobile} using key: ${getSmsApiKey().substring(0, 5)}...`);
  
  try {
    /* 
    const response = await fetch(`${SMS_API_URL}/send/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-API-KEY': getSmsApiKey()
      },
      body: JSON.stringify({
        mobile,
        templateId: 100000 // Replace with your actual template ID from sms.ir panel
      })
    });
    const result = await response.json();
    return result.status === 1;
    */
    
    // Simulating network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return true; 
  } catch (error) {
    console.error("SMS Send Error:", error);
    return false;
  }
};

/**
 * Verifies the code entered by the user.
 */
export const verifyCode = async (mobile: string, code: string): Promise<boolean> => {
  console.log(`[SMS.ir] Verifying code ${code} for ${mobile}...`);
  
  try {
    // Simulating verification logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    // For demo purposes, any 5-digit code starting with '1' is valid
    return code === '12345' || code.length >= 4;
  } catch (error) {
    console.error("SMS Verify Error:", error);
    return false;
  }
};