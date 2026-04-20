import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Hanya izinkan POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const mySecretKey = (process.env.POLLINATION_API_KEY || "").replace(/['"]+/g, '').trim();
    if (!mySecretKey) {
      return res.status(500).json({ error: "Layanan Belum Dikonfigurasi: POLLINATION_API_KEY tidak ditemukan di Vercel Dashboard." });
    }

    const { messages = [], systemInstruction, userMessage } = req.body;

    // Pastikan pesan terakhir dari user diproses
    const finalMessages = [...messages];
    const lastMsg = finalMessages[finalMessages.length - 1];
    
    if (userMessage && (!lastMsg || lastMsg.content !== userMessage || lastMsg.role !== 'user')) {
      finalMessages.push({ role: "user", content: userMessage });
    }

    // Gunakan model dari request, default ke mistral jika tidak diset (Mistral stabil untuk free-tier)
    const modelName = req.body.model || "openai";

    // Panggil Pollinations AI
    const response = await fetch("https://gen.pollinations.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${mySecretKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        messages: [{ role: "system", content: systemInstruction }, ...finalMessages],
        model: modelName,
        stream: false
      })
    });

    if (!response.ok) {
      // Fallback logic if specific model fails
      if (modelName !== "openai") {
        const fallbackResponse = await fetch("https://gen.pollinations.ai/v1/chat/completions", {
          method: "POST",
          headers: { "Authorization": `Bearer ${mySecretKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({ 
            messages: [{ role: "system", content: systemInstruction }, ...finalMessages],
            model: "openai",
            stream: false
          })
        });
        
        if (fallbackResponse.ok) {
          const fbResult = (await fallbackResponse.json()) as any;
          const reply = fbResult.choices?.[0]?.message?.content || "Sistem kembali stabil.";
          return res.status(200).json({ reply });
        }
      }
      
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    const result = (await response.json()) as any;
    const reply = result.choices?.[0]?.message?.content || "Sesepuh sedang merenung...";

    return res.status(200).json({ reply });

  } catch (error: any) {
    console.error("Vercel API Error:", error);
    return res.status(500).json({ error: error.message || "Terjadi kendala pada serverless function." });
  }
}
