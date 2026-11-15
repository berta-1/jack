const fs = require('fs');
const posts = JSON.parse(fs.readFileSync('Watchdog Press/WATCHDOG_PRESS_MASTER_ARCHIVE_ALL_POSTS.json', 'utf8'));

posts.forEach((p, idx) => {
  const text = p.text || p.content || p.message || p.post_text || '';
  if (/emmanuel/i.test(text) || /makuach/i.test(text) || /kuach/i.test(text)) {
    console.log("=== Post " + idx + " ===");
    console.log(text.substring(0, 500));
    console.log("\n");
  }
});
