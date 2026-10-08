const fs = require('fs');
const path = require('path');

const files = ['index.html', 'about.html', 'courses.html', 'contact.html'];
const missing = new Set();
const checked = new Set();

files.forEach(file => {
  const html = fs.readFileSync(file, 'utf8');

  // Match src="..." and href="..."
  const attrRegex = /(?:src|href)=["']([^"'#?]+)(?:\?[^"']*)?["']/gi;
  let m;
  while ((m = attrRegex.exec(html)) !== null) {
    const ref = m[1];
    // Ignore external urls, mailto, tel, javascript
    if (ref.startsWith('http://') || ref.startsWith('https://') || ref.startsWith('//') || ref.startsWith('mailto:') || ref.startsWith('tel:') || ref.startsWith('javascript:')) {
      continue;
    }
    // Clean anchor
    const cleanRef = ref.split('#')[0];
    if (!cleanRef) continue;

    checked.add(cleanRef);
    const fullPath = path.join(__dirname, cleanRef);
    if (!fs.existsSync(fullPath)) {
      missing.add(`${file} -> ${cleanRef}`);
    }
  }

  // Match url(...)
  const urlRegex = /url\(["']?([^"')#?]+)(?:\?[^"']*)?["']?\)/gi;
  while ((m = urlRegex.exec(html)) !== null) {
    const ref = m[1].replace(/['"]/g, '').trim();
    if (ref.startsWith('http://') || ref.startsWith('https://') || ref.startsWith('//') || ref.startsWith('data:')) {
      continue;
    }
    checked.add(ref);
    const fullPath = path.join(__dirname, ref);
    if (!fs.existsSync(fullPath)) {
      missing.add(`${file} -> ${ref}`);
    }
  }
});

console.log('Total local references checked:', checked.size);
console.log('Total missing references:', missing.size);
missing.forEach(m => console.log('MISSING:', m));
