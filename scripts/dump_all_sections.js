const fs = require('fs');

function dumpFile(file, outfile) {
  const html = fs.readFileSync(file, 'utf8');
  // Extract from <div data-elementor-type="wp-page" to before footer
  const start = html.indexOf('data-elementor-type="wp-page"');
  const footerStart = html.indexOf('<footer');
  if (start !== -1 && footerStart !== -1) {
    const mainContent = html.substring(start, footerStart);
    fs.writeFileSync(outfile, mainContent);
    console.log('Saved', outfile, mainContent.length, 'bytes');
  } else {
    console.log('Could not find boundaries for', file);
  }
}

dumpFile('live_home.html', 'content_home.html');
dumpFile('live_about.html', 'content_about.html');
dumpFile('live_courses.html', 'content_courses.html');
dumpFile('live_contact.html', 'content_contact.html');
