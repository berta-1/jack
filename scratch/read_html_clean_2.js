const fs = require('fs');
const html = fs.readFileSync('Watchdog Press/EMMANUEL_MALUAL_MAKUACH_DOSSIER.html', 'utf8');

const stripped = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                     .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                     .replace(/<[^>]+>/g, '\n')
                     .split('\n')
                     .map(s => s.trim())
                     .filter(s => s.length > 0)
                     .join('\n');

console.log(stripped.substring(4000, 10000));
