import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

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
      // Server-side: Kunci aman dan TIDAK BISA diakses oleh Browser Client!
      const mySecretKey = process.env.pollination_api_key;

      if (!mySecretKey) {
        return res.status(500).json({ 
          error: "Pollination API Key belum diatur di menu Settings." 
        });
      }

      // 2. Baca data permintaan dari frontend
      const { userMessage } = req.body;

      // 3. Panggil Server Pihak Ketiga menggunakan Key Rahasia Anda
      /* 
      const response = await fetch("https://api.layanan-eksternal.com/v1/data", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${mySecretKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query: userMessage })
      });
      const data = await response.json();
      */

      // Simulasi balasan sukses:
      res.json({ 
        message: "Berhasil! Endpoint ini telah terhubung dengan infrastruktur API aman.",
        receivedMessage: userMessage 
      });

    } catch (error) {
      console.error("Gagal terhubung ke Layanan Eksternal:", error);
      res.status(500).json({ error: "Terjadi kendala pada server." });
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
