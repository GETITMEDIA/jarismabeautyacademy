const fs = require('fs');

const pages = ['live_home.html', 'live_about.html', 'live_courses.html', 'live_contact.html'];

const allCss = new Set();
const allJs = new Set();
const allImgs = new Set();

pages.forEach(p => {
  const html = fs.readFileSync(p, 'utf8');

  // CSS
  const cssMatches = html.match(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi) || [];
  cssMatches.forEach(m => {
    const href = m.match(/href=["']([^"']+)["']/);
    if (href) allCss.add(href[1]);
  });

  // Scripts
  const jsMatches = html.match(/<script[^>]+src=["']([^"']+)["'][^>]*>/gi) || [];
  jsMatches.forEach(m => {
    const src = m.match(/src=["']([^"']+)["']/);
    if (src) allJs.add(src[1]);
  });

  // Images and background URLs
  const imgMatches = html.match(/(?:src|href|url\()=["']?([^"')\s>]+\.(?:jpg|jpeg|png|gif|webp|svg))/gi) || [];
  imgMatches.forEach(m => {
    const clean = m.replace(/^(?:src|href|url\()=["']?/i, '').replace(/['"]$/,'');
    allImgs.add(clean);
  });
});

console.log('--- ALL UNIQUE CSS FILES (' + allCss.size + ') ---');
Array.from(allCss).sort().forEach(c => console.log(c));

console.log('\n--- ALL UNIQUE JS FILES (' + allJs.size + ') ---');
Array.from(allJs).sort().forEach(j => console.log(j));

console.log('\n--- ALL UNIQUE IMAGE/MEDIA (' + allImgs.size + ') ---');
Array.from(allImgs).sort().forEach(i => console.log(i));
