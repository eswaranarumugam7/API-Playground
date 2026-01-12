// Development server for local API proxy testing
// Run with: npm run dev:api

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Inline proxy logic for development
const isPrivateIP = (hostname) => {
  const privateRanges = [
    /^localhost$/i,
    /^127\./,
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^192\.168\./,
    /^::1$/,
    /^fc00:/,
    /^fe80:/
  ];
  
  return privateRanges.some(range => range.test(hostname));
  
  // For local development, comment out the above and return false
  // return false;
};

const validateRequest = (body) => {
  if (!body.url || typeof body.url !== 'string') {
    return 'URL is required and must be a string';
  }

  try {
    const url = new URL(body.url);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return 'Only HTTP and HTTPS protocols are allowed';
    }
    
    if (isPrivateIP(url.hostname)) {
      return 'Requests to private/local addresses are not allowed';
    }
  } catch {
    return 'Invalid URL format';
  }

  if (!['GET', 'POST', 'PUT', 'DELETE'].includes(body.method)) {
    return 'Invalid HTTP method';
  }

  return null;
};

app.post('/api/proxy', async (req, res) => {
  try {
    const body = req.body;
    
    const validationError = validateRequest(body);
    if (validationError) {
      return res.status(400).json({
        message: validationError,
        type: 'validation'
      });
    }

    const requestHeaders = {};
    body.headers?.forEach(header => {
      if (header.enabled && header.key && header.value) {
        requestHeaders[header.key] = header.value;
      }
    });

    if (!requestHeaders['User-Agent']) {
      requestHeaders['User-Agent'] = 'API-Response-Playground/1.0';
    }

    const startTime = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(body.url, {
        method: body.method,
        headers: requestHeaders,
        body: body.method !== 'GET' ? body.body : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;
      
      const responseHeaders = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      const responseText = await response.text();
      if (responseText.length > 1024 * 1024) {
        return res.status(413).json({
          message: 'Response too large (max 1MB)',
          type: 'server'
        });
      }

      res.json({
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        body: responseText,
        responseTime,
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        res.status(408).json({
          message: 'Request timeout (30 seconds)',
          type: 'timeout'
        });
      } else {
        res.status(502).json({
          message: `Network error: ${fetchError.message}`,
          type: 'network'
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      message: `Server error: ${error.message}`,
      type: 'server'
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Development API server running on http://localhost:${PORT}`);
  console.log('📡 Proxy endpoint: http://localhost:3001/api/proxy');
});