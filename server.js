const express = require('express');
const path = require('path');
const compression = require('compression');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(compression());

// اولویت با فایل‌های استاتیک بیلد شده در پوشه dist است
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
    // مسیر فایل index.html در پوشه dist بعد از بیلد
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    
    // اگر فایل بیلد شده هنوز وجود ندارد (اولین بار)
    if (!fs.existsSync(indexPath)) {
        return res.status(200).send(`
            <div style="font-family:sans-serif; text-align:center; padding: 50px;">
                <h2>Nikjoo Market</h2>
                <p>Application is building... Please run <b>npm run build</b> or wait a moment.</p>
                <script>setTimeout(() => location.reload(), 5000);</script>
            </div>
        `);
    }

    let content = fs.readFileSync(indexPath, 'utf8');
    
    // تزریق متغیرهای محیطی از سی‌پنل به فایل index.html بیلد شده
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
    console.log(`Production server is running on port ${PORT}`);
});