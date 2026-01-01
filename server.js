
const express = require('express');
const path = require('path');
const compression = require('compression');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(compression());

// تعریف دقیق MIME Type‌ها قبل از سرو فایل‌های استاتیک
express.static.mime.define({
    'application/javascript': ['tsx', 'ts', 'jsx']
});

// سرو فایل‌های استاتیک با تنظیمات هدر صحیح
app.use(express.static(__dirname, {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));

app.get('*', (req, res) => {
    // اگر درخواست برای یک فایل فیزیکی است که وجود ندارد، 404 بده
    if (path.extname(req.url)) {
        return res.status(404).send('Not Found');
    }

    const indexPath = path.join(__dirname, 'index.html');
    if (!fs.existsSync(indexPath)) {
        return res.status(500).send('Critical Error: index.html not found');
    }

    let content = fs.readFileSync(indexPath, 'utf8');
    
    // تزریق کلیدهای API
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
