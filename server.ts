import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import "dotenv/config";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Izinkan JSON Parsing
  app.use(express.json());

  // Security Headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com"],
        "img-src": ["'self'", "data:", "https://gen.pollinations.ai", "https://pollinations.ai", "https://www.googletagmanager.com"],
        "connect-src": [
          "'self'", 
          "https://gen.pollinations.ai", 
          "https://www.google-analytics.com", 
          "https://region1.google-analytics.com",
          "ws://localhost:*", 
          "wss://localhost:*"
        ],
      },
    },
  }));

  // Blokir akses ke file .log untuk keamanan
  app.use((req, res, next) => {
    if (req.path.endsWith('.log')) {
      return res.status(403).json({ error: "Access Denied" });
    }
    next();
  });

  // Rate Limiter untuk API AI
  const aiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 50, // limit 50 request per IP per jendela waktu
    message: { error: "Terlalu banyak permintaan. Silakan coba lagi nanti." },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Helper untuk log ke file agar AI bisa baca jika terminal sulit diakses
  const logToFile = (msg: string) => {
    try {
      const logsDir = path.join(process.cwd(), "logs");
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
      }
      const logPath = path.join(logsDir, "server.log");
      const timestamp = new Date().toISOString();
      
      // Masking ketat: Semuanya setelah sk_ disembunyikan
      let maskedMsg = msg.replace(/sk_[a-zA-Z0-9]+/g, "sk_***HIDDEN***");
      
      // Jika pesan mengandung prompt/percakapan, batasi panjangnya untuk privasi
      if (maskedMsg.includes("Prompt:") || maskedMsg.includes("userMessage:")) {
         maskedMsg = maskedMsg.substring(0, 150) + "... [REDACTED FOR PRIVACY]";
      }

      fs.appendFileSync(logPath, `[${timestamp}] ${maskedMsg}\n`);
    } catch (e) {
      console.error("Gagal menulis log ke file:", e);
    }
  };

  // ========================================== //
  //  ENDPOINT API UNTUK PROXY GAMBAR           //
  // ========================================== //
  app.get("/api/image-proxy", aiRateLimiter, async (req, res) => {
    try {
      // Ambil parameter dan pastikan tipe datanya benar
      let prompt = req.query.prompt ? String(req.query.prompt) : "";
      // Pollinations AI membatasi seed maksimal 2147483647 (32-bit signed integer)
      let seedQuery = req.query.seed ? parseInt(String(req.query.seed)) : Math.floor(Math.random() * 1000000);
      let seed = seedQuery % 2147483647; 
      let model = req.query.model ? String(req.query.model) : "zimage";

      // Ambil key dan bersihkan dari tanda kutip jika ada
      let mySecretKey = (process.env.POLLINATION_API_KEY || "").replace(/['"]+/g, '').trim();

      if (!prompt) {
        logToFile("Error: Prompt kosong.");
        return res.status(400).json({ error: "Prompt is required" });
      }

      logToFile(`Processing image - Prompt: "${prompt.substring(0, 50)}..." | Model: ${model} | Seed: ${seed}`);

      // Gunakan URL gen.pollinations.ai sesuai dokumentasi
      // Prompt di-encode di sini
      const encodedPrompt = encodeURIComponent(prompt.trim());
      
      // Upgrade ke High Quality (HD Landscape 1280x720) dan Aktifkan Enhance
      const width = 1280;
      const height = 720;
      let url = `https://gen.pollinations.ai/image/${encodedPrompt}?model=${model}&width=${width}&height=${height}&seed=${seed}&enhance=true&safe=true&quality=high`;
      
      // Tambahkan key jika tersedia
      if (mySecretKey && mySecretKey.length > 5) {
        url += `&key=${mySecretKey}`;
        logToFile("Using API Key in query parameter.");
      } else {
        logToFile("Warning: No API Key found, using public access.");
      }

      logToFile(`Final Fetch URL: ${url.replace(mySecretKey, '***')}`);

      const response = await fetch(url);

      if (!response.ok) {
        logToFile(`Pollinations API Error (Image) (${response.status})`);
        return res.status(response.status).json({ error: "Gagal mengambil gambar dari AI." });
      }

      const contentType = response.headers.get("content-type") || "image/jpeg";
      const buffer = await response.arrayBuffer();
      const imageBuffer = Buffer.from(buffer);

      if (imageBuffer.length === 0) {
        throw new Error("Received empty image buffer from AI service.");
      }

      res.setHeader("Content-Type", contentType);
      res.setHeader("Cache-Control", "public, max-age=31536000");
      res.send(imageBuffer);
      
      logToFile(`Successfully sent image (${contentType}) of size: ${imageBuffer.length} bytes.`);

    } catch (error: any) {
      logToFile(`CRITICAL SERVER ERROR (Proxy): ${error.message}`);
      res.status(500).json({ error: "Terjadi kesalahan internal pada server proxy." });
    }
  });

  app.post("/api/custom-service", aiRateLimiter, async (req, res) => {
    try {
      const mySecretKey = (process.env.POLLINATION_API_KEY || "").replace(/['"]+/g, '').trim();

      if (!mySecretKey) {
        return res.status(500).json({ error: "Pollination API Key belum diatur." });
      }

      const { messages = [], systemInstruction, userMessage } = req.body;
      const finalMessages = [...messages];
      const lastMsg = finalMessages[finalMessages.length - 1];
      
      if (userMessage && (!lastMsg || lastMsg.content !== userMessage || lastMsg.role !== 'user')) {
        finalMessages.push({ role: "user", content: userMessage });
      }

      // Gunakan model yang dipilih user, default ke openai jika grok gagal atau tidak diset
      const modelName = req.body.model || "openai";
      logToFile(`Chat Completion request with model: ${modelName}`);

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
        const errorText = await response.text();
        logToFile(`Pollinations Chat Error (${response.status}): ${errorText}`);
        // Jika model tertentu (seperti grok) gagal, coba fallback ke openai
        if (modelName !== "openai") {
           logToFile("Retrying chat with fallback model: openai");
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
              const fbResult = await fallbackResponse.json();
              return res.json({ reply: fbResult.choices?.[0]?.message?.content || "Sistem kembali stabil." });
           }
        }
        throw new Error(`Pollinations API error: ${errorText}`);
      }

      const result = await response.json();
      const reply = result.choices?.[0]?.message?.content || result.reply || "Sesepuh sedang merenung...";

      res.json({ reply });
    } catch (error: any) {
      logToFile(`Chat Error: ${error.message}`);
      res.status(500).json({ error: "Terjadi gangguan pada layanan konsultasi." });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server Backend Proxy berjalan di http://localhost:${PORT}`);
  });
}

startServer();
