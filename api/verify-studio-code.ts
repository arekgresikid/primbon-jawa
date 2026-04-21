import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers just in case
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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const code = req.body?.code;
    const serverToken = (process.env.STUDIO_ACCESS_TOKEN || "").replace(/['"]+/g, '').trim();

    if (!serverToken) {
      return res.status(500).json({ success: false, error: "Server configuration missing." });
    }

    if (!code) {
      return res.status(400).json({ success: false, error: "Code is required." });
    }

    const cleanCode = String(code).replace(/['"]+/g, '').trim().toUpperCase();
    const cleanServerToken = serverToken.toUpperCase();

    if (cleanCode === cleanServerToken) {
      return res.status(200).json({ 
        success: true, 
        token: serverToken 
      });
    }

    return res.status(401).json({ 
      success: false, 
      error: "Invalid access code." 
    });

  } catch (error: any) {
    console.error("Verification Error:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
