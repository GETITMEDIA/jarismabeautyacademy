const fs = require('fs');

// 1. Update post-444.css to replace any live URL mask-image with local or data URI
let postCss = fs.readFileSync('assets/elementor/css/post-444.css', 'utf8');
postCss = postCss.replace(
  /https?:\/\/jarismabeautyacademy\.com\/wp-content\/plugins\/elementor\/assets\/mask-shapes\/circle\.svg/g,
  'vendor/plugins/elementor/assets/mask-shapes/circle.svg'
);
fs.writeFileSync('assets/elementor/css/post-444.css', postCss);
console.log('Updated assets/elementor/css/post-444.css');

// 2. Add bulletproof CSS for 28 Years image and remove all elementor-invisible
const fixCSS = `
<style id="custom-28-years-fix">
/* ============================================================
   28 YEARS EXPERIENCE – IMAGE FIX MATCHING SCREENSHOT
   ============================================================ */
.elementor-invisible {
    visibility: visible !important;
    opacity: 1 !important;
}

.elementor-element.elementor-element-c20dd51 {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    justify-content: space-between !important;
    padding: 60px 40px !important;
    max-width: 1200px !important;
    margin: 0 auto !important;
    box-sizing: border-box !important;
}

.elementor-element.elementor-element-13849d6 {
    flex: 0 0 52% !important;
    max-width: 52% !important;
    visibility: visible !important;
    opacity: 1 !important;
}

.elementor-element.elementor-element-8267bca {
    flex: 0 0 45% !important;
    max-width: 45% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    visibility: visible !important;
    opacity: 1 !important;
}

.elementor-element.elementor-element-baff671 {
    width: 100% !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
}

.elementor-element.elementor-element-baff671 .elementor-widget-container {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    margin: 0 !important;
}

.elementor-element.elementor-element-baff671 img {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    width: 360px !important;
    max-width: 100% !important;
    height: 500px !important;
    object-fit: cover !important;
    object-position: center top !important;
    border-radius: 200px !important;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12) !important;
    margin: 0 auto !important;
    transition: transform 0.4s ease !important;
}

.elementor-element.elementor-element-baff671 img:hover {
    transform: scale(1.02) !important;
}

@media (max-width: 920px) {
    .elementor-element.elementor-element-c20dd51 {
        flex-direction: column !important;
        text-align: center !important;
        padding: 40px 20px !important;
    }
    .elementor-element.elementor-element-13849d6 {
        flex: 0 0 100% !important;
        max-width: 100% !important;
        margin-bottom: 40px !important;
    }
    .elementor-element.elementor-element-8267bca {
        flex: 0 0 100% !important;
        max-width: 100% !important;
    }
    .elementor-element.elementor-element-baff671 img {
        width: 300px !important;
        height: 420px !important;
    }
}
</style>
`;

['index.html', 'courses.html', 'about.html'].forEach(file => {
  let html = fs.readFileSync(file, 'utf8');

  // Replace any previous custom 28 years fix style
  html = html.replace(/<style id="custom-28-years-fix">[\s\S]*?<\/style>/g, '');

  // Add the CSS to head
  html = html.replace('</head>', fixCSS + '\n</head>');

  // Remove elementor-invisible class globally to prevent any hidden elements
  html = html.replace(/\belementor-invisible\b/g, '');

  fs.writeFileSync(file, html);
  console.log('Fixed 28 years image and removed invisible flags in', file);
});
