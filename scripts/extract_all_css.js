const fs = require('fs');

const html = fs.readFileSync('live_home.html', 'utf8');

const linkRegex = /<link[^>]+rel=["']stylesheet["'][^>]*>/gi;
let m;
const links = [];
while ((m = linkRegex.exec(html)) !== null) {
  const hrefMatch = m[0].match(/href=["']([^"']+)["']/);
  if (hrefMatch) {
    links.push(hrefMatch[1]);
  }
}

console.log('Total stylesheets:', links.length);
links.forEach((l, i) => console.log(`${i + 1}: ${l}`));

// Also check <style> blocks
const styleBlocks = html.match(/<style[^>]*>[\s\S]*?<\/style>/gi) || [];
console.log('\nInline style blocks count:', styleBlocks.length);
let totalInlineCss = 0;
styleBlocks.forEach(sb => totalInlineCss += sb.length);
console.log('Total inline CSS bytes:', totalInlineCss);
