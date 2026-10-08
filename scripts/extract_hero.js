const fs = require('fs');

const html = fs.readFileSync('live_home.html', 'utf8');

// Print first 500 lines or search for slider/banner
console.log('--- HEADER & HERO SECTION ---');
const mainIndex = html.indexOf('<main') !== -1 ? html.indexOf('<main') : html.indexOf('<header');
const headerSnippet = html.substring(html.indexOf('<header'), html.indexOf('<header') + 3000);
console.log('HEADER:\n', headerSnippet);

// Find hero or slider or first section
const bodyStart = html.indexOf('<body');
const firstSections = html.substring(bodyStart, bodyStart + 8000);
console.log('\nFIRST 8000 CHARS OF BODY:\n', firstSections);
