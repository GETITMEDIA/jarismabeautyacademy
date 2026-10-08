const fs = require('fs');

const enhancementScript = `
<script>
// Lightweight Fallback & Enhancement Controller for Static Site
document.addEventListener('DOMContentLoaded', function() {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.querySelector('.main-header-menu-toggle') || document.querySelector('.menu-toggle');
  const mobileNav = document.getElementById('ast-mobile-header') || document.querySelector('.main-header-bar-navigation');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', function(e) {
      e.preventDefault();
      document.body.classList.toggle('ast-mobile-menu-open');
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !expanded);
      const dropdown = document.querySelector('.ast-mobile-header-wrap');
      if (dropdown) {
        dropdown.classList.toggle('ast-show-menu');
      }
    });
  }

  // 2. Filter Gallery Fallback
  const filterControls = document.querySelectorAll('.eael-filter-gallery-control li');
  if (filterControls.length > 0) {
    filterControls.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        filterControls.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const filter = this.getAttribute('data-filter');
        const items = document.querySelectorAll('.eael-filterable-gallery-item-wrap');
        items.forEach(function(item) {
          if (!filter || filter === '*' || item.matches(filter)) {
            item.style.display = '';
            item.style.opacity = '1';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // 3. Image Accordion Hover & Focus Fallback
  const accordionItems = document.querySelectorAll('.eael-image-accordion-item');
  if (accordionItems.length > 0) {
    accordionItems.forEach(function(item) {
      item.addEventListener('mouseenter', function() {
        accordionItems.forEach(i => i.classList.remove('eael-image-accordion-hover'));
        this.classList.add('eael-image-accordion-hover');
      });
      item.addEventListener('click', function() {
        accordionItems.forEach(i => i.classList.remove('eael-image-accordion-hover'));
        this.classList.add('eael-image-accordion-hover');
      });
    });
  }
});
</script>
`;

['index.html', 'about.html', 'courses.html', 'contact.html'].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('Lightweight Fallback & Enhancement Controller')) {
    content = content.replace('</body>', enhancementScript + '\n</body>');
    fs.writeFileSync(file, content);
    console.log('Appended fallback controller to', file);
  }
});
