import fs from 'fs';

const API_KEY = process.env.GEMINI_API_KEY;
const URL_STR = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${API_KEY}`;

const body = {
  contents: [{ parts: [{ text: 'Generate an image: A beautiful young Korean woman 3D character in Apple Memoji style. She has a medium-length layered hair (shoulder length, 중단발) with soft dark brown color and slight natural wave at the ends. Korean beauty features: slim oval face, soft double eyelids, big bright brown eyes, small delicate nose, natural pink lips with a gentle warm smile, fair smooth skin with soft rosy cheeks. Wearing a clean modern white top. Facing directly forward (front view). Clean smooth 3D render with soft studio lighting. Bust portrait centered. Pure white background, no shadows. High quality Apple Memoji / iPhone Memoji style 3D character art.' }] }],
  generationConfig: { responseModalities: ['IMAGE', 'TEXT'] },
};

const res = await fetch(URL_STR, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

if (!res.ok) {
  console.error(`ERROR ${res.status}: ${(await res.text()).slice(0, 300)}`);
  process.exit(1);
}

const data = await res.json();
const parts = data.candidates?.[0]?.content?.parts || [];
for (const p of parts) {
  if (p.inlineData) {
    const buf = Buffer.from(p.inlineData.data, 'base64');
    fs.writeFileSync('public/test-character.png', buf);
    console.log(`SAVED: test-character.png (${(buf.length / 1024).toFixed(1)} KB)`);
    process.exit(0);
  }
}
console.error('No image data in response');
console.log(JSON.stringify(data).slice(0, 500));
