import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { code } = req.body;
    const serverToken = (process.env.STUDIO_ACCESS_TOKEN || "SESEPUH_AI").replace(/['"]+/g, '').trim();

    if (code && code.toUpperCase() === serverToken.toUpperCase()) {
      return res.status(200).json({ 
        success: true, 
        token: serverToken 
      });
    }

    return res.status(401).json({ 
      success: false, 
      error: "Invalid code" 
    });

  } catch (error: any) {
    console.error("Verification Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
