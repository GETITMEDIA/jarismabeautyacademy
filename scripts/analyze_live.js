const fs = require('fs');

const pages = ['live_home.html', 'live_about.html', 'live_courses.html', 'live_contact.html'];

pages.forEach(file => {
  if (!fs.existsSync(file)) return;
  const html = fs.readFileSync(file, 'utf8');
  console.log('====================================');
  console.log('FILE:', file);
  console.log('====================================');

  // Stylesheets
  const cssMatches = html.match(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi) || [];
  console.log('\n--- CSS FILES (' + cssMatches.length + ') ---');
  cssMatches.forEach(m => {
    const href = m.match(/href=["']([^"']+)["']/);
    if (href) console.log(href[1]);
  });

  // Images
  const imgMatches = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi) || [];
  console.log('\n--- IMAGES (' + imgMatches.length + ') ---');
  const imgs = new Set();
  imgMatches.forEach(m => {
    const src = m.match(/src=["']([^"']+)["']/);
    if (src) imgs.add(src[1]);
  });
  imgs.forEach(i => console.log(i));

  // Background images in inline style or css
  const bgMatches = html.match(/background(?:-image)?:\s*url\(([^)]+)\)/gi) || [];
  console.log('\n--- BG IMAGES (' + bgMatches.length + ') ---');
  const bgs = new Set();
  bgMatches.forEach(m => {
    const url = m.match(/url\(([^)]+)\)/i);
    if (url) bgs.add(url[1].replace(/['"]/g, ''));
  });
  bgs.forEach(b => console.log(b));
});
