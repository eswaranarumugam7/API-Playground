import { useState } from 'react';
import RequestBuilder from './components/RequestBuilder';
import ResponseViewer from './components/ResponseViewer';
import { ApiRequest, ApiResponse, ApiError } from './types/api';
import { sendApiRequest } from './utils/api';

function App() {
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSendRequest = async (request: ApiRequest) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await sendApiRequest(request);
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">API Response Playground</h1>
          <p className="text-gray-400">Test and explore APIs with a clean, developer-friendly interface</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <RequestBuilder onSendRequest={handleSendRequest} loading={loading} />
          </div>

          <div className="space-y-6">
            <ResponseViewer response={response} error={error} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;