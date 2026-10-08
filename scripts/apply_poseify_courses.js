const fs = require('fs');

const poseifyCoursesHTML = `
<!-- ==================== POSEIFY-STYLE OUR COURSES SECTION ==================== -->
<section class="poseify-courses-wrapper" id="our-courses-section">
  <div class="poseify-courses-container">
    <div class="poseify-courses-header">
      <h2>Our Courses</h2>
      <p>Professional Training &amp; Certifications</p>
    </div>

    <!-- 1. Hair Styling (Left Capsule) -->
    <div class="poseify-service-item poseify-service-item-left">
      <div class="poseify-service-row">
        <div class="poseify-service-col-img">
          <div class="poseify-service-img">
            <img src="assets/2025/08/IMG_7715-scaled-e1755326342498.jpg" alt="Hair Styling Course" loading="lazy">
          </div>
        </div>
        <div class="poseify-service-col-text">
          <div class="poseify-service-text">
            <h3>Hair Styling</h3>
            <p>Master the complete art of hairdressing and styling. From foundational cutting, precision sectioning, and intricate braiding to advanced salon styling, creative coloring, and bridal hairdressing.</p>
            <a class="poseify-btn-readmore" href="contact.html">Read More <i class="fa fa-arrow-right"></i></a>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. Makeup Artistry (Right Capsule) -->
    <div class="poseify-service-item poseify-service-item-right">
      <div class="poseify-service-row">
        <div class="poseify-service-col-img">
          <div class="poseify-service-img">
            <img src="assets/2025/08/IMG_7913-scaled-e1755324358203.jpg" alt="Makeup Artistry Course" loading="lazy">
          </div>
        </div>
        <div class="poseify-service-col-text">
          <div class="poseify-service-text">
            <h3>Makeup Artistry</h3>
            <p>Explore professional makeup artistry from everyday natural beauty to bridal and high-fashion transformations. Learn skin tone analysis, HD makeup techniques, airbrush application, and editorial looks.</p>
            <a class="poseify-btn-readmore" href="contact.html">Read More <i class="fa fa-arrow-right"></i></a>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. Skin Care Therapy (Left Capsule) -->
    <div class="poseify-service-item poseify-service-item-left">
      <div class="poseify-service-row">
        <div class="poseify-service-col-img">
          <div class="poseify-service-img">
            <img src="assets/2025/08/DSC06448-scaled.jpg" alt="Skin Care Therapy Course" loading="lazy">
          </div>
        </div>
        <div class="poseify-service-col-text">
          <div class="poseify-service-text">
            <h3>Skin Care</h3>
            <p>Comprehensive training covering skin anatomy, product analysis, customized facial treatments, galvanic &amp; high-frequency machines, anti-aging therapies, and salon spa management.</p>
            <a class="poseify-btn-readmore" href="contact.html">Read More <i class="fa fa-arrow-right"></i></a>
          </div>
        </div>
      </div>
    </div>

    <!-- 4. Nail Care & Art (Right Capsule) -->
    <div class="poseify-service-item poseify-service-item-right">
      <div class="poseify-service-row">
        <div class="poseify-service-col-img">
          <div class="poseify-service-img">
            <img src="assets/2025/08/IMG_7925-scaled-e1755324792447.jpg" alt="Nail Care & Art Course" loading="lazy">
          </div>
        </div>
        <div class="poseify-service-col-text">
          <div class="poseify-service-text">
            <h3>Nail Care</h3>
            <p>Complete hands-on training in manicures, pedicures, gel &amp; acrylic extensions, UV/LED lamp curing, professional nail drills, and creative 3D nail art designs for luxury salons.</p>
            <a class="poseify-btn-readmore" href="contact.html">Read More <i class="fa fa-arrow-right"></i></a>
          </div>
        </div>
      </div>
    </div>

  </div>
</section>
`;

