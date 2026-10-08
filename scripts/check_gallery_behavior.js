const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

// Find eael filter gallery
const galleryIndex = html.indexOf('eael-filter-gallery');
console.log('eael-filter-gallery found at:', galleryIndex);

if (galleryIndex !== -1) {
  const snippet = html.substring(galleryIndex - 200, galleryIndex + 3000);
  console.log('--- GALLERY SNIPPET ---\n', snippet);
}
