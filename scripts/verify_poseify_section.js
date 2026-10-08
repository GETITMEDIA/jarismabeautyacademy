const fs = require('fs');

['courses.html', 'index.html'].forEach(file => {
  const html = fs.readFileSync(file, 'utf8');
  const pos = html.indexOf('our-courses-section');
  console.log(file, 'has our-courses-section:', pos !== -1);
  if (pos !== -1) {
    console.log(html.substring(pos - 50, pos + 400));
  }
});
