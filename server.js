
const express = require('express');
const path = require('path');
const compression = require('compression');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(compression());

// تنظیم هدر برای فایل‌های TSX تا مرورگر آن‌ها را به عنوان اسکریپت بشناسد
app.use((req, res, next) => {
    if (req.url.endsWith('.tsx') || req.url.endsWith('.ts')) {
        res.setHeader('Content-Type', 'application/javascript');
    }
    next();
});

app.use(express.static(__dirname));

app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, 'index.html');
    let content = fs.readFileSync(indexPath, 'utf8');
    
    // تزریق کلید API از تنظیمات هاست به داخل کد HTML
    const apiKey = process.env.API_KEY || "";
    const smsKey = process.env.SMS_API_KEY || "";
    
    content = content.replace(
        'window.process = { env: { API_KEY: "" } };',
        `window.process = { env: { API_KEY: "${apiKey}", SMS_API_KEY: "${smsKey}" } };`
    );
    
    res.send(content);
});

app.listen(PORT, () => {
    console.log(`Nikjoo live on ${PORT}`);
});
