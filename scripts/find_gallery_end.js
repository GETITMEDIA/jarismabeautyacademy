const fs = require('fs');

['courses.html', 'index.html'].forEach(file => {
  const html = fs.readFileSync(file, 'utf8');
  const galleryStart = html.indexOf('eael-filterable-gallery');
  // Find next section after gallery
  const nextSection = html.indexOf('Time to Groom Your Career with Beauty Course', galleryStart);
  console.log(file, 'gallery starts at', galleryStart, 'next section at', nextSection);
});
