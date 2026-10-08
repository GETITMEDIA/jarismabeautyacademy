const fs = require('fs');

['index.html', 'courses.html'].forEach(f => {
  const html = fs.readFileSync(f, 'utf8');
  const index = html.indexOf('eael-img-accordion');
  if (index !== -1) {
    const snippet = html.substring(index, index + 300);
    console.log(f, snippet);
  }
});
