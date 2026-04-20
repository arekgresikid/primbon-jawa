// Vercel Serverless Function
export default async function handler(req, res) {
  // Hanya izinkan POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const apiKey = process.env.POLLINATION_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Layanan Belum Dikonfigurasi: POLLINATION_API_KEY tidak ditemukan di Vercel Dashboard." });
    }

    const { messages = [], systemInstruction, userMessage } = req.body;

    // Pastikan pesan terakhir dari user diproses
    const finalMessages = [...messages];
    const lastMsg = finalMessages[finalMessages.length - 1];
    
    if (userMessage && (!lastMsg || lastMsg.content !== userMessage || lastMsg.role !== 'user')) {
      finalMessages.push({ role: "user", content: userMessage });
    }

    // Panggil Pollinations AI (Menggunakan Mistral sebagai fallback yang lebih lancar)
    const response = await fetch("https://gen.pollinations.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        messages: [
          { role: "system", content: systemInstruction },
          ...finalMessages
        ],
        model: "mistral", // Mistral lebih stabil untuk free-tier/low-credit
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      // Handle 402/401 specifically
      if (response.status === 402 || response.status === 401) {
         // Fallback ke Public API tanpa Key jika key gagal
         return await handleFreeFallback(finalMessages, systemInstruction, res);
      }
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    const reply = result.choices?.[0]?.message?.content || JSON.stringify(result);

    return res.status(200).json({ 
      message: "Berhasil!",
      reply: reply 
    });

  } catch (error) {
    console.error("Vercel API Error:", error);
    return res.status(500).json({ error: error.message || "Terjadi kendala pada serverless function." });
  }
}

// Jalur gratis jika Key Bermasalah
async function handleFreeFallback(messages, system, res) {
  try {
    const fullPrompt = `${system}\n\n${messages.map(m => `${m.role}: ${m.content}`).join('\n')}`;
    const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(fullPrompt)}?model=mistral`);
    
    if (!response.ok) throw new Error("Fallback API juga gagal.");
    
    const reply = await response.text();
    return res.status(200).json({ reply });
  } catch (e) {
    return res.status(500).json({ error: "Semua jalur API sedang sibuk. Mohon coba sesaat lagi." });
  }
}
