const fs = require('fs');
const path = require('path');

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

function generateExcerpt(content) {
  return content.split('\n')[0].substring(0, 160) + '...';
}

async function generateStory() {
  const apiKey = process.env.POLLINATION_API_KEY;
  if (!apiKey) {
    console.error('Error: POLLINATION_API_KEY is not set');
    process.exit(1);
  }

  const systemInstruction = `Anda adalah "Ki Juru Cerita", seorang pujangga ahli mistis Jawa. 
  Tugas Anda adalah menulis cerita mistis yang sangat detil, mendalam, dan epik (panjang sekitar 1000-1200 kata).
  
  Format output Anda HARUS mengikuti struktur ini:
  JUDUL: [Judul Cerita]
  KONTEN: [Isi Cerita dalam format Markdown...]
  
  Ketentuan Konten:
  - Gunakan bahasa Indonesia puitis dan mencekam.
  - Gunakan **teks tebal** untuk penekanan.
  - Gunakan *teks miring* untuk istilah Jawa/bisikan.
  - Paragraf harus jelas (pisahkan dengan dua baris baru).`;

  const userMessage = "Tuliskan hikayat mistis panjang yang luar biasa tentang pelanggaran weton Kramat.";

  try {
    const response = await fetch("https://gen.pollinations.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: userMessage }
        ],
        model: "openai",
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    const reply = result.choices[0].message.content;
    
    // Improved parsing for non-JSON response
    const titleMatch = reply.match(/JUDUL:\s*(.*)/i);
    const contentMatch = reply.match(/KONTEN:\s*([\s\S]*)/i);
    
    if (!titleMatch || !contentMatch) {
      throw new Error("Could not parse AI response structure. Raw reply: " + reply.substring(0, 100));
    }
    
    const title = titleMatch[1].trim().replace(/[*#]/g, '');
    const content = contentMatch[1].trim();
    const slug = slugify(title);
    const date = new Date().toISOString().split('T')[0];
    const excerpt = generateExcerpt(content);

    const mdContent = `---
title: "${title}"
date: "${date}"
slug: "${slug}"
excerpt: "${excerpt}"
thumbnail: "/images/default-story.png"
---

${content}`;

    const dirPath = path.join(__dirname, '../src/content/stories');
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

    const filePath = path.join(dirPath, `${slug}.md`);
    fs.writeFileSync(filePath, mdContent);
    
    console.log(`Markdown story generated: ${filePath}`);

  } catch (error) {
    console.error('Failed to generate story:', error.message);
    process.exit(1);
  }
}

generateStory();
