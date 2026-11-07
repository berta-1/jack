const fs = require('fs');

function searchForClinton(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((l, i) => {
    if (l.toLowerCase().includes('clinton') || l.toLowerCase().includes('wrong.dee')) {
      console.log(`[${filePath}:${i+1}] ${l.trim().substring(0, 250)}`);
    }
  });
}

searchForClinton('c:/Tahir/Mission-1.0/Watchdog Press/WATCHDOG_PRESS_MASTER_ARCHIVE_ALL_POSTS.json');
searchForClinton('c:/Tahir/Mission-1.0/211 Sentry/raw_archive/211_SENTRY_399_POSTS.json');
searchForClinton('c:/Tahir/Mission-1.0/211 Sentry/raw_archive/DENG_CLINTON_PERSONAL_HARVEST_317.json');

