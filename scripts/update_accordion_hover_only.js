const fs = require('fs');

const accordionCSS = `
<style id="custom-accordion-styles">
/* ============================================================
   IMAGE ACCORDION – CLOSED BY DEFAULT, EXPANDS ONLY ON HOVER
   ============================================================ */
.eael-img-accordion {
    display: flex !important;
    flex-direction: row !important;
    width: 100% !important;
    height: 520px !important;
    overflow: hidden !important;
    border-radius: 8px !important;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
}

/* All items closed by default */
.eael-img-accordion .eael-image-accordion-item {
    position: relative !important;
    flex: 1 1 0% !important;
    height: 100% !important;
    background-size: cover !important;
    background-position: center !important;
    background-repeat: no-repeat !important;
    cursor: pointer !important;
    overflow: hidden !important;
    transition: flex 0.5s cubic-bezier(0.25, 1, 0.4, 1) !important;
}

.eael-img-accordion .eael-image-accordion-item::before {
    content: "" !important;
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    width: 100% !important;
    height: 100% !important;
    background-color: rgba(0, 0, 0, 0.35) !important;
    transition: background-color 0.4s ease !important;
    z-index: 1 !important;
}

.eael-img-accordion .eael-image-accordion-item .overlay {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    width: 100% !important;
    height: 100% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    z-index: 2 !important;
    padding: 25px !important;
    text-align: center !important;
    background: transparent !important;
    transition: background 0.4s ease !important;
    pointer-events: none !important;
}

.eael-img-accordion .eael-image-accordion-item .overlay-inner {
    width: 100% !important;
    max-width: 480px !important;
    margin: 0 auto !important;
    z-index: 3 !important;
}

/* Text hidden by default on all items */
.eael-img-accordion .eael-image-accordion-item .overlay-inner * {
    opacity: 0 !important;
    visibility: hidden !important;
    transform: translateY(20px) !important;
    transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s ease !important;
}

/* ONLY expand on hover or active */
.eael-img-accordion .eael-image-accordion-item:hover,
.eael-img-accordion .eael-image-accordion-item.overlay-active,
.eael-img-accordion .eael-image-accordion-item.is-active {
    flex: 3.5 1 0% !important;
}

.eael-img-accordion .eael-image-accordion-item:hover::before,
.eael-img-accordion .eael-image-accordion-item.overlay-active::before,
.eael-img-accordion .eael-image-accordion-item.is-active::before {
    background-color: rgba(0, 0, 0, 0.6) !important;
}

.eael-img-accordion .eael-image-accordion-item:hover .overlay,
.eael-img-accordion .eael-image-accordion-item.overlay-active .overlay,
.eael-img-accordion .eael-image-accordion-item.is-active .overlay {
    background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.1) 100%) !important;
}

/* Text reveals ONLY when hovered */
.eael-img-accordion .eael-image-accordion-item:hover .overlay-inner *,
.eael-img-accordion .eael-image-accordion-item.overlay-active .overlay-inner *,
.eael-img-accordion .eael-image-accordion-item.is-active .overlay-inner * {
    opacity: 1 !important;
    visibility: visible !important;
    transform: translateY(0) !important;
    transition: opacity 0.4s 0.15s ease, transform 0.4s 0.15s ease !important;
}

.eael-img-accordion .img-accordion-title {
    font-family: 'Playfair Display', Georgia, serif !important;
    font-size: 2.2rem !important;
    font-weight: 700 !important;
    color: #ffffff !important;
    margin-bottom: 12px !important;
    line-height: 1.25 !important;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7) !important;
}

.eael-img-accordion .overlay-inner p {
    font-family: 'Work Sans', sans-serif !important;
    font-size: 1.05rem !important;
    font-weight: 400 !important;
    color: #ffffff !important;
    line-height: 1.55 !important;
    margin: 0 !important;
    text-shadow: 0 1px 6px rgba(0, 0, 0, 0.8) !important;
}

@media (max-width: 920px) {
    .eael-img-accordion {
        flex-direction: column !important;
        height: auto !important;
    }
    .eael-img-accordion .eael-image-accordion-item {
        min-height: 100px !important;
        flex: 1 1 100px !important;
    }
    .eael-img-accordion .eael-image-accordion-item:hover,
    .eael-img-accordion .eael-image-accordion-item.overlay-active,
    .eael-img-accordion .eael-image-accordion-item.is-active {
        min-height: 240px !important;
        flex: 2 1 240px !important;
    }
}
</style>
`;

const accordionScript = `
<script id="custom-accordion-script">
(function() {
  function initAccordion() {
    var accordions = document.querySelectorAll('.eael-img-accordion');
    accordions.forEach(function(acc) {
      var items = acc.querySelectorAll('.eael-image-accordion-item');
      if (!items || items.length === 0) return;

      // Start with ALL items closed (no default active item!)
      items.forEach(function(i) {
        i.classList.remove('overlay-active', 'is-active');
      });

      items.forEach(function(item) {
        item.addEventListener('mouseenter', function() {
          items.forEach(function(i) { i.classList.remove('overlay-active', 'is-active'); });
          this.classList.add('overlay-active', 'is-active');
        });

        item.addEventListener('mouseleave', function() {
          this.classList.remove('overlay-active', 'is-active');
        });

        item.addEventListener('click', function(e) {
          var wasActive = this.classList.contains('is-active');
          items.forEach(function(i) { i.classList.remove('overlay-active', 'is-active'); });
          if (!wasActive) {
            this.classList.add('overlay-active', 'is-active');
          }
        });
      });

      // When mouse leaves the entire accordion container, close ALL items!
      acc.addEventListener('mouseleave', function() {
        items.forEach(function(i) { i.classList.remove('overlay-active', 'is-active'); });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccordion);
  } else {
    initAccordion();
  }
})();
</script>
`;

['index.html', 'courses.html'].forEach(file => {
  let html = fs.readFileSync(file, 'utf8');

  // Replace previous custom accordion style and script
  html = html.replace(/<style id="custom-accordion-styles">[\s\S]*?<\/style>/g, '');
  html = html.replace(/<script id="custom-accordion-script">[\s\S]*?<\/script>/g, '');

  // Insert CSS in <head>
  html = html.replace('</head>', accordionCSS + '\n</head>');

  // Insert JS before </body>
  html = html.replace('</body>', accordionScript + '\n</body>');

  fs.writeFileSync(file, html);
  console.log('Updated accordion to hover-only in', file);
});
