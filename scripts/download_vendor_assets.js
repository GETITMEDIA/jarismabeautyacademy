const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Read the list of CSS and JS from find_all_assets
const pages = ['live_home.html', 'live_about.html', 'live_courses.html', 'live_contact.html'];
const urlsToDownload = new Set();

pages.forEach(p => {
  const html = fs.readFileSync(p, 'utf8');

  // Stylesheets
  const cssMatches = html.match(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi) || [];
  cssMatches.forEach(m => {
    const href = m.match(/href=["']([^"']+)["']/);
    if (href) urlsToDownload.add(href[1]);
  });

  // Scripts
  const jsMatches = html.match(/<script[^>]+src=["']([^"']+)["'][^>]*>/gi) || [];
  jsMatches.forEach(m => {
    const src = m.match(/src=["']([^"']+)["']/);
    if (src) urlsToDownload.add(src[1]);
  });
});

console.log('Total URLs found in pages:', urlsToDownload.size);

// Filter out Google fonts and files already in assets/
const toFetch = [];
urlsToDownload.forEach(rawUrl => {
  if (rawUrl.includes('fonts.googleapis.com')) return;
  // If it's on jarismabeautyacademy.com
  if (rawUrl.includes('jarismabeautyacademy.com')) {
    // If it's already in uploads, check if we have it in assets/
    if (rawUrl.includes('/wp-content/uploads/')) {
      const rel = rawUrl.split('/wp-content/uploads/')[1].split('?')[0];
      const localPath = path.join(__dirname, 'assets', rel);
      if (fs.existsSync(localPath)) {
        // Already local!
        return;
      }
    }
    toFetch.push(rawUrl);
  }
});

console.log('Need to download:', toFetch.length);
toFetch.forEach(u => console.log(' ->', u));

async function downloadFile(fileUrl) {
  const parsed = url.parse(fileUrl);
  // Map /wp-content/themes/... or /wp-content/plugins/... to vendor/...
  let relPath = parsed.pathname.replace(/^\/wp-content\//, 'vendor/').replace(/^\/wp-includes\//, 'vendor/wp-includes/');
  const targetPath = path.join(__dirname, relPath);

  fs.mkdirSync(path.dirname(targetPath), { recursive: true });

  if (fs.existsSync(targetPath) && fs.statSync(targetPath).size > 0) {
    console.log('Exists:', relPath);
    return;
  }

  return new Promise((resolve) => {
    const client = parsed.protocol === 'https:' ? https : http;
    client.get(fileUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirect = res.headers.location;
        if (!redirect.startsWith('http')) {
          redirect = parsed.protocol + '//' + parsed.host + redirect;
        }
        downloadFile(redirect).then(resolve);
        return;
      }
      if (res.statusCode !== 200) {
        console.error('Failed', res.statusCode, fileUrl);
        resolve();
        return;
      }
      const stream = fs.createWriteStream(targetPath);
      res.pipe(stream);
      stream.on('finish', () => {
        stream.close();
        console.log('Downloaded:', relPath);
        resolve();
      });
    }).on('error', (err) => {
      console.error('Error fetching', fileUrl, err.message);
      resolve();
    });
  });
}

(async () => {
  for (const u of toFetch) {
    await downloadFile(u);
  }
  console.log('All downloads complete!');
})();
