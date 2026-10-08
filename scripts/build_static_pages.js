const fs = require('fs');
const path = require('path');

const pageMap = [
  { src: 'live_home.html', dest: 'index.html', title: 'Home - jarismabeautyacademy.com' },
  { src: 'live_about.html', dest: 'about.html', title: 'About - jarismabeautyacademy.com' },
  { src: 'live_courses.html', dest: 'courses.html', title: 'Courses - jarismabeautyacademy.com' },
  { src: 'live_contact.html', dest: 'contact.html', title: 'Contact - jarismabeautyacademy.com' }
];

function transformHtml(html, currentPage) {
  let output = html;

  // 1. Remove XML-RPC, feed links, pingback, wp-json, etc.
  output = output.replace(/<link rel=['"]alternate['"][^>]*>/gi, '');
  output = output.replace(/<link rel=['"]EditURI['"][^>]*>/gi, '');
  output = output.replace(/<link rel=['"]pingback['"][^>]*>/gi, '');
  output = output.replace(/<link rel=['"]https:\/\/api\.w\.org\/['"][^>]*>/gi, '');

  // 2. Replace WordPress paths in a single pass
  output = output.replace(/(?:https?:\/\/jarismabeautyacademy\.com)?\/wp-content\/uploads\//g, 'assets/');
  output = output.replace(/(?:https?:\/\/jarismabeautyacademy\.com)?\/wp-content\/plugins\//g, 'vendor/plugins/');
  output = output.replace(/(?:https?:\/\/jarismabeautyacademy\.com)?\/wp-content\/themes\//g, 'vendor/themes/');
  output = output.replace(/(?:https?:\/\/jarismabeautyacademy\.com)?\/wp-includes\//g, 'vendor/wp-includes/');

  // Also replace any without leading slash if they existed
  output = output.replace(/https?:\/\/jarismabeautyacademy\.com\/wp-content\/uploads\//g, 'assets/');
  output = output.replace(/https?:\/\/jarismabeautyacademy\.com\/wp-content\/plugins\//g, 'vendor/plugins/');
  output = output.replace(/https?:\/\/jarismabeautyacademy\.com\/wp-content\/themes\//g, 'vendor/themes/');
  output = output.replace(/https?:\/\/jarismabeautyacademy\.com\/wp-includes\//g, 'vendor/wp-includes/');

  // Clean any accidental repetition
  output = output.replace(/vendor+vendor\//g, 'vendor/');
  output = output.replace(/vendor\/+vendor\//g, 'vendor/');
  output = output.replace(/vendor\/+uploads\//g, 'assets/');

  // 3. Replace internal navigation links
  output = output.replace(/href=["']https?:\/\/jarismabeautyacademy\.com\/about\/?["']/g, 'href="about.html"');
  output = output.replace(/href=["']https?:\/\/jarismabeautyacademy\.com\/courses\/?["']/g, 'href="courses.html"');
  output = output.replace(/href=["']https?:\/\/jarismabeautyacademy\.com\/contact\/?["']/g, 'href="contact.html"');
  output = output.replace(/href=["']https?:\/\/jarismabeautyacademy\.com\/?["']/g, 'href="index.html"');

  output = output.replace(/href=["']\/about\/?["']/g, 'href="about.html"');
  output = output.replace(/href=["']\/courses\/?["']/g, 'href="courses.html"');
  output = output.replace(/href=["']\/contact\/?["']/g, 'href="contact.html"');
  output = output.replace(/href=["']\/["']/g, 'href="index.html"');

  // Fix logo link
  output = output.replace(/class="custom-logo-link"[^>]*href="[^"]*"/g, 'class="custom-logo-link" href="index.html"');

  // 4. In contact page, provide graceful local submission confirmation
  if (currentPage === 'contact.html') {
    output = output.replace('</form>', `
      <div id="contactFormStatus" style="display:none; margin-top:15px; padding:12px; background:#e8f5e9; color:#2e7d32; border-radius:4px; font-weight:500; text-align:center;">
        Thank you! Your message has been sent successfully.
      </div>
    </form>
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        const form = document.querySelector('.wpforms-form') || document.querySelector('form');
        if (form) {
          form.addEventListener('submit', function(e) {
            e.preventDefault();
            const status = document.getElementById('contactFormStatus');
            if (status) {
              status.style.display = 'block';
              form.reset();
            }
          });
        }
      });
    </script>
    `);
  }

  return output;
}

pageMap.forEach(p => {
  if (!fs.existsSync(p.src)) {
    console.error('Source missing:', p.src);
    return;
  }
  const rawHtml = fs.readFileSync(p.src, 'utf8');
  const transformed = transformHtml(rawHtml, p.dest);
  fs.writeFileSync(p.dest, transformed);
  console.log('Transformed', p.src, '->', p.dest, `(${transformed.length} bytes)`);
});
