const fs = require('fs');

const posts = JSON.parse(fs.readFileSync('c:/Tahir/Mission-1.0/211 Sentry/raw_archive/DENG_CLINTON_PERSONAL_HARVEST_317.json', 'utf8'));

posts.forEach((p, idx) => {
  if (p.url && p.url.length > 30) {
    console.log(`[#${idx+1}] ${p.url}`);
  }
});

