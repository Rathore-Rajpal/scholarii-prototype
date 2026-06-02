import { webcrypto } from 'node:crypto';
globalThis.crypto = webcrypto;

const serverModule = await import('../dist/server/index.js');
const handler = serverModule.default;

export default async function vercelHandler(req, res) {
  try {
    // Convert Node.js request to Fetch API request
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    const method = req.method || 'GET';
    const headers = new Headers(req.headers);
    
    let body = null;
    if (method !== 'GET' && method !== 'HEAD') {
      body = req;
    }
    
    const fetchRequest = new Request(url, {
      method,
      headers,
      body,
    });
    
    // Call the TanStack Start handler
    const response = await handler.fetch(fetchRequest, {}, {});
    
    // Set response status and headers
    res.status(response.status);
    for (const [key, value] of response.headers) {
      res.setHeader(key, value);
    }
    
    // Send response body
    const text = await response.text();
    res.send(text);
  } catch (error) {
    console.error('SSR Error:', error);
    res.status(500).send(`<pre>${error.stack || error.message}</pre>`);
  }
}
