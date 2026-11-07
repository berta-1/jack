const fs = require('fs');
const path = require('path');

function searchForWhatsApp(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    if (f === 'node_modules' || f === '.git' || f === 'scratch_chrome' || f === 'scratch_edge') continue;
    const full = path.join(dir, f);
    try {
      const s = fs.statSync(full);
      if (s.isDirectory()) searchForWhatsApp(full);
      else if (f.endsWith('.json') || f.endsWith('.md') || f.endsWith('.txt')) {
        const c = fs.readFileSync(full, 'utf8');
        if (c.toLowerCase().includes('whatsapp') || c.toLowerCase().includes('chat.whatsapp.com') || c.toLowerCase().includes('wa.me')) {
          const lines = c.split('\n');
          lines.forEach((l, idx) => {
            if (l.toLowerCase().includes('whatsapp') || l.toLowerCase().includes('wa.me')) {
              console.log(`[${f}:${idx+1}] ${l.trim().substring(0, 300)}`);
            }
          });
        }
      }
    } catch(e) {}
  }
}

console.log("Searching for WhatsApp links and group references...");
searchForWhatsApp('c:/Tahir/Mission-1.0');

