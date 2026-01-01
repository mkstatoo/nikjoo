const express = require('express');
const path = require('path');
const compression = require('compression');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(compression());

// تنظیم دستی MIME Type قبل از ارسال فایل‌ها به مرورگر
// این بخش حیاتی است تا مرورگر فایل‌های .tsx را به عنوان اسکریپت جاوااسکریپت معتبر بشناسد
const staticOptions = {
    setHeaders: (res, filePath) => {
        const ext = path.extname(filePath);
        if (ext === '.tsx' || ext === '.ts' || ext === '.jsx') {
            // تنظیم هدر استاندارد جاوااسکریپت برای فایل‌های تایپ‌اسکریپت
            res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
        }
    }
};

// سرو فایل‌های استاتیک (تصاویر، استایل‌ها و اسکریپت‌ها)
app.use(express.static(__dirname, staticOptions));

// مدیریت مسیرهای سمت کلاینت (SPA) و تزریق کلیدهای API
app.get('*', (req, res) => {
    // اگر درخواستی برای فایلی بود که وجود نداشت، به جای index.html خطای ۴۰۴ بدهد
    if (path.extname(req.url) && !req.url.endsWith('.html')) {
        return res.status(404).send('File Not Found');
    }

    const indexPath = path.join(__dirname, 'index.html');
    if (!fs.existsSync(indexPath)) {
        return res.status(500).send('Critical Error: index.html missing');
    }

    let content = fs.readFileSync(indexPath, 'utf8');
    
    // تزریق کلیدهای امنیتی از متغیرهای محیطی سی‌پنل
    const apiKey = process.env.API_KEY || "";
    const smsKey = process.env.SMS_API_KEY || "";
    
    content = content.replace(
        'window.process = { env: { API_KEY: "" } };',
        `window.process = { env: { API_KEY: "${apiKey}", SMS_API_KEY: "${smsKey}" } };`
    );
    
    res.setHeader('Content-Type', 'text/html');
    res.send(content);
});

app.listen(PORT, () => {
    console.log(`Nikjoo server is live on port ${PORT}`);
});