const poseifyCSS = `
<style id="custom-poseify-courses-style">
/* ============================================================
   POSEIFY-STYLE OUR COURSES SERVICE SECTION
   ============================================================ */
.poseify-courses-wrapper {
    background-color: #0d0d0d !important;
    padding: 90px 20px !important;
    color: #ffffff !important;
    position: relative;
    overflow: hidden;
}

.poseify-courses-container {
    max-width: 1200px !important;
    margin: 0 auto !important;
}

.poseify-courses-header {
    text-align: center !important;
    margin-bottom: 60px !important;
}

.poseify-courses-header h2 {
    font-family: 'Playfair Display', Georgia, serif !important;
    font-size: 2.8rem !important;
    font-weight: 700 !important;
    color: #ffffff !important;
    text-transform: uppercase !important;
    margin-bottom: 12px !important;
    letter-spacing: 1.5px !important;
}

.poseify-courses-header p {
    font-family: 'Work Sans', sans-serif !important;
    font-size: 1.05rem !important;
    font-weight: 500 !important;
    color: #e41779 !important;
    text-transform: uppercase !important;
    letter-spacing: 3px !important;
    margin: 0 !important;
}

.poseify-service-item {
    position: relative !important;
    margin-bottom: 3.5rem !important;
    overflow: hidden !important;
    transition: transform 0.4s ease, box-shadow 0.4s ease !important;
}

.poseify-service-item:hover {
    transform: translateY(-5px) !important;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6) !important;
}

/* Left: Rounded on left side */
.poseify-service-item.poseify-service-item-left {
    border-radius: 500px 0 0 500px !important;
    background: linear-gradient(to right, #1f1f1f 0%, #141414 60%, #0d0d0d 100%) !important;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5) !important;
}

/* Right: Rounded on right side */
.poseify-service-item.poseify-service-item-right {
    border-radius: 0 500px 500px 0 !important;
    background: linear-gradient(to left, #1f1f1f 0%, #141414 60%, #0d0d0d 100%) !important;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5) !important;
}

.poseify-service-row {
    display: flex !important;
    align-items: center !important;
    width: 100% !important;
}

.poseify-service-col-img {
    flex: 0 0 40% !important;
    max-width: 40% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 30px !important;
}

.poseify-service-col-text {
    flex: 0 0 60% !important;
    max-width: 60% !important;
    padding: 40px 60px 40px 20px !important;
}

.poseify-service-item-right .poseify-service-col-text {
    padding: 40px 20px 40px 60px !important;
    text-align: right !important;
}

.poseify-service-item-right .poseify-service-row {
    flex-direction: row !important;
}

.poseify-service-item-right .poseify-service-col-img {
    order: 2 !important;
}

.poseify-service-item-right .poseify-service-col-text {
    order: 1 !important;
}

/* Concentric Circles Image Container */
.poseify-service-img {
    position: relative !important;
    display: inline-block !important;
    width: 320px !important;
    height: 320px !important;
    border-radius: 50% !important;
    padding: 15px !important;
}

/* Outer Concentric Ring */
.poseify-service-img::before {
    position: absolute !important;
    content: "" !important;
    width: calc(100% - 30px) !important;
    height: calc(100% - 30px) !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    border: 24px solid rgba(0, 0, 0, 0.45) !important;
    border-radius: 50% !important;
    z-index: 2 !important;
    pointer-events: none !important;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.08) !important;
}

/* Secondary subtle ring */
.poseify-service-img::after {
    position: absolute !important;
    content: "" !important;
    width: 100% !important;
    height: 100% !important;
    top: 0 !important;
    left: 0 !important;
    border: 1px solid rgba(255, 255, 255, 0.06) !important;
    border-radius: 50% !important;
    z-index: 1 !important;
    pointer-events: none !important;
}

.poseify-service-img img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    border-radius: 50% !important;
    display: block !important;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6) !important;
    transition: transform 0.5s ease !important;
}

.poseify-service-item:hover .poseify-service-img img {
    transform: scale(1.05) !important;
}

/* Text Content */
.poseify-service-text h3 {
    font-family: 'Playfair Display', Georgia, serif !important;
    font-size: 2rem !important;
    font-weight: 700 !important;
    color: #ffffff !important;
    text-transform: uppercase !important;
    margin-bottom: 14px !important;
    letter-spacing: 1px !important;
}

.poseify-service-text p {
    font-family: 'Work Sans', sans-serif !important;
    font-size: 1rem !important;
    font-weight: 400 !important;
    color: #b5b5b5 !important;
    line-height: 1.7 !important;
    margin-bottom: 24px !important;
    max-width: 580px !important;
}

.poseify-service-item-right .poseify-service-text p {
    margin-left: auto !important;
}

/* Read More Button */
.poseify-btn-readmore {
    display: inline-flex !important;
    align-items: center !important;
    gap: 10px !important;
    border: 2px solid #e41779 !important;
    color: #ffffff !important;
    background: transparent !important;
    border-radius: 50px !important;
    padding: 11px 32px !important;
    font-family: 'Work Sans', sans-serif !important;
    font-size: 0.95rem !important;
    font-weight: 600 !important;
    text-decoration: none !important;
    text-transform: capitalize !important;
    transition: all 0.35s ease !important;
}

.poseify-btn-readmore i {
    transition: transform 0.3s ease !important;
}

.poseify-btn-readmore:hover {
    background-color: #e41779 !important;
    color: #ffffff !important;
    border-color: #e41779 !important;
    box-shadow: 0 6px 20px rgba(228, 23, 121, 0.45) !important;
    transform: translateY(-2px) !important;
}

.poseify-btn-readmore:hover i {
    transform: translateX(4px) !important;
}

/* Responsive Breakpoints */
@media (max-width: 991px) {
    .poseify-service-col-img {
        flex: 0 0 45% !important;
        max-width: 45% !important;
        padding: 20px !important;
    }
    .poseify-service-col-text {
        flex: 0 0 55% !important;
        max-width: 55% !important;
        padding: 30px !important;
    }
    .poseify-service-img {
        width: 270px !important;
        height: 270px !important;
    }
}

@media (max-width: 767.98px) {
    .poseify-service-item.poseify-service-item-left,
    .poseify-service-item.poseify-service-item-right {
        border-radius: 40px !important;
        background: linear-gradient(to bottom, #1d1d1d 0%, #0d0d0d 100%) !important;
        text-align: center !important;
    }
    .poseify-service-row {
        flex-direction: column !important;
    }
    .poseify-service-col-img {
        flex: 0 0 100% !important;
        max-width: 100% !important;
        order: 1 !important;
        padding: 30px 20px 10px !important;
    }
    .poseify-service-col-text,
    .poseify-service-item-right .poseify-service-col-text {
        flex: 0 0 100% !important;
        max-width: 100% !important;
        order: 2 !important;
        padding: 15px 25px 35px !important;
        text-align: center !important;
    }
    .poseify-service-img {
        width: 240px !important;
        height: 240px !important;
    }
    .poseify-service-text p,
    .poseify-service-item-right .poseify-service-text p {
        margin: 0 auto 20px !important;
    }
}
</style>
`;

