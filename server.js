const express = require('express');
const path = require('path');
const compression = require('compression');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(compression());

// تنظیم هدر صحیح برای ماژول‌های جاوااسکریپت و تایپ‌اسکریپت
app.use((req, res, next) => {
    const ext = path.extname(req.url);
    if (['.tsx', '.ts', '.jsx', '.js'].includes(ext)) {
        res.setHeader('Content-Type', 'text/javascript');
    }
    next();
});

// سرو فایل‌های استاتیک
app.use(express.static(__dirname));

app.get('*', (req, res) => {
    // جلوگیری از روتینگ اشتباه برای فایل‌های فیزیکی
    if (path.extname(req.url)) {
        return res.status(404).send('Not Found');
    }

    const indexPath = path.join(__dirname, 'index.html');
    if (!fs.existsSync(indexPath)) {
        return res.status(500).send('Critical Error: index.html not found in ' + __dirname);
    }

    let content = fs.readFileSync(indexPath, 'utf8');
    
    // تزریق کلیدهای API از متغیرهای محیطی پنل
    const apiKey = process.env.API_KEY || "";
    const smsKey = process.env.SMS_API_KEY || "";
    
    content = content.replace(
        'window.process = { env: { API_KEY: "" } };',
        `window.process = { env: { API_KEY: "${apiKey}", SMS_API_KEY: "${smsKey}" } };`
    );
    
    res.send(content);
});

app.listen(PORT, () => {
    console.log(`Nikjoo Market is running on port ${PORT}`);
});