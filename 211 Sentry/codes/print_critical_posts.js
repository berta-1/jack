const fs = require('fs');
const posts = JSON.parse(fs.readFileSync('c:/Tahir/Mission-1.0/211 Sentry/raw_archive/DENG_CLINTON_PERSONAL_HARVEST_317.json', 'utf8'));

[41, 42, 152, 153, 301, 302, 303, 304].forEach(idx => {
  const p = posts[idx];
  if (p) {
    console.log(`\n================== POST #${idx + 1} ==================`);
    console.log(p.text);
  }
});

