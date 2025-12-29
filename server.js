
const express = require('express');
const path = require('path');
const app = express();

// در هاست‌های اشتراکی، پورت توسط پلتفرم (Passenger) تعیین می‌شود
const PORT = process.env.PORT || 3000;

// مسیر ریشه پروژه - در cPanel معمولاً فایل‌ها در ریشه هستند
const rootPath = __dirname;

// سرو کردن فایل‌های استاتیک (CSS, JS, Images)
app.use(express.static(rootPath));

// روت اصلی
app.get('/', (req, res) => {
  res.sendFile(path.join(rootPath, 'index.html'));
});

// مدیریت تمام روت‌های دیگر برای اپلیکیشن‌های تک‌صفحه‌ای (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(rootPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
