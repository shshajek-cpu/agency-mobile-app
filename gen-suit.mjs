import fs from 'fs';
import sharp from 'sharp';

const API_KEY = process.env.GEMINI_API_KEY;
const URL_STR = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${API_KEY}`;
const BASE = 'A beautiful young Korean woman 3D character in Apple Memoji style. She has medium-length layered dark brown hair, Korean beauty features: slim oval face, big bright brown eyes, warm smile, fair skin with rosy cheeks. High quality Apple Memoji 3D render. Soft studio lighting. Pure white background, no shadows.';

const IMAGES = [
  {
    filename: 'mascot-professional-stand.png',
    prompt: `${BASE} She is wearing a sharp formal dark navy business suit with white shirt underneath. Professional confident posture, hands clasped in front. Warm reassuring smile. Upper body portrait. Elegant professional consultant look.`,
  },
  {
    filename: 'mascot-detail-explain.png',
    prompt: `${BASE} She is wearing a sharp formal dark navy business suit with white shirt. She is gesturing with one hand as if explaining something, other hand holding a small tablet or clipboard. Friendly knowledgeable expression. Upper body portrait.`,
  },
];

async function floodFillRemoveBG(filePath) {
  const image = sharp(filePath);
  const { data, info } = await image.raw().ensureAlpha().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const isBG = (i) => data[i] > 240 && data[i+1] > 240 && data[i+2] > 240;
  const visited = new Uint8Array(width * height);
  const queue = [];
  for (let x = 0; x < width; x++) { queue.push(x); queue.push((height-1)*width+x); }
  for (let y = 0; y < height; y++) { queue.push(y*width); queue.push(y*width+width-1); }
  let head = 0;
  while (head < queue.length) {
    const pos = queue[head++];
    if (pos < 0 || pos >= width*height || visited[pos]) continue;
    if (!isBG(pos*4)) continue;
    visited[pos] = 1;
    data[pos*4+3] = 0;
    const x = pos%width, y = Math.floor(pos/width);
    if (x>0) queue.push(pos-1);
    if (x<width-1) queue.push(pos+1);
    if (y>0) queue.push(pos-width);
    if (y<height-1) queue.push(pos+width);
  }
  await sharp(data, { raw: { width, height, channels: 4 } }).png().toFile(filePath+'.tmp');
  fs.renameSync(filePath+'.tmp', filePath);
}

for (const img of IMAGES) {
  console.log(`Generating: ${img.filename}...`);
  const res = await fetch(URL_STR, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `Generate an image: ${img.prompt}` }] }],
      generationConfig: { responseModalities: ['IMAGE', 'TEXT'] },
    }),
  });
  if (!res.ok) { console.error(`ERROR ${res.status}`); continue; }
  const data = await res.json();
  for (const p of (data.candidates?.[0]?.content?.parts || [])) {
    if (p.inlineData) {
      fs.writeFileSync(`public/${img.filename}`, Buffer.from(p.inlineData.data, 'base64'));
      console.log(`  Generated!`);
      await floodFillRemoveBG(`public/${img.filename}`);
      console.log(`  BG removed!`);
      break;
    }
  }
  await new Promise(r => setTimeout(r, 3000));
}
console.log('Done!');
