const fs = require('fs');

function analyzeFile(file) {
  const html = fs.readFileSync(file, 'utf8');
  console.log('====================================');
  console.log('STRUCTURE OF:', file);
  console.log('====================================');

  // Find all sections or elementor containers
  const elementorSections = html.match(/<section[^>]+class="[^"]*elementor-section[^"]*"[^>]*>/gi) || [];
  console.log('Found elementor sections:', elementorSections.length);

  // Let's find all widgets / elements
  const widgets = html.match(/class="elementor-widget-container"[\s\S]*?<\/div>\s*<\/div>/gi) || [];
  console.log('Found widget containers:', widgets.length);

  // Let's print all data-settings or background images on elementor elements
  const bgElements = html.match(/<[^>]+style="[^"]*background[^"]*"[^>]*>/gi) || [];
  console.log('Inline background elements:', bgElements.length);
  bgElements.forEach(el => console.log('BG EL:', el.substring(0, 200)));

  // Let's find all headings in order
  const headings = html.match(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi) || [];
  console.log('\n--- HEADINGS (' + headings.length + ') ---');
  headings.forEach(h => console.log(h.replace(/<[^>]+>/g, '').trim()));
}

['live_home.html', 'live_about.html', 'live_courses.html', 'live_contact.html'].forEach(analyzeFile);
