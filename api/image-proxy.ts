import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const mySecretKey = (process.env.POLLINATION_API_KEY || "").replace(/['"]+/g, '').trim();
    const model = req.query.model ? String(req.query.model) : "zimage";
    const clientToken = req.query.access_token ? String(req.query.access_token) : "";
    const serverToken = (process.env.STUDIO_ACCESS_TOKEN || "").replace(/['"]+/g, '').trim();

    // 1. Security Check (Bypass untuk model zimage)
    if (model !== "zimage") {
      if (!serverToken) {
        return res.status(500).json({ error: "Server configuration (STUDIO_ACCESS_TOKEN) missing." });
      }

      if (clientToken.toUpperCase() !== serverToken.toUpperCase()) {
        return res.status(403).json({ error: "Unauthorized: Invalid access token for this model." });
      }
    }

    // 2. Extract parameters dengan sanitasi untuk stabilitas
    const prompt = req.query.prompt ? String(req.query.prompt) : "";
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const width = Math.min(Math.max(parseInt(String(req.query.width)) || 1024, 256), 2048);
    const height = Math.min(Math.max(parseInt(String(req.query.height)) || 1024, 256), 2048);
    
    // Membatasi seed ke rentang integer 32-bit (0 - 2,147,483,647)
    let rawSeed = parseInt(String(req.query.seed));
    let seed = !isNaN(rawSeed) ? rawSeed : Math.floor(Math.random() * 2147483647);
    if (seed > 2147483647) seed = seed % 2147483647;
    if (seed < 0) seed = Math.abs(seed);

    const enhance = req.query.enhance === 'false' ? 'false' : 'true';
    const safe = req.query.safe === 'false' ? 'false' : 'true';
    const quality = req.query.quality ? String(req.query.quality) : 'high';
    const transparent = req.query.transparent === 'true' ? 'true' : 'false';
    const nologo = req.query.nologo === 'false' ? 'false' : 'true';
    const negative_prompt = req.query.negative_prompt ? String(req.query.negative_prompt) : '';
    const image = req.query.image ? String(req.query.image) : '';
    
    // Video specific
    const duration = req.query.duration ? String(req.query.duration) : '';
    const audio = req.query.audio === 'true' ? 'true' : 'false';
    const videoAspectRatio = req.query.videoAspectRatio ? String(req.query.videoAspectRatio) : '';

    // 3. Construct URL
    const encodedPrompt = encodeURIComponent(prompt.trim());
    let url = `https://gen.pollinations.ai/image/${encodedPrompt}?model=${model}&width=${width}&height=${height}&seed=${seed}&enhance=${enhance}&safe=${safe}&quality=${quality}&transparent=${transparent}`;
    
    if (negative_prompt) url += `&negative_prompt=${encodeURIComponent(negative_prompt)}`;
    if (image) url += `&image=${encodeURIComponent(image)}`;
    if (nologo === 'true') url += `&nologo=true`;
    if (duration) url += `&duration=${duration}`;
    if (audio === 'true') url += `&audio=true`;
    if (videoAspectRatio) url += `&aspectRatio=${videoAspectRatio}`;
    
    if (mySecretKey && mySecretKey.length > 5) {
      url += `&key=${mySecretKey}`;
    }

    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).send(`AI Error: ${errorText}`);
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const buffer = await response.arrayBuffer();
    
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=31536000");
    return res.send(Buffer.from(buffer));

  } catch (error: any) {
    console.error("Media Proxy Error:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}
