import fs from 'fs';
import sharp from 'sharp';

const API_KEY = process.env.GEMINI_API_KEY;
const URL_STR = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${API_KEY}`;

const BASE_DESC = 'A beautiful young Korean woman 3D character in Apple Memoji style. She has medium-length layered dark brown hair (shoulder length), Korean beauty features: slim oval face, soft double eyelids, big bright brown eyes, small delicate nose, natural pink lips, fair smooth skin with soft rosy cheeks. High quality Apple Memoji / iPhone Memoji style 3D character art. Clean smooth 3D render with soft studio lighting. Pure solid bright green (#00FF00) chroma key background.';

const prompt = `${BASE_DESC} Upper body portrait. She has her chin resting lightly on one hand in a thoughtful thinking pose. Slight head tilt, eyebrows slightly raised, gentle curious smile. Wearing a cozy dark navy sweater. Contemplative and approachable look.`;

const res = await fetch(URL_STR, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{ parts: [{ text: `Generate an image: ${prompt}` }] }],
    generationConfig: { responseModalities: ['IMAGE', 'TEXT'] },
  }),
});

if (!res.ok) { console.error(`ERROR ${res.status}`); process.exit(1); }
const data = await res.json();
for (const p of (data.candidates?.[0]?.content?.parts || [])) {
  if (p.inlineData) {
    const buf = Buffer.from(p.inlineData.data, 'base64');
    fs.writeFileSync('public/mascot-thinking.png', buf);
    console.log(`Generated: ${(buf.length/1024).toFixed(1)} KB`);

    // Remove green chroma key + white background using flood fill
    const image = sharp('public/mascot-thinking.png');
    const { data: pixels, info } = await image.raw().ensureAlpha().toBuffer({ resolveWithObject: true });
    const { width, height } = info;

    const isBG = (i) => {
      const r = pixels[i], g = pixels[i+1], b = pixels[i+2];
      return (r > 240 && g > 240 && b > 240) || (g > 200 && r < 100 && b < 100);
    };

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
      pixels[pos*4+3] = 0;
      const x = pos%width, y = Math.floor(pos/width);
      if (x>0) queue.push(pos-1);
      if (x<width-1) queue.push(pos+1);
      if (y>0) queue.push(pos-width);
      if (y<height-1) queue.push(pos+width);
    }

    await sharp(pixels, { raw: { width, height, channels: 4 } }).png().toFile('public/mascot-thinking.png.tmp');
    fs.renameSync('public/mascot-thinking.png.tmp', 'public/mascot-thinking.png');
    console.log('BG removed!');
    break;
  }
}
