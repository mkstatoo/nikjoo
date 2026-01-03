
const express = require('express');
const path = require('path');
const https = require('https');
const fs = require('fs');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(compression());
app.use(express.json());

const distPath = path.join(__dirname, 'dist');
const SMS_TOKEN = process.env.SMS_API_KEY || 'c74c5246b5014c9fa01d4ed3be8fde7e';

// حافظه موقت برای ذخیره کدها (Mobile -> Code)
const otpStore = new Map();

/**
 * Proxy for MeliPayamak SEND OTP API
 */
app.post('/api/sms/send-otp', (req, res) => {
    const { to } = req.body;
    if (!to || !/^09\d{9}$/.test(to)) {
        return res.status(400).json({ ok: false, msg: 'شماره موبایل اشتباه است' });
    }

    const postData = JSON.stringify({ to: String(to) });
    const options = {
        hostname: 'console.melipayamak.com',
        port: 443,
        path: `/api/send/otp/${SMS_TOKEN}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    const smsReq = https.request(options, (smsRes) => {
        let body = '';
        smsRes.on('data', (chunk) => body += chunk);
        smsRes.on('end', () => {
            try {
                const parsedBody = JSON.parse(body);
                console.log('[Nikjoo SMS] Send Result:', parsedBody);
                
                // اگر ارسال موفق بود و کد در پاسخ وجود داشت، آن را ذخیره می‌کنیم
                if (smsRes.statusCode === 200 && parsedBody.code) {
                    otpStore.set(String(to), String(parsedBody.code));
                    // تنظیم انقضا برای کد (مثلاً ۵ دقیقه)
                    setTimeout(() => otpStore.delete(String(to)), 5 * 60 * 1000);
                }

                res.status(smsRes.statusCode).json({ ok: smsRes.statusCode === 200, result: parsedBody });
            } catch (e) {
                res.status(500).json({ ok: false, msg: 'Error parsing SMS response' });
            }
        });
    });

    smsReq.on('error', (err) => {
        console.error('[Nikjoo SMS] Send Connection Error:', err);
        res.status(500).json({ ok: false });
    });

    smsReq.write(postData);
    smsReq.end();
});

/**
 * Local Verification Logic (Much more reliable)
 */
app.post('/api/sms/verify', (req, res) => {
    const { mobile, code } = req.body;
    const cleanMobile = String(mobile).trim();
    const cleanCode = String(code).trim();

    console.log(`[Nikjoo SMS] Local Verify Request: ${cleanMobile} -> ${cleanCode}`);

    // Admin Override
    if (cleanMobile === '09120000000' && cleanCode === '12345') {
        return res.json({ ok: true });
    }

    // بررسی کد در حافظه موقت سرور
    const storedCode = otpStore.get(cleanMobile);
    
    if (storedCode && storedCode === cleanCode) {
        // کد صحیح است؛ آن را مصرف (حذف) می‌کنیم
        otpStore.delete(cleanMobile);
        console.log(`[Nikjoo SMS] Verification SUCCESS for ${cleanMobile}`);
        return res.json({ ok: true });
    }

    console.log(`[Nikjoo SMS] Verification FAILED for ${cleanMobile}. Expected: ${storedCode || 'NONE'}`);
    res.json({ ok: false, msg: 'کد تایید اشتباه است.' });
});

app.use(express.static(distPath));

app.get('*', (req, res) => {
    const indexPath = path.join(distPath, 'index.html');
    if (!fs.existsSync(indexPath)) {
        return res.status(200).send('<div dir="rtl" style="text-align:center;padding:50px;">Nikjoo Market: Live</div>');
    }
    res.sendFile(indexPath);
});

app.listen(PORT, () => {
    console.log(`Nikjoo Production Server active on port ${PORT}`);
});
