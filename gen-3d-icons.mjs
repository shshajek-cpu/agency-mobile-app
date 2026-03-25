import fs from 'fs';
import sharp from 'sharp';

const API_KEY = process.env.GEMINI_API_KEY;
const URL_STR = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${API_KEY}`;

const ICONS = [
  { filename: 'icon-marketing.png', prompt: 'Generate an image: A single 3D rendered glossy icon of a megaphone/bullhorn in coral-orange color, cute rounded style like Apple iOS app icons. Soft studio lighting, slight tilt angle. Isolated on pure white background. Clean minimal 3D render, no text, no characters. Square composition.' },
  { filename: 'icon-webdev.png', prompt: 'Generate an image: A single 3D rendered glossy icon of a laptop computer with code brackets on screen, in teal/mint color, cute rounded style like Apple iOS app icons. Soft studio lighting, slight tilt angle. Isolated on pure white background. Clean minimal 3D render, no text, no characters. Square composition.' },
  { filename: 'icon-automation.png', prompt: 'Generate an image: A single 3D rendered glossy icon of a lightning bolt surrounded by small gears, in golden-amber color, cute rounded style like Apple iOS app icons. Soft studio lighting, slight tilt angle. Isolated on pure white background. Clean minimal 3D render, no text, no characters. Square composition.' },
  { filename: 'icon-design.png', prompt: 'Generate an image: A single 3D rendered glossy icon of an artist palette with a paintbrush, in soft pink/rose color, cute rounded style like Apple iOS app icons. Soft studio lighting, slight tilt angle. Isolated on pure white background. Clean minimal 3D render, no text, no characters. Square composition.' },
];

async function removeWhiteBG(filePath) {
  const image = sharp(filePath);
  const { data, info } = await image.raw().ensureAlpha().toBuffer({ resolveWithObject: true });
  const threshold = 240;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i+1], b = data[i+2];
    if (r > threshold && g > threshold && b > threshold) {
      data[i+3] = 0;
    } else if (r > threshold - 25 && g > threshold - 25 && b > threshold - 25) {
      const avg = (r + g + b) / 3;
      data[i+3] = Math.min(data[i+3], Math.round(Math.max(0, Math.min(255, (threshold - avg) * (255 / 25)))));
    }
  }
  await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png().toFile(filePath + '.tmp');
  fs.renameSync(filePath + '.tmp', filePath);
}

for (const icon of ICONS) {
  console.log(`Generating: ${icon.filename}...`);
  const res = await fetch(URL_STR, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: icon.prompt }] }],
      generationConfig: { responseModalities: ['IMAGE', 'TEXT'] },
    }),
  });
  if (!res.ok) { console.error(`  ERROR: ${res.status}`); continue; }
  const data = await res.json();
  for (const p of (data.candidates?.[0]?.content?.parts || [])) {
    if (p.inlineData) {
      const buf = Buffer.from(p.inlineData.data, 'base64');
      const path = `public/${icon.filename}`;
      fs.writeFileSync(path, buf);
      console.log(`  Generated: ${(buf.length/1024).toFixed(1)} KB`);
      await removeWhiteBG(path);
      console.log(`  BG removed!`);
      break;
    }
  }
  await new Promise(r => setTimeout(r, 3000));
}
console.log('\nDone!');
