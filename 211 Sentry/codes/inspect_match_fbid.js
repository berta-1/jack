const fs = require('fs');

const path = 'c:/Tahir/Mission-1.0/Watchdog Press/WATCHDOG_PRESS_500_POSTS.json';
const content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n');

console.log("Lines 29040 - 29080:");
console.log(lines.slice(29040, 29085).join('\n'));

console.log("\nLines 48530 - 48570:");
console.log(lines.slice(48530, 48575).join('\n'));

