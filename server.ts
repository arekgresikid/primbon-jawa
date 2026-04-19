import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import "dotenv/config";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Izinkan JSON Parsing
  app.use(express.json());

  // ========================================== //
  //  KERANGKA ENDPOINT API RAHASIA ANDA DI SINI //
  // ========================================== //
  app.post("/api/custom-service", async (req, res) => {
    try {
      // 1. Ambil API Key dari Sistem Environment
      const mySecretKey = process.env.POLLINATION_API_KEY;

      if (!mySecretKey) {
        return res.status(500).json({ 
          error: "Pollination API Key belum diatur dalam file .env." 
        });
      }

      // 2. Baca data permintaan dari frontend
      const { messages = [], systemInstruction, userMessage } = req.body;

      // Pastikan pesan terakhir dari user diproses tanpa duplikasi
      const finalMessages = [...messages];
      const lastMsg = finalMessages[finalMessages.length - 1];
      
      if (userMessage && (!lastMsg || lastMsg.content !== userMessage || lastMsg.role !== 'user')) {
        finalMessages.push({ role: "user", content: userMessage });
      }

      // 3. Panggil Pollinations AI (Endpoint Baru)
      console.log("DEBUG - AI messages history:", JSON.stringify(finalMessages));
      console.log("DEBUG - System instruction length:", systemInstruction?.length);

      const response = await fetch("https://gen.pollinations.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${mySecretKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          messages: [
            { role: "system", content: systemInstruction },
            ...finalMessages
          ],
          model: "openai",
          stream: false
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Pollinations API Error:", errorText);
        throw new Error(`Pollinations API error: ${errorText}`);
      }

      const result = await response.json();
      console.log("Respon diterima dari gen.pollinations");
      
      let reply = "";
      if (result.choices?.[0]?.message?.content) {
        reply = result.choices[0].message.content;
      } else if (typeof result === 'string') {
        reply = result;
      } else {
        reply = JSON.stringify(result);
      }

      res.json({ 
        message: "Berhasil!",
        reply: reply 
      });

    } catch (error: any) {
      console.error("Gagal terhubung ke Layanan Eksternal:", error);
      res.status(500).json({ error: error.message || "Terjadi kendala pada server." });
    }
  });


  // ========================================== //
  // Integrasi Vite (Jangan diubah)              //
  // ========================================== //
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server Backend Proxy berjalan di http://localhost:${PORT}`);
  });
}

startServer();
