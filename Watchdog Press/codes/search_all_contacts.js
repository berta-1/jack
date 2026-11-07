const fs = require('fs');
const path = require('path');

function searchDir(dir, query) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (f === 'node_modules' || f === '.git' || f === 'scratch_chrome' || f === 'scratch_edge') continue;
    try {
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        searchDir(full, query);
      } else if (f.endsWith('.json') || f.endsWith('.txt') || f.endsWith('.md') || f.endsWith('.html') || f.endsWith('.js')) {
        const content = fs.readFileSync(full, 'utf8');
        query.forEach(q => {
          if (content.toLowerCase().includes(q)) {
            // Find matches around it
            const lines = content.split('\n');
            lines.forEach((line, lIdx) => {
              if (line.toLowerCase().includes(q) && (line.includes('@') || line.match(/\+?\d{9,15}/))) {
                console.log(`[${f}:${lIdx + 1}] Match for "${q}": ${line.trim().substring(0, 200)}`);
              }
            });
          }
        });
      }
    } catch(e) {}
  }
}

console.log("Searching c:/Tahir/Mission-1.0/ for admin contact references...");
searchDir('c:/Tahir/Mission-1.0', ['kanybil', 'wetnhialic', 'makuach', 'kuach']);

