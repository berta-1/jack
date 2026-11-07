const fs = require('fs');

const masterPath = 'c:/Tahir/Mission-1.0/Watchdog Press/WATCHDOG_PRESS_MASTER_ARCHIVE_ALL_POSTS.json';
const posts = JSON.parse(fs.readFileSync(masterPath, 'utf8'));

posts.forEach((p, idx) => {
  const text = p.text || '';
  if (text.toLowerCase().includes('kanybil') || text.toLowerCase().includes('m-pesa') || text.toLowerCase().includes('mpesa')) {
    console.log(`\n================== POST #${idx + 1} (${p.date}) ==================`);
    console.log(text);
  }
});

