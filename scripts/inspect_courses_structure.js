const fs = require('fs');

const html = fs.readFileSync('courses.html', 'utf8');

const headings = html.match(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi) || [];
console.log('--- HEADINGS IN courses.html ---');
headings.forEach(h => console.log(h.replace(/<[^>]+>/g, '').trim()));
