const fs = require('fs');

const posts = JSON.parse(fs.readFileSync('c:/Tahir/Mission-1.0/211 Sentry/raw_archive/DENG_CLINTON_PERSONAL_HARVEST_317.json', 'utf8'));

console.log("Sample post keys:", Object.keys(posts[0]));
console.log("Post 1:", JSON.stringify(posts[0], null, 2));

// Check if any post has URL containing user ID or story fbid
posts.slice(0, 10).forEach((p, idx) => {
  if (p.url) console.log(`Post ${idx+1} URL:`, p.url);
});

