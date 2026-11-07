const fs = require('fs');
const path = require('path');

function searchAll(dir, query) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    if (f === 'node_modules' || f === '.git' || f === 'scratch_chrome' || f === 'scratch_edge') continue;
    const full = path.join(dir, f);
    try {
      const s = fs.statSync(full);
      if (s.isDirectory()) searchAll(full, query);
      else if (f.endsWith('.json') || f.endsWith('.md') || f.endsWith('.html') || f.endsWith('.txt')) {
        const c = fs.readFileSync(full, 'utf8');
        if (c.toLowerCase().includes('sunday de john') || c.toLowerCase().includes('emmanuel sunday')) {
          const lines = c.split('\n');
          lines.forEach(l => {
            if (l.includes('@') || l.match(/\+?\d{9,}/)) {
              console.log(`[${f}] ${l.trim()}`);
            }
          });
        }
      }
    } catch(e) {}
  }
}

searchAll('c:/Tahir/Mission-1.0', 'sunday');

