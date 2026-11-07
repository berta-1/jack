const fs = require('fs');

const sentryPosts = JSON.parse(fs.readFileSync('c:/Tahir/Mission-1.0/211 Sentry/raw_archive/211_SENTRY_399_POSTS.json', 'utf8'));
const clintonPosts = JSON.parse(fs.readFileSync('c:/Tahir/Mission-1.0/211 Sentry/raw_archive/DENG_CLINTON_PERSONAL_HARVEST_317.json', 'utf8'));

console.log(`211 Sentry Posts: ${sentryPosts.length}`);
console.log(`Deng Clinton Posts: ${clintonPosts.length}`);

// Keyword frequencies
const keywords = [
  'akech', 'akec', 'tong', 'michael', 'wetnhialic', 'adok', 'napoleon',
  'gregory', 'vasili', 'akol koor', 'bol wek', 'tonj', 'nss', 'majok',
  'salva kiir', 'j1', 'slay queen', 'bewitched', 'arrest'
];

function analyzeCorpus(corpus, name) {
  const stats = {};
  keywords.forEach(kw => stats[kw] = 0);
  corpus.forEach(p => {
    const text = (p.text || '').toLowerCase();
    keywords.forEach(kw => {
      if (text.includes(kw)) stats[kw]++;
    });
  });
  console.log(`\n=== Keyword frequencies in ${name} ===`);
  for (const [k, v] of Object.entries(stats)) {
    if (v > 0) console.log(`  ${k.padEnd(16)}: ${v} posts`);
  }
  return stats;
}

analyzeCorpus(sentryPosts, "211 Sentry Page");
analyzeCorpus(clintonPosts, "Deng Clinton Profile");

// Find direct narrative matches
console.log("\n=== CROSS-MATCHING SPECIFIC CONTROVERSIES ===");

const crossMatches = [];
clintonPosts.forEach((cp, cIdx) => {
  const cText = cp.text || '';
  if (cText.length < 30) return;
  
  sentryPosts.forEach((sp, sIdx) => {
    const sText = sp.text || '';
    if (sText.length < 30) return;
    
    // Check shared key entities
    const hasAkech = (cText.toLowerCase().includes('akech') || cText.toLowerCase().includes('akec')) &&
                     (sText.toLowerCase().includes('akech') || sText.toLowerCase().includes('akec'));
    const hasMichael = cText.toLowerCase().includes('wetnhialic') && sText.toLowerCase().includes('wetnhialic');
    const hasAdok = cText.toLowerCase().includes('napoleon') && sText.toLowerCase().includes('napoleon');
    const hasGregory = (cText.toLowerCase().includes('gregory') || cText.toLowerCase().includes('vasili')) &&
                       (sText.toLowerCase().includes('gregory') || sText.toLowerCase().includes('vasili'));

    if ((hasAkech && hasMichael) || (hasAkech && hasGregory) || (hasAkech && hasAdok)) {
      crossMatches.push({
        clintonIdx: cIdx,
        clintonText: cText.substring(0, 200),
        sentryIdx: sIdx,
        sentryText: sText.substring(0, 200),
        type: hasMichael ? 'AKECH_MICHAEL_FEUD' : (hasGregory ? 'AKECH_GREGORY' : 'AKECH_ADOK')
      });
    }
  });
});

console.log(`Found ${crossMatches.length} entity/thematic intersections.`);
// Show unique matches
const seenC = new Set();
crossMatches.forEach(m => {
  if (!seenC.has(m.clintonIdx)) {
    seenC.add(m.clintonIdx);
    console.log(`\n[Theme: ${m.type}]`);
    console.log(`Deng Clinton (Post #${m.clintonIdx + 1}): "${m.clintonText}..."`);
    console.log(`211 Sentry (Post #${m.sentryIdx + 1}): "${m.sentryText}..."`);
  }
});

