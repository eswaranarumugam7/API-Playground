import { Header } from '../types/api';

interface HeaderEditorProps {
  headers: Header[];
  onChange: (headers: Header[]) => void;
}

const HeaderEditor = ({ headers, onChange }: HeaderEditorProps) => {
  const addHeader = () => {
    onChange([...headers, { key: '', value: '', enabled: true }]);
  };

  const updateHeader = (index: number, field: keyof Header, value: string | boolean) => {
    const updated = headers.map((header, i) => 
      i === index ? { ...header, [field]: value } : header
    );
    onChange(updated);
  };

  const removeHeader = (index: number) => {
    onChange(headers.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {headers.map((header, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={header.enabled}
            onChange={(e) => updateHeader(index, 'enabled', e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
          />
          <input
            type="text"
            value={header.key}
            onChange={(e) => updateHeader(index, 'key', e.target.value)}
            placeholder="Header name"
            className="input-field flex-1"
          />
          <input
            type="text"
            value={header.value}
            onChange={(e) => updateHeader(index, 'value', e.target.value)}
            placeholder="Header value"
            className="input-field flex-1"
          />
          <button
            onClick={() => removeHeader(index)}
            className="text-red-400 hover:text-red-300 p-1"
            title="Remove header"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
      
      <button
        onClick={addHeader}
        className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Header
      </button>
    </div>
  );
};

export default HeaderEditor;