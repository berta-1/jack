const fs = require('fs');

const clintonPosts = JSON.parse(fs.readFileSync('c:/Tahir/Mission-1.0/211 Sentry/raw_archive/DENG_CLINTON_PERSONAL_HARVEST_317.json', 'utf8'));
const sentryPosts = JSON.parse(fs.readFileSync('c:/Tahir/Mission-1.0/211 Sentry/raw_archive/211_SENTRY_399_POSTS.json', 'utf8'));

console.log("Analyzing Deng Clinton 317 posts for contacts and addresses...");

const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const phoneRegex = /(?:\+?44|\+?211|\+?254|07\d|09\d|\+?1)\s*[\d\s\-]{7,15}\d/g;

clintonPosts.forEach((p, idx) => {
  const t = p.text || '';
  const emails = t.match(emailRegex) || [];
  const phones = t.match(phoneRegex) || [];
  const lower = t.toLowerCase();
  
  if (emails.length > 0 || phones.length > 0 || lower.includes('email') || lower.includes('phone') || lower.includes('contact') || lower.includes('address') || lower.includes('edinburgh') || lower.includes('blackpool') || lower.includes('scotland') || lower.includes('tel')) {
    console.log(`\n--- Deng Clinton Post #${idx + 1} (${p.date}) ---`);
    if (emails.length) console.log("  Emails:", emails);
    if (phones.length) console.log("  Phones:", phones);
    console.log("  Snippet:", t.substring(0, 300).replace(/\n/g, ' '));
  }
});

console.log("\nAnalyzing 211 Sentry 399 posts for contacts and addresses...");
sentryPosts.forEach((p, idx) => {
  const t = p.text || '';
  const emails = t.match(emailRegex) || [];
  const phones = t.match(phoneRegex) || [];
  if (emails.length > 0 || phones.length > 0) {
    console.log(`\n--- 211 Sentry Post #${idx + 1} (${p.date}) ---`);
    if (emails.length) console.log("  Emails:", emails);
    if (phones.length) console.log("  Phones:", phones);
    console.log("  Snippet:", t.substring(0, 300).replace(/\n/g, ' '));
  }
});

