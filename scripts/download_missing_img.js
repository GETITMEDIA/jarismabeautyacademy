const https = require('https');
const fs = require('fs');
const path = require('path');

const imgs = [
  'g3383789c6a04c67413fc2a8ff597195c01515f29f091aea66f83ee58608d3ffa4f56227906aa99452c29f030771267f49c1f974b39a01d4d2df85e68cc7adac6_1280-5653459-300x216.jpg',
  'g3383789c6a04c67413fc2a8ff597195c01515f29f091aea66f83ee58608d3ffa4f56227906aa99452c29f030771267f49c1f974b39a01d4d2df85e68cc7adac6_1280-5653459.jpg'
];

const destDir = path.join(__dirname, 'assets', '2025', '04');
fs.mkdirSync(destDir, { recursive: true });

imgs.forEach(f => {
  const fileUrl = 'https://jarismabeautyacademy.com/wp-content/uploads/2025/04/' + f;
  const filePath = path.join(destDir, f);
  const file = fs.createWriteStream(filePath);
  https.get(fileUrl, res => {
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('Downloaded', f, 'size:', fs.statSync(filePath).size);
    });
  });
});