// Function to update a page
function updatePage(file) {
  let html = fs.readFileSync(file, 'utf8');

  // 1. Remove previous custom poseify style if any
  html = html.replace(/<style id="custom-poseify-courses-style">[\s\S]*?<\/style>/g, '');

  // 2. Add CSS to head
  html = html.replace('</head>', poseifyCSS + '\n</head>');

  // 3. Find "Our Courses" section and replace its contents
  // Look for: <h2 class="elementor-heading-title elementor-size-default">Our Courses</h2>
  // and the following eael-filterable-gallery container
  const h2Str = '>Our Courses</h2>';
  const h2Pos = html.indexOf(h2Str);

  if (h2Pos !== -1) {
    // Find the enclosing parent container of the Our Courses heading
    // In elementor: <div class="elementor-element elementor-element-xxxx ... e-parent" ...
    // Let's find the start of the heading container
    const headingContainerStart = html.lastIndexOf('<div class="elementor-element ', h2Pos);
    
    // Find where the gallery container ends
    const galleryPos = html.indexOf('eael-filterable-gallery', h2Pos);
    if (galleryPos !== -1) {
      // Find the end of this entire section. In courses.html it goes until Time to Groom or Testimonial
      // Let's find the next major elementor parent section
      let nextSectionPos = html.indexOf('Time to Groom Your Career', galleryPos);
      if (nextSectionPos === -1) {
        nextSectionPos = html.indexOf('Our Testimonial', galleryPos);
      }
      
      if (nextSectionPos !== -1) {
        // Find the beginning of the next parent container
        const nextContainerStart = html.lastIndexOf('<div class="elementor-element ', nextSectionPos);
        
        // Replace from headingContainerStart to nextContainerStart
        const before = html.substring(0, headingContainerStart);
        const after = html.substring(nextContainerStart);
        html = before + poseifyCoursesHTML + '\n' + after;
        console.log('Successfully replaced Our Courses section in', file);
      } else {
        console.log('Could not find next container in', file);
      }
    }
  }

  fs.writeFileSync(file, html);
}

['courses.html', 'index.html'].forEach(updatePage);
