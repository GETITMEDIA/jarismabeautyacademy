const https = require('https');
const fs = require('fs');
const path = require('path');

const fonts = [
  'fa-brands-400.woff2',
  'fa-brands-400.ttf',
  'fa-regular-400.woff2',
  'fa-regular-400.ttf',
  'fa-solid-900.woff2',
  'fa-solid-900.ttf'
];

const base = 'https://jarismabeautyacademy.com/wp-content/plugins/elementor/assets/lib/font-awesome/webfonts/';
const targetDir = path.join(__dirname, 'vendor/plugins/elementor/assets/lib/font-awesome/webfonts');
fs.mkdirSync(targetDir, { recursive: true });

fonts.forEach(f => {
  const filePath = path.join(targetDir, f);
  if (fs.existsSync(filePath)) return;
  const file = fs.createWriteStream(filePath);
  https.get(base + f, res => {
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('Downloaded font:', f);
    });
  });
});
