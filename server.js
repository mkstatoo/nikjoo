const express = require('express');
const path = require('path');
const compression = require('compression');
const fs = require('fs');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(compression());
app.use(express.json()); // برای پارس کردن بدنه درخواست‌های JSON

// آدرس پوشه خروجی Vite
const distPath = path.join(__dirname, 'dist');

/**
 * API Proxy for MeliPayamak (Fixes CORS and hides API Key)
 */
app.post('/api/sms/send-otp', (req, res) => {
    const { to } = req.body;
    const smsToken = process.env.SMS_API_KEY || 'c74c5246b5014c9fa01d4ed3be8fde7e';

    if (!to) {
        return res.status(400).json({ error: 'شماره موبایل الزامی است' });
    }

    const data = JSON.stringify({ to });

    const options = {
        hostname: 'console.melipayamak.com',
        port: 443,
        path: `/api/send/otp/${smsToken}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        }
    };

    const smsReq = https.request(options, (smsRes) => {
        let responseData = '';
        smsRes.on('data', (chunk) => { responseData += chunk; });
        smsRes.on('end', () => {
            res.status(smsRes.statusCode).send(responseData);
        });
    });

    smsReq.on('error', (e) => {
        console.error('SMS Proxy Error:', e);
        res.status(500).json({ error: 'خطا در برقراری ارتباط با پنل پیامک' });
    });

    smsReq.write(data);
    smsReq.end();
});

// سرو فایل‌های استاتیک
app.use(express.static(distPath));

app.get('*', (req, res) => {
    const indexPath = path.join(distPath, 'index.html');
    
    if (!fs.existsSync(indexPath)) {
        return res.status(200).send(`
            <div style="font-family:sans-serif; text-align:center; padding: 50px; direction:rtl;">
                <h2 style="color:#d91b1b">نیکجو مارکت</h2>
                <p>سیستم در حال آماده‌سازی است...</p>
                <script>setTimeout(() => location.reload(), 5000);</script>
            </div>
        `);
    }

    let content = fs.readFileSync(indexPath, 'utf8');
    const apiKey = process.env.API_KEY || "";
    const smsKey = process.env.SMS_API_KEY || "";
    
    content = content.replace(
        'window.process = { env: { API_KEY: "", SMS_API_KEY: "" } };',
        `window.process = { env: { API_KEY: "${apiKey}", SMS_API_KEY: "${smsKey}" } };`
    );
    
    res.setHeader('Content-Type', 'text/html');
    res.send(content);
});

app.listen(PORT, () => {
    console.log(`Nikjoo Market is running on port ${PORT}`);
});