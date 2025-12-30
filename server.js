
const express = require('express');
const path = require('path');
const compression = require('compression');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(compression());

/**
 * تنظیم MIME Type صحیح برای فایل‌های تایپ‌اسکریپت.
 * این کار برای اینکه مرورگر فایل‌های .tsx را به عنوان اسکریپت بپذیرد حیاتی است.
 */
app.use((req, res, next) => {
    const ext = path.extname(req.url);
    if (ext === '.tsx' || ext === '.ts') {
        res.setHeader('Content-Type', 'application/javascript');
    }
    next();
});

// سرو فایل‌های استاتیک از پوشه ریشه
app.use(express.static(__dirname));

/**
 * مدیریت روتینگ SPA:
 * اگر درخواستی پسوند فایل داشته باشد و در پوشه استاتیک پیدا نشود، 404 برمی‌گردانیم.
 * این کار مانع از آن می‌شود که مرورگر بجای اسکریپت، محتوای index.html را دریافت کند.
 */
app.get('*', (req, res) => {
    // جلوگیری از ارسال index.html برای فایل‌های گمشده (مثل عکس یا اسکریپت)
    if (path.extname(req.url)) {
        return res.status(404).send('فایل مورد نظر یافت نشد');
    }

    const indexPath = path.join(__dirname, 'index.html');
    if (!fs.existsSync(indexPath)) {
        return res.status(500).send('خطای بحرانی: فایل index.html در سرور موجود نیست.');
    }

    try {
        let content = fs.readFileSync(indexPath, 'utf8');
        
        // تزریق کلیدهای API از متغیرهای محیطی هاست
        const apiKey = process.env.API_KEY || "";
        const smsKey = process.env.SMS_API_KEY || "";
        
        content = content.replace(
            'window.process = { env: { API_KEY: "" } };',
            `window.process = { env: { API_KEY: "${apiKey}", SMS_API_KEY: "${smsKey}" } };`
        );
        
        res.send(content);
    } catch (err) {
        console.error('خطا در سرو index.html:', err);
        res.status(500).send('خطای داخلی سرور');
    }
});

app.listen(PORT, () => {
    console.log(`سرور نیکجو با موفقیت روی پورت ${PORT} اجرا شد.`);
});
