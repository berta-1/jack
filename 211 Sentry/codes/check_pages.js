const fs = require('fs');
const buf = fs.readFileSync('C:\\Tahir\\Mission-1.0\\211 Sentry\\211_SENTRY_ADMINS_DOSSIER.pdf');
const str = buf.toString('latin1');
const pageMatches = str.match(/\/Type\s*\/Page\b/g);
console.log("Total PDF Page Count:", pageMatches ? pageMatches.length : "Unknown");

