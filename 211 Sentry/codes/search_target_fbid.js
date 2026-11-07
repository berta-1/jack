const fs = require('fs');
const path = require('path');

function searchAll(dir, targetId) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    if (f === 'node_modules' || f === '.git' || f === 'scratch_chrome' || f === 'scratch_edge') continue;
    const full = path.join(dir, f);
    try {
      const s = fs.statSync(full);
      if (s.isDirectory()) searchAll(full, targetId);
      else if (f.endsWith('.json') || f.endsWith('.txt') || f.endsWith('.md') || f.endsWith('.html')) {
        const c = fs.readFileSync(full, 'utf8');
        if (c.includes(targetId)) {
          console.log(`FOUND in ${f}!`);
          const lines = c.split('\n');
          lines.forEach((l, idx) => {
            if (l.includes(targetId)) console.log(`  Line ${idx+1}: ${l.trim().substring(0, 200)}`);
          });
        }
      }
    } catch(e) {}
  }
}

console.log("Searching for 100009571531977 across all mission archives...");
searchAll('c:/Tahir/Mission-1.0', '100009571531977');

