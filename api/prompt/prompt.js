// api/prompt.js
// Vercel Serverless Function for prompt management

const SUNA_SERVER = process.env.SUNA_SERVER_URL || 'http://43.160.250.225:8000';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      // Get prompt
      const response = await fetch(`${SUNA_SERVER}/api/prompt/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Suna server responded with ${response.status}`);
      }

      const promptContent = await response.text();
      
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.status(200).send(promptContent);

    } else if (req.method === 'POST') {
      // Update prompt
      const response = await fetch(`${SUNA_SERVER}/api/prompt/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });

      if (!response.ok) {
        throw new Error(`Suna server responded with ${response.status}`);
      }

      const result = await response.json();
      res.status(200).json(result);

    } else {
      res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Error proxying to Suna server:', error);
    res.status(502).json({ 
      error: `Error connecting to Suna server: ${error.message}` 
    });
  }
}