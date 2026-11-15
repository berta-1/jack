const fs = require('fs');
const cheerio = require('fs').readFileSync('Watchdog Press/EMMANUEL_MALUAL_MAKUACH_DOSSIER.html', 'utf8');

// Strip html tags roughly
const text = cheerio.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
console.log(text.substring(0, 3000));
