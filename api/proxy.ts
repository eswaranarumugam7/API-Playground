// Serverless function for Vercel/Netlify
// This handles CORS and forwards requests to external APIs

interface RequestBody {
  url: string;
  method: string;
  headers: Array<{ key: string; value: string; enabled: boolean }>;
  body?: string;
}

interface ResponseData {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  responseTime: number;
}

interface ErrorResponse {
  message: string;
  type: 'network' | 'timeout' | 'validation' | 'server';
}

// Block localhost and private IP ranges for security
const isPrivateIP = (hostname: string): boolean => {
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

const validateRequest = (body: RequestBody): string | null => {
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

export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    const error: ErrorResponse = {
      message: 'Method not allowed',
      type: 'validation'
    };
    res.status(405).json(error);
    return;
  }

  try {
    const body: RequestBody = req.body;
    
    // Validate request
    const validationError = validateRequest(body);
    if (validationError) {
      const error: ErrorResponse = {
        message: validationError,
        type: 'validation'
      };
      res.status(400).json(error);
      return;
    }

    // Prepare headers
    const requestHeaders: Record<string, string> = {};
    body.headers?.forEach(header => {
      if (header.enabled && header.key && header.value) {
        requestHeaders[header.key] = header.value;
      }
    });

    // Add User-Agent if not provided
    if (!requestHeaders['User-Agent']) {
      requestHeaders['User-Agent'] = 'API-Response-Playground/1.0';
    }

    const startTime = Date.now();

    // Make the request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
      const response = await fetch(body.url, {
        method: body.method,
        headers: requestHeaders,
        body: body.method !== 'GET' ? body.body : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const responseTime = Date.now() - startTime;
      
      // Get response headers
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      // Get response body with size limit (1MB)
      const responseText = await response.text();
      if (responseText.length > 1024 * 1024) {
        const error: ErrorResponse = {
          message: 'Response too large (max 1MB)',
          type: 'server'
        };
        res.status(413).json(error);
        return;
      }

      const responseData: ResponseData = {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        body: responseText,
        responseTime,
      };

      res.status(200).json(responseData);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        const error: ErrorResponse = {
          message: 'Request timeout (30 seconds)',
          type: 'timeout'
        };
        res.status(408).json(error);
      } else {
        const error: ErrorResponse = {
          message: `Network error: ${fetchError.message}`,
          type: 'network'
        };
        res.status(502).json(error);
      }
    }
  } catch (error: any) {
    const errorResponse: ErrorResponse = {
      message: `Server error: ${error.message}`,
      type: 'server'
    };
    res.status(500).json(errorResponse);
  }
}