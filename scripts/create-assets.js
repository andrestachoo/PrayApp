/**
 * Generates placeholder PNG assets required by app.json.
 * Pure Node.js — no npm dependencies needed.
 * Run: node scripts/create-assets.js
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// ─── CRC32 (needed for valid PNG chunks) ─────────────────────────────────────

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// ─── PNG builder ─────────────────────────────────────────────────────────────

function makeChunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length);
  const crcInput = Buffer.concat([typeBytes, data]);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(crcInput));
  return Buffer.concat([lenBuf, typeBytes, data, crcBuf]);
}

/**
 * Create a solid-color PNG.
 * @param {number} width
 * @param {number} height
 * @param {number} r  0–255
 * @param {number} g  0–255
 * @param {number} b  0–255
 */
function createPNG(width, height, r, g, b) {
  // Signature
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 2; // color type: RGB
  // compression, filter, interlace = 0
  const ihdr = makeChunk('IHDR', ihdrData);

  // Raw scanlines: each row = filter byte (0) + RGB pixels
  const rowBytes = 1 + width * 3;
  const raw = Buffer.alloc(height * rowBytes);
  for (let y = 0; y < height; y++) {
    const base = y * rowBytes;
    raw[base] = 0; // filter: None
    for (let x = 0; x < width; x++) {
      raw[base + 1 + x * 3] = r;
      raw[base + 1 + x * 3 + 1] = g;
      raw[base + 1 + x * 3 + 2] = b;
    }
  }

  const compressed = zlib.deflateSync(raw, { level: 1 });
  const idat = makeChunk('IDAT', compressed);

  // IEND
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdr, idat, iend]);
}

// ─── Asset definitions ───────────────────────────────────────────────────────

// Habita brand colors
const FOREST_GREEN = [0x2c, 0x4a, 0x3e]; // #2C4A3E — primary
const WARM_WHITE   = [0xfa, 0xf8, 0xf5]; // #FAF8F5 — background
const WHITE        = [0xff, 0xff, 0xff]; // #FFFFFF — notification icon

const assetsDir = path.join(__dirname, '..', 'assets');
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

const assets = [
  { file: 'icon.png',              size: 1024, color: FOREST_GREEN },
  { file: 'splash.png',            size: 1284, color: WARM_WHITE   },
  { file: 'adaptive-icon.png',     size: 1024, color: FOREST_GREEN },
  { file: 'notification-icon.png', size: 96,   color: WHITE        },
];

let created = 0;
for (const { file, size, color } of assets) {
  const dest = path.join(assetsDir, file);
  if (fs.existsSync(dest)) {
    console.log(`  ✓ ${file} (already exists, skipped)`);
    continue;
  }
  const [r, g, b] = color;
  const png = createPNG(size, size, r, g, b);
  fs.writeFileSync(dest, png);
  console.log(`  ✓ ${file} created (${size}×${size})`);
  created++;
}

console.log(`\nDone. ${created} asset(s) created in /assets`);
if (created === 0) console.log('All assets already exist.');
