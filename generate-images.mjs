import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('GEMINI_API_KEY not set');
  process.exit(1);
}

const IMAGEN_URL = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${API_KEY}`;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${API_KEY}`;

const IMAGES = [
  {
    filename: 'icon-marketing.png',
    prompt: 'A single 3D rendered Memoji-style character bust, cute and friendly, holding a megaphone. Smooth rounded features, large expressive eyes, warm smile. Wearing coral/orange casual top. Megaphone is bright orange. Isolated on pure white background, no shadows. Apple Memoji style, clean plastic-like 3D render. Square composition, centered.',
  },
  {
    filename: 'icon-webdev.png',
    prompt: 'A single 3D rendered Memoji-style character bust, cute and friendly, holding a small glowing laptop. Smooth rounded features, bright curious eyes. Wearing a teal/mint hoodie. Laptop screen glows blue-green. Isolated on pure white background, no shadows. Apple Memoji style, clean plastic-like 3D render. Square composition, centered.',
  },
  {
    filename: 'icon-automation.png',
    prompt: 'A single 3D rendered Memoji-style character bust, cute and friendly, surrounded by small floating golden gears. Smooth rounded features, playful eyes, confident grin. Wearing white tech-style top. Golden gear icons around head. Isolated on pure white background, no shadows. Apple Memoji style, clean plastic-like 3D render. Square composition, centered.',
  },
  {
    filename: 'icon-design.png',
    prompt: 'A single 3D rendered Memoji-style character bust, cute and friendly, holding a small color palette. Smooth rounded features, artistic eyes, cheerful smile. Wearing soft pink beret. Color palette with pink, purple, yellow swatches. Isolated on pure white background, no shadows. Apple Memoji style, clean plastic-like 3D render. Square composition, centered.',
  },
  {
    filename: 'free-marketing.jpg',
    prompt: 'A 3D rendered Memoji-style character standing confidently, holding clipboard with charts. Professional friendly expression, wearing navy blazer. Background is rich gradient from coral-orange to warm amber. Floating bar chart icons and upward arrows around character. Lower third fades to dark shadow. Apple Memoji 3D style, clean render, wide aspect ratio.',
  },
  {
    filename: 'free-website.jpg',
    prompt: 'A 3D rendered Memoji-style character holding glowing smartphone with speed gauge. Excited happy expression, wearing mint-green top. Background is gradient from teal-blue to emerald green. Floating speed gauge icons and lightning bolts. Lower third fades to dark shadow. Apple Memoji 3D style, clean render, wide aspect ratio.',
  },
  {
    filename: 'free-automation.jpg',
    prompt: 'A 3D rendered Memoji-style character surrounded by floating robotic arms and workflow nodes. Smart expression, wearing light gray outfit. Background is gradient from golden-yellow to warm orange. Floating gear icons and clock symbols. Lower third fades to dark shadow. Apple Memoji 3D style, clean render, wide aspect ratio.',
  },
  {
    filename: 'thumb-sns-marketing.jpg',
    prompt: 'A 3D rendered Memoji-style character holding smartphone showing social media stats. Energetic expression, wearing trendy coral-pink outfit. Background smooth gradient pink-red to coral. Floating hearts, likes, notification bubbles. Horizontal composition. Apple Memoji 3D style, vibrant clean render.',
  },
  {
    filename: 'thumb-web-dev.jpg',
    prompt: 'A 3D rendered Memoji-style character at floating desk with glowing monitor showing website wireframe. Calm professional expression, blue-white outfit. Background gradient navy to cyan. Floating browser windows and device mockups. Horizontal composition. Apple Memoji 3D style, cool-toned clean render.',
  },
  {
    filename: 'banner-hero.png',
    prompt: 'A single full-body 3D rendered Memoji-style character, standing confidently, one hand raised presenting. Broad warm smile, bright eyes, wearing sharp modern black blazer with white shirt. Full body visible head to toe. Pure white background. Soft studio lighting with white rim light. Apple Memoji full-body 3D character, professional agency mascot style.',
  },
];

// Try Imagen API first, fallback to Gemini
async function generateWithImagen(prompt) {
  const body = {
    instances: [{ prompt }],
    parameters: { sampleCount: 1 },
  };

  const res = await fetch(IMAGEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Imagen ${res.status}: ${err.slice(0, 150)}`);
  }

  const data = await res.json();
  const b64 = data.predictions?.[0]?.bytesBase64Encoded;
  if (!b64) throw new Error('No image in Imagen response');
  return Buffer.from(b64, 'base64');
}

async function generateWithGemini(prompt) {
  const body = {
    contents: [{ parts: [{ text: `Generate an image: ${prompt}` }] }],
    generationConfig: {
      responseModalities: ['IMAGE', 'TEXT'],
    },
  };

  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini ${res.status}: ${err.slice(0, 150)}`);
  }

  const data = await res.json();
  const parts = data.candidates?.[0]?.content?.parts || [];
  for (const part of parts) {
    if (part.inlineData) {
      return Buffer.from(part.inlineData.data, 'base64');
    }
  }
  throw new Error('No image in Gemini response');
}

async function generateImage(imageConfig) {
  console.log(`Generating: ${imageConfig.filename}...`);

  try {
    // Try Imagen first
    const buffer = await generateWithImagen(imageConfig.prompt);
    const outPath = path.join('public', imageConfig.filename);
    fs.writeFileSync(outPath, buffer);
    console.log(`  SAVED (Imagen): ${outPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
    return true;
  } catch (e1) {
    console.log(`  Imagen failed: ${e1.message.slice(0, 80)}, trying Gemini...`);
    try {
      const buffer = await generateWithGemini(imageConfig.prompt);
      const outPath = path.join('public', imageConfig.filename);
      fs.writeFileSync(outPath, buffer);
      console.log(`  SAVED (Gemini): ${outPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
      return true;
    } catch (e2) {
      console.error(`  BOTH FAILED: ${e2.message.slice(0, 100)}`);
      return false;
    }
  }
}

async function main() {
  console.log('=== Image Generator (Imagen + Gemini fallback) ===\n');

  if (!fs.existsSync('public')) {
    fs.mkdirSync('public', { recursive: true });
  }

  let success = 0, fail = 0;

  for (const img of IMAGES) {
    const ok = await generateImage(img);
    if (ok) success++; else fail++;
    await new Promise(r => setTimeout(r, 3000));
  }

  console.log(`\n=== Done: ${success} success, ${fail} failed ===`);
}

main();
