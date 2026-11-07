const fs = require('fs');
const posts = JSON.parse(fs.readFileSync('c:/Tahir/Mission-1.0/211 Sentry/raw_archive/211_SENTRY_399_POSTS.json', 'utf8'));

console.log("=== 211 SENTRY ATTACK POSTS ON AKEC TONG / NSS ===");

const hits = [];
posts.forEach((p, idx) => {
  const text = p.text || '';
  const lower = text.toLowerCase();
  if (lower.includes('akec') || lower.includes('akech') || lower.includes('napoleon') || lower.includes('wetnhialic') || lower.includes('gregory') || lower.includes('vasili')) {
    hits.push({ idx: idx + 1, date: p.date, text: text });
  }
});

console.log(`Total hits: ${hits.length}`);
hits.slice(0, 30).forEach(h => {
  console.log(`\n------------------ [211 SENTRY POST #${h.idx}] (${h.date}) ------------------`);
  console.log(h.text);
});

