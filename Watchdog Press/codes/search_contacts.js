const fs = require('fs');

const masterPath = 'c:/Tahir/Mission-1.0/Watchdog Press/WATCHDOG_PRESS_MASTER_ARCHIVE_ALL_POSTS.json';
const posts = JSON.parse(fs.readFileSync(masterPath, 'utf8'));

console.log(`Loaded ${posts.length} posts from Watchdog Press master archive.`);

const phoneRegex = /(?:\+?211|\+?254|07\d|09\d|\+?1|\+?44)\s*[\d\s\-]{7,15}\d/g;
const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

const results = [];

posts.forEach((p, idx) => {
  const text = p.text || '';
  const phones = text.match(phoneRegex) || [];
  const emails = text.match(emailRegex) || [];
  
  const lower = text.toLowerCase();
  const hasKanybil = lower.includes('kanybil') || lower.includes('noon');
  const hasMichael = lower.includes('wetnhialic') || lower.includes('michael');
  const hasMalual = lower.includes('malual') || lower.includes('makuach') || lower.includes('kuach');

  if (phones.length > 0 || emails.length > 0) {
    results.push({
      postIndex: idx + 1,
      date: p.date,
      phones,
      emails,
      hasKanybil,
      hasMichael,
      hasMalual,
      textSnippet: text.substring(0, 300).replace(/\n/g, ' ')
    });
  }
});

console.log(`Found ${results.length} posts containing phone numbers or emails.`);

results.forEach(r => {
  console.log(`\n--- Post #${r.postIndex} (${r.date}) ---`);
  if (r.hasKanybil) console.log("  [Tagged: Kanybil Noon]");
  if (r.hasMichael) console.log("  [Tagged: Michael Wetnhialic]");
  if (r.hasMalual) console.log("  [Tagged: Emmanuel Malual]");
  console.log(`  Phones: ${JSON.stringify(r.phones)}`);
  console.log(`  Emails: ${JSON.stringify(r.emails)}`);
  console.log(`  Snippet: ${r.textSnippet}...`);
});

