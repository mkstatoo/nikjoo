
const express = require('express');
const path = require('path');
const app = express();

// استفاده از پورت تعریف شده توسط هاست یا پورت ۳۰۰۰ به صورت پیش‌فرض
const PORT = process.env.PORT || 3000;

// سرو کردن تمام فایل‌های پروژه (HTML, JS, TSX, CSS)
app.use(express.static(path.join(__dirname, '.')));

// هدایت تمام درخواست‌ها به index.html برای پشتیبانی از روتینگ React (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Nikjoo Market is live on port ${PORT}`);
});
