
const express = require('express');
const path = require('path');
const app = express();

// در cPanel، پورت توسط Phusion Passenger مدیریت می‌شود
const PORT = process.env.PORT || 3000;

// مسیر فایل‌های استاتیک
app.use(express.static(__dirname));

// روت اصلی برای SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// اجرای سرور
app.listen(PORT, () => {
  console.log(`Nikjoo is running on port ${PORT}`);
});
