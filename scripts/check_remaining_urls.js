const fs = require('fs');

['index.html', 'about.html', 'courses.html', 'contact.html'].forEach(f => {
  const html = fs.readFileSync(f, 'utf8');
  const matches = html.match(/https?:\/\/jarismabeautyacademy\.com[^\s"\'<>)]*/g) || [];
  console.log(f, 'remaining live domain references:', matches.length);
  const unique = Array.from(new Set(matches));
  unique.forEach(u => console.log('  ->', u));
});
