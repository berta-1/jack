const fs = require('fs');
const posts = JSON.parse(fs.readFileSync('c:/Tahir/Mission-1.0/211 Sentry/raw_archive/DENG_CLINTON_PERSONAL_HARVEST_317.json', 'utf8'));

const targets = ['akech', 'akec', 'wetnhialic', 'adok', 'napoleon', 'gregory', 'vasili', 'akol', 'santo', 'bol wek', '7 million', 'million', 'dossier', 'sentry'];

posts.forEach((p, idx) => {
  const text = p.text || '';
  const lower = text.toLowerCase();
  const hit = targets.some(t => lower.includes(t));
  if (hit) {
    console.log(`\n========================================`);
    console.log(`POST #${idx + 1} | Harvested: ${p.harvestedAt || p.date}`);
    console.log(`Tags: ${JSON.stringify(p.intelligenceTags || [])}`);
    console.log(text);
  }
});

