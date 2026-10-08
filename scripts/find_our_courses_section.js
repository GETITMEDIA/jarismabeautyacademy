const fs = require('fs');

['courses.html', 'index.html'].forEach(file => {
  const html = fs.readFileSync(file, 'utf8');
  const start = html.indexOf('>Our Courses</h2>');
  if (start !== -1) {
    // Find parent elementor container or section
    console.log(file, 'found Our Courses at index', start);
    // Find what follows up to the next section
    const snippet = html.substring(start - 200, start + 2500);
    console.log('--- SNIPPET FOR ' + file + ' ---');
    console.log(snippet.substring(0, 1000));
  }
});
