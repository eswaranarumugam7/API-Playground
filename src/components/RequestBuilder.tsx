import { useState } from 'react';
import { HttpMethod, Header, ApiRequest } from '../types/api';
import { isValidUrl, isValidJson } from '../utils/api';
import HeaderEditor from './HeaderEditor';

interface RequestBuilderProps {
  onSendRequest: (request: ApiRequest) => void;
  loading: boolean;
}

const RequestBuilder = ({ onSendRequest, loading }: RequestBuilderProps) => {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState<HttpMethod>('GET');
  const [headers, setHeaders] = useState<Header[]>([
    { key: 'Content-Type', value: 'application/json', enabled: true }
  ]);
  const [body, setBody] = useState('{\n  "title": "Test Post",\n  "body": "This is a test",\n  "userId": 1\n}');
  const [urlError, setUrlError] = useState('');
  const [bodyError, setBodyError] = useState('');

  const validateAndSend = () => {
    setUrlError('');
    setBodyError('');

    if (!url.trim()) {
      setUrlError('URL is required');
      return;
    }

    if (!isValidUrl(url)) {
      setUrlError('Please enter a valid HTTP/HTTPS URL');
      return;
    }

    if (method !== 'GET' && body.trim() && !isValidJson(body)) {
      setBodyError('Request body must be valid JSON');
      return;
    }

    const enabledHeaders = headers.filter(h => h.enabled && h.key.trim() && h.value.trim());

    const request: ApiRequest = {
      url: url.trim(),
      method,
      headers: enabledHeaders,
      body: method !== 'GET' && body.trim() ? body : undefined,
    };

    onSendRequest(request);
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-semibold mb-6 text-white">Request Builder</h2>

      <div className="space-y-4">
        {/* URL and Method */}
        <div className="flex gap-3">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as HttpMethod)}
            className="select-field w-24"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>

          <div className="flex-1">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter API URL..."
              className={`input-field w-full ${urlError ? 'border-red-500' : ''}`}
            />
            {urlError && <p className="text-red-400 text-sm mt-1">{urlError}</p>}
          </div>
        </div>

        {/* Headers */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Headers</label>
          <HeaderEditor headers={headers} onChange={setHeaders} />
        </div>

        {/* Request Body */}
        {method !== 'GET' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Request Body</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Enter JSON request body..."
              rows={8}
              className={`input-field w-full font-mono text-sm ${bodyError ? 'border-red-500' : ''}`}
            />
            {bodyError && <p className="text-red-400 text-sm mt-1">{bodyError}</p>}
          </div>
        )}

        {/* Send Button */}
        <button
          onClick={validateAndSend}
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Sending...
            </>
          ) : (
            'Send Request'
          )}
        </button>
      </div>
    </div>
  );
};

export default RequestBuilder;