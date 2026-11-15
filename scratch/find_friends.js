const fs = require('fs');
const path = require('path');

const dir = 'c:/Tahir/mission-1/Watchdog Press';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md') || f.endsWith('.html') || (f.endsWith('.json') && !f.includes('MASTER') && !f.includes('500') && !f.includes('HARVESTED')));

for (const file of files) {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  ['friend', 'confidant', 'associate', 'contact person', 'kanybil', 'wetnhialic'].forEach(term => {
    let idx = 0;
    let count = 0;
    while ((idx = content.toLowerCase().indexOf(term, idx)) !== -1 && count < 3) {
      const snippet = content.substring(Math.max(0, idx - 60), Math.min(content.length, idx + 100)).replace(/\s+/g, ' ');
      console.log(`[${file}] '${term}': ...${snippet}...`);
      idx += term.length;
      count++;
    }
  });
}

