const fs = require('fs');

function inspectSections(file) {
  console.log('====================================================');
  console.log('ANALYZING:', file);
  console.log('====================================================');
  const html = fs.readFileSync(file, 'utf8');

  // Find all Swiper slides
  const swiperSlides = html.match(/<div[^>]+class="[^"]*swiper-slide[^"]*"[^>]*>[\s\S]*?<\/div>\s*<\/div>/gi) || [];
  console.log('Swiper slides count:', swiperSlides.length);
  swiperSlides.forEach((s, i) => {
    console.log(`\n--- SWIPER SLIDE ${i + 1} ---`);
    console.log(s.replace(/<style[\s\S]*?<\/style>/gi, '').substring(0, 500));
  });

  // Find image accordions
  const accordions = html.match(/<div[^>]+class="[^"]*eael-image-accordion[^"]*"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/gi) || [];
  console.log('\nImage accordions count:', accordions.length);
  accordions.forEach((acc, i) => {
    console.log(`\n--- ACCORDION ${i + 1} ---`);
    const items = acc.match(/<div[^>]+class="[^"]*eael-image-accordion-item[^"]*"[^>]*>[\s\S]*?<\/div>\s*<\/div>/gi) || [];
    console.log('Accordion items:', items.length);
    items.forEach((item, j) => {
      console.log(`  Item ${j + 1}:`, item.replace(/<style[\s\S]*?<\/style>/gi, '').substring(0, 300));
    });
  });

  // Find gallery
  const galleries = html.match(/<div[^>]+class="[^"]*eael-filter-gallery[^"]*"[\s\S]*?<\/div>\s*<\/div>/gi) || [];
  console.log('\nFilter galleries count:', galleries.length);
}

inspectSections('live_home.html');
inspectSections('live_about.html');
inspectSections('live_courses.html');
inspectSections('live_contact.html');
