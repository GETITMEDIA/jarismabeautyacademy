const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const parentStart = html.indexOf('elementor-element-c20dd51');
console.log('parentStart:', parentStart);

if (parentStart !== -1) {
  const snippet = html.substring(parentStart - 100, parentStart + 3500);
  console.log('--- 28 YEARS SECTION SNIPPET ---\n', snippet);
}
