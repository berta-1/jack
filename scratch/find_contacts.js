const fs = require('fs');
const posts = JSON.parse(fs.readFileSync('Watchdog Press/WATCHDOG_PRESS_MASTER_ARCHIVE_ALL_POSTS.json', 'utf8'));

posts.forEach((p, idx) => {
  const text = p.text || '';
  if (/@gmail\.com|@yahoo\.com|@hotmail\.com|\+211|\+254/i.test(text)) {
    console.log("Post " + idx + ": " + text.substring(0, 300));
  }
});
