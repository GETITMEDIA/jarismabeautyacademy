const fs = require('fs');

const html = fs.readFileSync('live_home.html', 'utf8');

const elementorIndex = html.indexOf('data-elementor-type="wp-page"');
console.log('Elementor page index:', elementorIndex);

if (elementorIndex !== -1) {
  const content = html.substring(elementorIndex, elementorIndex + 12000);
  console.log('--- CONTENT START (12000 chars) ---\n');
  console.log(content);
}
