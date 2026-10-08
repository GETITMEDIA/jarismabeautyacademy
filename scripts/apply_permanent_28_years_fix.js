const fs = require('fs');

// 1. Clean assets/elementor/css/post-444.css from any mask-image
let postCss = fs.readFileSync('assets/elementor/css/post-444.css', 'utf8');
postCss = postCss.replace(
  /-webkit-mask-image:[^;]+;/g,
  '-webkit-mask-image: none !important;'
);
fs.writeFileSync('assets/elementor/css/post-444.css', postCss);
console.log('Cleaned mask-image from post-444.css');

// 2. Modify index.html
let html = fs.readFileSync('index.html', 'utf8');

// Remove animation settings from 28 years section so Elementor JS does not hide them
html = html.replace(
  /<div class="elementor-element elementor-element-8267bca[^"]*"[^>]*data-settings="[^"]*animation[^"]*"[^>]*>/gi,
  '<div class="elementor-element elementor-element-8267bca e-con-full e-flex e-con e-child" data-id="8267bca" data-element_type="container" data-e-type="container" style="display: flex !important; visibility: visible !important; opacity: 1 !important; align-items: center !important; justify-content: center !important;">'
);

html = html.replace(
  /<div class="elementor-element elementor-element-13849d6[^"]*"[^>]*data-settings="[^"]*animation[^"]*"[^>]*>/gi,
  '<div class="elementor-element elementor-element-13849d6 e-con-full e-flex e-con e-child" data-id="13849d6" data-element_type="container" data-e-type="container" style="visibility: visible !important; opacity: 1 !important;">'
);

// Add inline style directly onto the image in 28 years section
const oldImgStr = '<img decoding="async" width="819" height="1024" src="assets/2025/08/DSC06740-819x1024.jpg"';
if (html.includes(oldImgStr)) {
  const replacementImgStr = '<img decoding="async" width="819" height="1024" src="assets/2025/08/DSC06740-819x1024.jpg" style="display: block !important; visibility: visible !important; opacity: 1 !important; width: 380px !important; max-width: 100% !important; height: 500px !important; object-fit: cover !important; object-position: center top !important; border-radius: 200px !important; -webkit-mask: none !important; mask: none !important; box-shadow: 0 10px 30px rgba(0,0,0,0.12) !important; margin: 0 auto !important;"';
  html = html.replace(oldImgStr, replacementImgStr);
  console.log('Applied direct inline styles to 28 years image in index.html');
}

// 3. Update the custom-28-years-fix style block
const fixCSS = `
<style id="custom-28-years-fix">
/* ============================================================
   PERMANENT 28 YEARS EXPERIENCE IMAGE FIX
   ============================================================ */
.elementor-invisible,
.elementor-element.elementor-invisible,
.elementor-element-8267bca,
.elementor-element-baff671 {
    visibility: visible !important;
    opacity: 1 !important;
}

.elementor-element.elementor-element-c20dd51 {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    justify-content: space-between !important;
    width: 100% !important;
    max-width: 1200px !important;
    margin: 40px auto !important;
    padding: 40px 20px !important;
    box-sizing: border-box !important;
}

.elementor-element.elementor-element-13849d6 {
    flex: 0 0 52% !important;
    max-width: 52% !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
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
    align-items: center !important;
    justify-content: center !important;
    visibility: visible !important;
    opacity: 1 !important;
}

.elementor-element.elementor-element-baff671 .elementor-widget-container {
    width: 100% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    margin: 0 !important;
    -webkit-mask: none !important;
    -webkit-mask-image: none !important;
    mask: none !important;
    mask-image: none !important;
    visibility: visible !important;
    opacity: 1 !important;
}

.elementor-element.elementor-element-baff671 img {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    width: 380px !important;
    max-width: 100% !important;
    height: 500px !important;
    object-fit: cover !important;
    object-position: center top !important;
    border-radius: 200px !important;
    -webkit-mask: none !important;
    -webkit-mask-image: none !important;
    mask: none !important;
    mask-image: none !important;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12) !important;
    margin: 0 auto !important;
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

html = html.replace(/<style id="custom-28-years-fix">[\s\S]*?<\/style>/g, '');
html = html.replace('</head>', fixCSS + '\n</head>');

fs.writeFileSync('index.html', html);
console.log('Successfully updated index.html with permanent 28 years fix!');
