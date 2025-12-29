
const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;
const rootPath = path.resolve(__dirname);

// لاگ برای بررسی مسیر در هاست
console.log('Server is starting. Directory:', rootPath);

// سرو کردن فایل‌های استاتیک
app.use(express.static(rootPath));

// روت اصلی
app.get('/', (req, res) => {
  res.sendFile(path.join(rootPath, 'index.html'));
});

// پشتیبانی از SPA Routing (هدایت تمام درخواست‌ها به ایندکس)
app.get('*', (req, res) => {
  const file = path.join(rootPath, 'index.html');
  res.sendFile(file, (err) => {
    if (err) {
      console.error('File send error:', err);
      res.status(404).send('فایل index.html یافت نشد. مسیر را چک کنید.');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Application is running on port ${PORT}`);
});
