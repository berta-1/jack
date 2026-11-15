const fs = require('fs');
const p = JSON.parse(fs.readFileSync('Watchdog Press/WATCHDOG_PRESS_500_POSTS.json', 'utf8'));

const names = ['Kuol Aguek Mawel', 'Malekdit Majok Dakok', 'Anyuon Tong-Magak', 'Albino Daai', 'Angelo Ajuong Bol Ajuong', 'Ma Bee Akol', 'Philiplual Bol', 'Adolmuot Marsi', 'Mangardit A. Chuol', 'Makuch'];

p.forEach((post, pIdx) => {
  if (post.topComments) {
    post.topComments.forEach(c => {
      if (names.includes(c.name)) {
        console.log('[' + c.name + '] on Post #' + pIdx + ' (' + (c.url || 'no url') + '):');
        console.log('  "' + (c.text || c.sample || '').replace(/\r?\n/g, ' ') + '"');
      }
    });
  }
});
