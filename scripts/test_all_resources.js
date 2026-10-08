const http = require('http');
const fs = require('fs');

const pages = ['index.html', 'about.html', 'courses.html', 'contact.html'];
const failed = [];
const success = [];

function checkUrl(urlPath) {
  return new Promise((resolve) => {
    http.get('http://localhost:3000/' + urlPath, res => {
      if (res.statusCode === 200) {
        success.push(urlPath);
      } else {
        failed.push({ url: urlPath, status: res.statusCode });
      }
      resolve();
    }).on('error', err => {
      failed.push({ url: urlPath, error: err.message });
      resolve();
    });
  });
}

(async () => {
  for (const page of pages) {
    const html = fs.readFileSync(page, 'utf8');

    // Find all relative links to assets or vendor
    const matches = html.match(/(?:src|href)=["'](assets\/[^"']+|vendor\/[^"']+)["']/gi) || [];
    const urls = new Set();
    urls.add(page);

    matches.forEach(m => {
      const match = m.match(/(?:src|href)=["']([^"']+)["']/);
      if (match) {
        const clean = match[1].split('?')[0].split('#')[0];
        urls.add(clean);
      }
    });

    console.log(`Checking ${page} (${urls.size} resources)...`);
    for (const u of urls) {
      await checkUrl(u);
    }
  }

  console.log('\n--- RESULTS ---');
  console.log('Success count:', success.length);
  console.log('Failed count:', failed.length);
  if (failed.length > 0) {
    console.log('Failed resources:');
    failed.forEach(f => console.log(f));
  } else {
    console.log('ALL RESOURCES LOADED WITH STATUS 200 OK!');
  }
})();
