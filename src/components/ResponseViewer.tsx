import { ApiResponse } from '../types/api';
import { getStatusColor, formatJson, isValidJson } from '../utils/api';

interface ResponseViewerProps {
  response: ApiResponse | null;
  error: string | null;
  loading: boolean;
}

const ResponseViewer = ({ response, error, loading }: ResponseViewerProps) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Sending request...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-white">Response</h2>
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-400 font-medium">Error</span>
          </div>
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-white">Response</h2>
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-gray-400">Send a request to see the response</p>
        </div>
      </div>
    );
  }

  const isJsonResponse = isValidJson(response.body);
  const formattedBody = isJsonResponse ? formatJson(response.body) : response.body;

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Response</h2>
        <button
          onClick={() => copyToClipboard(response.body)}
          className="btn-secondary text-sm"
        >
          Copy Response
        </button>
      </div>

      {/* Status and Timing */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded text-white text-sm font-medium ${getStatusColor(response.status)}`}>
            {response.status}
          </span>
          <span className="text-gray-300">{response.statusText}</span>
        </div>
        <div className="text-gray-400 text-sm">
          {response.responseTime}ms
        </div>
      </div>

      {/* Headers */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-white mb-3">Headers</h3>
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          {Object.entries(response.headers).map(([key, value]) => (
            <div key={key} className="flex border-b border-gray-700 last:border-b-0">
              <div className="px-4 py-2 bg-gray-750 text-gray-300 font-medium w-1/3 border-r border-gray-700">
                {key}
              </div>
              <div className="px-4 py-2 text-gray-100 flex-1 font-mono text-sm">
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Response Body */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-white">Response Body</h3>
          {isJsonResponse && (
            <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded">
              JSON
            </span>
          )}
        </div>
        <div className="bg-gray-800 rounded-lg p-4 overflow-auto max-h-96">
          <pre className="text-sm text-gray-100 font-mono whitespace-pre-wrap">
            {formattedBody}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ResponseViewer;