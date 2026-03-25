import fs from 'fs';
import sharp from 'sharp';

// Flood fill from edges only - removes background without touching interior white (eyes, teeth, etc.)
async function removeBackgroundFloodFill(filePath, threshold = 245) {
  console.log(`Processing: ${filePath}...`);
  const image = sharp(filePath);
  const { data, info } = await image.raw().ensureAlpha().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  const isWhite = (i) => data[i] > threshold && data[i+1] > threshold && data[i+2] > threshold;
  const visited = new Uint8Array(width * height);
  const queue = [];

  // Seed from all edge pixels
  for (let x = 0; x < width; x++) {
    queue.push(x); // top row
    queue.push((height - 1) * width + x); // bottom row
  }
  for (let y = 0; y < height; y++) {
    queue.push(y * width); // left col
    queue.push(y * width + (width - 1)); // right col
  }

  // BFS flood fill from edges
  let head = 0;
  while (head < queue.length) {
    const pos = queue[head++];
    if (pos < 0 || pos >= width * height || visited[pos]) continue;
    const pi = pos * 4;
    if (!isWhite(pi)) continue;

    visited[pos] = 1;
    data[pi + 3] = 0; // Make transparent

    const x = pos % width;
    const y = Math.floor(pos / width);
    if (x > 0) queue.push(pos - 1);
    if (x < width - 1) queue.push(pos + 1);
    if (y > 0) queue.push(pos - width);
    if (y < height - 1) queue.push(pos + width);
  }

  // Soften edges (anti-alias)
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const pos = y * width + x;
      const pi = pos * 4;
      if (data[pi + 3] === 0) continue; // already transparent
      // Count transparent neighbors
      let tn = 0;
      if (data[((y-1)*width+x)*4+3] === 0) tn++;
      if (data[((y+1)*width+x)*4+3] === 0) tn++;
      if (data[(y*width+x-1)*4+3] === 0) tn++;
      if (data[(y*width+x+1)*4+3] === 0) tn++;
      if (tn > 0 && tn < 4) {
        // Edge pixel - partial transparency for smooth edges
        data[pi + 3] = Math.round(data[pi + 3] * (1 - tn * 0.15));
      }
    }
  }

  await sharp(data, { raw: { width, height, channels: 4 } })
    .png().toFile(filePath + '.tmp');
  fs.renameSync(filePath + '.tmp', filePath);
  const size = (fs.statSync(filePath).size / 1024).toFixed(1);
  console.log(`  DONE: ${size} KB`);
}

// First regenerate mascots, then remove BG
const files = [
  'mascot-banner-wave.png',
  'mascot-gift-thumbsup.png',
  'mascot-thinking.png',
  'mascot-pointing.png',
  'mascot-professional-stand.png',
  'mascot-listening.png',
  'mascot-celebrate.png',
  'mascot-guide-list.png',
];

for (const f of files) {
  const p = `public/${f}`;
  if (fs.existsSync(p)) await removeBackgroundFloodFill(p);
  else console.log(`  SKIP: ${f}`);
}
console.log('\nAll done!');
