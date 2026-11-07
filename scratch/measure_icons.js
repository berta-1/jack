const fs = require('fs');
const zlib = require('zlib');
const buf = fs.readFileSync('C:/Users/ademt/.gemini/antigravity/brain/11c050c8-ba29-4ba2-8993-d5396547a6f8/.user_uploaded/media_1793511309762_09169516.png');

let pos = 8, idat = [], width, height;
while (pos < buf.length) {
  const len = buf.readUInt32BE(pos);
  const type = buf.toString('ascii', pos + 4, pos + 8);
  if (type === 'IHDR') {
    width = buf.readUInt32BE(pos + 8);
    height = buf.readUInt32BE(pos + 12);
  }
  if (type === 'IDAT') idat.push(buf.slice(pos + 8, pos + 8 + len));
  pos += 12 + len;
}
const decomp = zlib.inflateSync(Buffer.concat(idat));
const bpp = 4;
const stride = width * bpp + 1;
const raw = Buffer.alloc(width * height * 4);

for (let y = 0; y < height; y++) {
  const filter = decomp[y * stride];
  const rowStart = y * stride + 1;
  const outStart = y * width * 4;
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
      if (pb < pa && pb < pc) pr = up;
      else if (pc < pa) pr = upLeft;
      val = (rawVal + pr) & 0xff;
    }
    raw[outStart + x] = val;
  }
}

const colW = width / 6;
for (let c = 0; c < 6; c++) {
  const startX = Math.round(c * colW);
  const endX = Math.round((c + 1) * colW);
  let minX = endX, maxX = startX, minY = height, maxY = 90;
  for (let y = 90; y < height; y++) {
    for (let x = startX; x < endX; x++) {
      const p = (y * width + x) * 4;
      const r = raw[p], g = raw[p+1], b = raw[p+2];
      if (r < 240 || g < 240 || b < 240) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  const w = maxX - minX + 1;
  const h = maxY - minY + 1;
  const cX = Math.round((minX + maxX)/2);
  const cY = Math.round((minY + maxY)/2);
  console.log(`Icon ${c+1}: w=${w}, h=${h}, x=${minX}..${maxX}, y=${minY}..${maxY}, center=(${cX}, ${cY})`);
}

