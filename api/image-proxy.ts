import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const mySecretKey = (process.env.POLLINATION_API_KEY || "").replace(/['"]+/g, '').trim();
    const clientToken = req.query.access_token ? String(req.query.access_token) : "";
    const serverToken = (process.env.STUDIO_ACCESS_TOKEN || "SESEPUH_AI").replace(/['"]+/g, '').trim();

    // 1. Security Check
    if (clientToken !== serverToken) {
      return res.status(403).json({ error: "Unauthorized: Invalid access token." });
    }

    // 2. Extract parameters
    const prompt = req.query.prompt ? String(req.query.prompt) : "";
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const model = req.query.model ? String(req.query.model) : "flux";
    const width = req.query.width ? parseInt(String(req.query.width)) : 1024;
    const height = req.query.height ? parseInt(String(req.query.height)) : 1024;
    const seed = req.query.seed ? parseInt(String(req.query.seed)) : Math.floor(Math.random() * 2147483647);
    const enhance = req.query.enhance === 'false' ? 'false' : 'true';
    const safe = req.query.safe === 'false' ? 'false' : 'true';
    const quality = req.query.quality ? String(req.query.quality) : 'high';
    const transparent = req.query.transparent === 'true' ? 'true' : 'false';
    const nologo = req.query.nologo === 'true' ? 'true' : 'false';
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
