const fs = require('fs');
const clintonPosts = JSON.parse(fs.readFileSync('c:/Tahir/Mission-1.0/211 Sentry/raw_archive/DENG_CLINTON_PERSONAL_HARVEST_317.json', 'utf8'));

console.log("=== SEARCHING DENG CLINTON POSTS FOR MEDIA / PAGES / SENTRY / WATCHDOG ===");

clintonPosts.forEach((p, idx) => {
  const t = (p.text || '').toLowerCase();
  if (t.includes('sentry') || t.includes('watchdog') || t.includes('page') || t.includes('admin') || t.includes('211') || t.includes('media') || t.includes('fake') || t.includes('blogger')) {
    console.log(`\n--- Post #${idx + 1} (${p.date}) ---`);
    console.log(p.text);
  }
});

