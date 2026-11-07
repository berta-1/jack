const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const htmlPath = 'C:\\Tahir\\Mission-1.0\\211 Sentry\\211_SENTRY_ADMINS_DOSSIER.html';
const pdfPath = 'C:\\Tahir\\Mission-1.0\\211 Sentry\\211_SENTRY_ADMINS_DOSSIER.pdf';
const userDataDir = 'C:\\Tahir\\Mission-1.0\\211 Sentry\\scratch_chrome';

console.log("Compiling PDF from:", htmlPath);
console.log("Target PDF:", pdfPath);

if (!fs.existsSync(userDataDir)) {
  fs.mkdirSync(userDataDir, { recursive: true });
}

const args = [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--disable-dev-shm-usage',
  '--no-pdf-header-footer',
  '--user-data-dir=' + userDataDir,
  '--print-to-pdf=' + pdfPath,
  htmlPath
];

const res = spawnSync(chromePath, args, { timeout: 30000 });
console.log("Exit code:", res.status);
if (res.error) console.error("Error:", res.error);
if (res.stderr && res.stderr.length) console.log("Stderr:", res.stderr.toString());

if (fs.existsSync(pdfPath)) {
  const stats = fs.statSync(pdfPath);
  console.log("SUCCESS! PDF Size:", stats.size, "bytes");
} else {
  console.error("PDF was not created!");
}

