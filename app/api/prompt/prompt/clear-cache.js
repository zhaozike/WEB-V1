// api/prompt/clear-cache.js
// Clear prompt cache

const SUNA_SERVER = process.env.SUNA_SERVER_URL || 'http://43.160.250.225:8000';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const response = await fetch(`${SUNA_SERVER}/api/prompt/clear-cache`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Suna server responded with ${response.status}`);
    }

    const result = await response.json();
    res.status(200).json(result);

  } catch (error) {
    console.error('Error clearing cache on Suna server:', error);
    res.status(502).json({ 
      error: `Error connecting to Suna server: ${error.message}` 
    });
  }
}
