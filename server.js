const express = require('express');
const path = require('path');
const compression = require('compression');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(compression());

// تنظیم هدر Content-Type برای پسوندهای خاص قبل از سرو فایل‌های استاتیک
app.use((req, res, next) => {
    const ext = path.extname(req.url);
    if (['.tsx', '.ts', '.jsx'].includes(ext)) {
        res.setHeader('Content-Type', 'application/javascript');
    }
    next();
});

// سرو فایل‌های استاتیک
app.use(express.static(__dirname));

app.get('*', (req, res) => {
    // اگر درخواست فایل فیزیکی است (مثل تصاویر یا اسکریپت‌ها) و تا اینجا پیدا نشده، ۴۰۴ بده
    if (path.extname(req.url)) {
        return res.status(404).send('Not Found');
    }

    const indexPath = path.join(__dirname, 'index.html');
    if (!fs.existsSync(indexPath)) {
        return res.status(500).send('فایل اصلی سیستم پیدا نشد.');
    }

    let content = fs.readFileSync(indexPath, 'utf8');
    
    // تزریق کلیدها از متغیرهای محیطی هاست
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
    console.log(`Nikjoo Market is active on port ${PORT}`);
});