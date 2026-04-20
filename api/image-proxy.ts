import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const mySecretKey = (process.env.POLLINATION_API_KEY || "").replace(/['"]+/g, '').trim();
    
    // Extract and sanitize parameters
    const prompt = req.query.prompt ? String(req.query.prompt) : "";
    
    // Pollinations AI seed limit (32-bit signed integer)
    const rawSeed = req.query.seed ? parseInt(String(req.query.seed)) : Math.floor(Math.random() * 1000000);
    const seed = rawSeed % 2147483647; 
    
    const model = req.query.model ? String(req.query.model) : "zimage";
    const width = req.query.width ? parseInt(String(req.query.width)) : 1280;
    const height = req.query.height ? parseInt(String(req.query.height)) : 720;
    const enhance = req.query.enhance === 'false' ? 'false' : 'true';
    const safe = req.query.safe === 'false' ? 'false' : 'true';

    const encodedPrompt = encodeURIComponent(prompt.trim());
    
    // Construct the Pollinations API URL
    let url = `https://gen.pollinations.ai/image/${encodedPrompt}?model=${model}&width=${width}&height=${height}&seed=${seed}&enhance=${enhance}&safe=${safe}`;
    
    if (mySecretKey && mySecretKey.length > 5) {
      url += `&key=${mySecretKey}`;
    }

    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).send(`Pollinations API Error: ${errorText}`);
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const buffer = await response.arrayBuffer();
    
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=31536000"); // Cache permanently using unique seed
    return res.send(Buffer.from(buffer));

  } catch (error: any) {
    console.error("Image Proxy Error:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}
