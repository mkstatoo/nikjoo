const express = require('express');
const path = require('path');
const compression = require('compression');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(compression());

// میان‌افزار سفارشی برای تضمین ارسال MIME Type درست قبل از هر چیز دیگری
app.use((req, res, next) => {
    const ext = path.extname(req.url);
    if (ext === '.tsx' || ext === '.ts' || ext === '.jsx') {
        res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
    }
    next();
});

// تنظیمات هدر برای Express Static
const staticOptions = {
    setHeaders: (res, filePath) => {
        const ext = path.extname(filePath);
        if (ext === '.tsx' || ext === '.ts' || ext === '.jsx') {
            res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
            res.setHeader('X-Content-Type-Options', 'nosniff');
        }
    }
};

app.use(express.static(__dirname, staticOptions));

app.get('*', (req, res) => {
    // اگر درخواست فایل است (مثلاً عکس یا اسکریپت) و پیدا نشده، ۴۰۴ بده
    if (path.extname(req.url)) {
        return res.status(404).send('Not Found');
    }

    const indexPath = path.join(__dirname, 'index.html');
    if (!fs.existsSync(indexPath)) {
        return res.status(500).send('Critical Error: index.html not found in root.');
    }

    let content = fs.readFileSync(indexPath, 'utf8');
    
    // تزریق متغیرهای محیطی از سی‌پنل به کلاینت
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
    console.log(`Nikjoo Market is running on port ${PORT}`);
});