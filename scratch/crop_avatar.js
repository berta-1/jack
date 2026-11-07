const fs = require('fs');
const zlib = require('zlib');
const buf = fs.readFileSync('C:/Users/ademt/.gemini/antigravity/brain/11c050c8-ba29-4ba2-8993-d5396547a6f8/.user_uploaded/media_1793511309762_09169516.png');

let pos = 8, idat = [], width, height;
while (pos < buf.length) {
  const len = buf.readUInt32BE(pos);
  const type = buf.toString('ascii', pos + 4, pos + 8);
  if (type === 'IHDR') { width = buf.readUInt32BE(pos + 8); height = buf.readUInt32BE(pos + 12); }
  if (type === 'IDAT') idat.push(buf.slice(pos + 8, pos + 8 + len));
  pos += 12 + len;
}
const decomp = zlib.inflateSync(Buffer.concat(idat));
const raw = Buffer.alloc(width * height * 4);
const stride = width * 4 + 1;
for (let y = 0; y < height; y++) {
  const filter = decomp[y * stride];
  const rowStart = y * stride + 1, outStart = y * width * 4;
  for (let x = 0; x < width * 4; x++) {
    const rawVal = decomp[rowStart + x];
    const left = x >= 4 ? raw[outStart + x - 4] : 0;
    const up = y > 0 ? raw[outStart - width * 4 + x] : 0;
    const upLeft = (y > 0 && x >= 4) ? raw[outStart - width * 4 + x - 4] : 0;
    let val = 0;
    if (filter === 0) val = rawVal;
    else if (filter === 1) val = (rawVal + left) & 0xff;
    else if (filter === 2) val = (rawVal + up) & 0xff;
    else if (filter === 3) val = (rawVal + Math.floor((left + up) / 2)) & 0xff;
    else if (filter === 4) {
      const p = left + up - upLeft;
      const pa = Math.abs(p - left), pb = Math.abs(p - up), pc = Math.abs(p - upLeft);
      let pr = left;
      if (pb < pa && pb < pc) pr = up; else if (pc < pa) pr = upLeft;
      val = (rawVal + pr) & 0xff;
    }
    raw[outStart + x] = val;
  }
}

// Crop 36x36 avatar
const cropW = 36, cropH = 36;
const startX = 471, startY = 103;

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
  return (crc ^ (-1)) >>> 0;
}
const crcTable = [];
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) c = ((c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1));
  crcTable[i] = c;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const t = Buffer.from(type, 'ascii');
  const cData = Buffer.concat([t, data]);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(cData), 0);
  return Buffer.concat([len, cData, crcBuf]);
}
const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(cropW, 0); ihdr.writeUInt32BE(cropH, 4);
ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

const scanlines = [];
for (let y = 0; y < cropH; y++) {
  const scanline = Buffer.alloc(cropW * 4 + 1);
  scanline[0] = 0;
  for (let x = 0; x < cropW; x++) {
    const srcP = ((startY + y) * width + (startX + x)) * 4;
    const idx = 1 + x * 4;
    scanline[idx] = raw[srcP];
    scanline[idx+1] = raw[srcP+1];
    scanline[idx+2] = raw[srcP+2];
    scanline[idx+3] = 255;
  }
  scanlines.push(scanline);
}
const compressed = zlib.deflateSync(Buffer.concat(scanlines));
const outPng = Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', compressed), chunk('IEND', Buffer.alloc(0))]);
fs.writeFileSync('social-violet/src/assets/fb-user-dark-avatar.png', outPng);
console.log('Saved fb-user-dark-avatar.png');

