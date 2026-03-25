import fs from 'fs';

const API_KEY = process.env.GEMINI_API_KEY;
const URL_STR = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${API_KEY}`;

const BASE_DESC = 'A beautiful young Korean woman 3D character in Apple Memoji style. She has medium-length layered dark brown hair (shoulder length), Korean beauty features: slim oval face, soft double eyelids, big bright brown eyes, small delicate nose, natural pink lips, fair smooth skin with soft rosy cheeks. High quality Apple Memoji / iPhone Memoji style 3D character art. Clean smooth 3D render with soft studio lighting. Pure white background, no shadows, isolated character.';

const IMAGES = [
  {
    filename: 'mascot-banner-wave.png',
    prompt: `${BASE_DESC} Upper body portrait (bust to waist). She is wearing a stylish modern black blazer with white inner top. Right hand raised in a friendly welcoming wave gesture. Warm inviting smile, looking directly at viewer. Slight 15-degree angle turn. Professional yet approachable.`,
  },
  {
    filename: 'mascot-gift-thumbsup.png',
    prompt: `${BASE_DESC} Close-up upper body. She is giving a cheerful thumbs up with her right hand. Bright energetic expression, eyes sparkling. Wearing a clean white casual top. Enthusiastic and positive vibe.`,
  },
  {
    filename: 'mascot-thinking.png',
    prompt: `${BASE_DESC} Upper body portrait. She has her chin resting lightly on one hand in a thoughtful thinking pose. Slight head tilt, eyebrows slightly raised, gentle curious smile. Wearing a cozy dark navy sweater. Contemplative and approachable look.`,
  },
  {
    filename: 'mascot-pointing.png',
    prompt: `${BASE_DESC} Upper body portrait. She is pointing forward with her right index finger in a friendly guiding gesture. Confident warm smile. Wearing a clean light blue blouse. Energetic helpful pose, as if showing direction.`,
  },
  {
    filename: 'mascot-professional-stand.png',
    prompt: `${BASE_DESC} Upper body portrait. She stands with hands clasped together in front, professional confident posture. Slight head tilt, warm reassuring smile. Wearing a neat gray blazer over white top. Professional consultant look.`,
  },
  {
    filename: 'mascot-listening.png',
    prompt: `${BASE_DESC} Upper body portrait. She has both hands gently brought together near chest in a warm listening pose. Gentle empathetic smile, attentive eyes. Wearing soft cream colored knit top. Warm caring expression, as if saying "tell me more".`,
  },
  {
    filename: 'mascot-celebrate.png',
    prompt: `${BASE_DESC} Upper body portrait. She is celebrating with both hands raised in joy, making a cheerful clapping or victory pose. Big bright smile with eyes curved into happy crescents. Wearing a festive white top with subtle sparkle. Pure joy and celebration mood.`,
  },
  {
    filename: 'mascot-guide-list.png',
    prompt: `${BASE_DESC} Small bust portrait. She is looking slightly to the side and pointing downward with one finger, as if guiding to look below. Cute helpful expression. Wearing a simple white top. Compact icon-like composition.`,
  },
];

async function generateImage(img) {
  console.log(`Generating: ${img.filename}...`);
  const body = {
    contents: [{ parts: [{ text: `Generate an image: ${img.prompt}` }] }],
    generationConfig: { responseModalities: ['IMAGE', 'TEXT'] },
  };

  try {
    const res = await fetch(URL_STR, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.error(`  ERROR ${res.status}: ${(await res.text()).slice(0, 150)}`);
      return false;
    }

    const data = await res.json();
    for (const p of (data.candidates?.[0]?.content?.parts || [])) {
      if (p.inlineData) {
        const buf = Buffer.from(p.inlineData.data, 'base64');
        fs.writeFileSync(`public/${img.filename}`, buf);
        console.log(`  SAVED: ${img.filename} (${(buf.length / 1024).toFixed(1)} KB)`);
        return true;
      }
    }
    console.error(`  No image data for ${img.filename}`);
    return false;
  } catch (e) {
    console.error(`  ERROR: ${e.message}`);
    return false;
  }
}

async function main() {
  console.log('=== Mascot Generator (Gemini 3.1 Flash Image) ===\n');
  let ok = 0, fail = 0;
  for (const img of IMAGES) {
    const success = await generateImage(img);
    if (success) ok++; else fail++;
    await new Promise(r => setTimeout(r, 3000));
  }
  console.log(`\n=== Done: ${ok} success, ${fail} failed ===`);
}

main();
