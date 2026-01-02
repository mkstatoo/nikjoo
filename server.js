const express = require('express');
const path = require('path');
const compression = require('compression');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(compression());

// آدرس پوشه خروجی Vite
const distPath = path.join(__dirname, 'dist');

// سرو فایل‌های استاتیک (JS, CSS, Images)
app.use(express.static(distPath));

app.get('*', (req, res) => {
    const indexPath = path.join(distPath, 'index.html');
    
    // اگر فایل بیلد هنوز وجود ندارد (اولین اجرا)
    if (!fs.existsSync(indexPath)) {
        return res.status(200).send(`
            <div style="font-family:sans-serif; text-align:center; padding: 50px; direction:rtl;">
                <h2 style="color:#d91b1b">نیکجو مارکت</h2>
                <p>سیستم در حال آماده‌سازی است...</p>
                <p style="font-size:13px; color:#666">لطفاً در ترمینال دستور <b>npm run build</b> را اجرا کنید.</p>
                <script>setTimeout(() => location.reload(), 5000);</script>
            </div>
        `);
    }

    let content = fs.readFileSync(indexPath, 'utf8');
    
    // تزریق کلیدها از Environment Variables به فایل HTML بیلد شده
    const apiKey = process.env.API_KEY || "";
    const smsKey = process.env.SMS_API_KEY || "";
    
    // جایگزینی فیلد خالی با مقادیر واقعی در تگ اسکریپت
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