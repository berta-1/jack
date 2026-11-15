const fs = require('fs');
const p = JSON.parse(fs.readFileSync('Watchdog Press/WATCHDOG_PRESS_500_POSTS.json', 'utf8'));

const commentMap = {};

p.forEach((post, pIdx) => {
  if (post.topComments) {
    post.topComments.forEach(c => {
      const name = c.profileName || (c.author && c.author.name) || 'Unknown';
      const url = c.profileUrl || (c.author && c.author.url) || '';
      if (!commentMap[name]) {
        commentMap[name] = { count: 0, url: url, comments: [] };
      }
      commentMap[name].count++;
      commentMap[name].comments.push({ postIdx: pIdx, text: (c.text || '').replace(/\r?\n/g, ' ') });
    });
  }
});

const sorted = Object.entries(commentMap).sort((a,b) => b[1].count - a[1].count);
console.log('Top commenters:');
sorted.slice(0, 30).forEach(([name, data]) => {
  console.log(name + ' (' + data.count + ' comments) [' + data.url + ']');
  data.comments.slice(0, 2).forEach(cm => console.log('   - [Post #' + cm.postIdx + ']: ' + cm.text.substring(0, 100)));
});
