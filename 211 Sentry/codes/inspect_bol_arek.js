const fs = require('fs');

const posts = JSON.parse(fs.readFileSync('c:/Tahir/Mission-1.0/211 Sentry/raw_archive/DENG_CLINTON_PERSONAL_HARVEST_317.json', 'utf8'));

console.log("=== POST 226 ===");
console.log(posts[225]);

console.log("\n=== POST 269 ===");
console.log(posts[268]);

