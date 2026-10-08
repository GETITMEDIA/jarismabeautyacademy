const fs = require('fs');

function inspect(file) {
  console.log('====================================');
  console.log('FILE:', file);
  console.log('====================================');
  if (!fs.existsSync(file)) {
    console.log('Not found:', file);
    return;
  }
  const html = fs.readFileSync(file, 'utf8');

  // Images
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let m;
  const imgs = new Set();
  while ((m = imgRegex.exec(html)) !== null) {
    imgs.add(m[1]);
  }
  console.log('\n--- IMAGES (' + imgs.size + ') ---');
  imgs.forEach(i => console.log(i));

  // CSS URLs (backgrounds, etc.)
  const urlRegex = /url\(([^)]+)\)/gi;
  const urls = new Set();
  while ((m = urlRegex.exec(html)) !== null) {
    const clean = m[1].replace(/['"]/g, '').trim();
    if (!clean.startsWith('data:')) {
      urls.add(clean);
    }
  }
  console.log('\n--- BACKGROUND / CSS URLS (' + urls.size + ') ---');
  urls.forEach(u => console.log(u));
}

inspect('live_home.html');
inspect('live_about.html');
