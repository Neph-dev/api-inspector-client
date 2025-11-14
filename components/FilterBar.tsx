'use client';

interface FilterBarProps {
  methodFilter: string;
  pathSearch: string;
  onMethodChange: (method: string) => void;
  onPathChange: (path: string) => void;
  onClear: () => void;
}

export default function FilterBar({
  methodFilter,
  pathSearch,
  onMethodChange,
  onPathChange,
  onClear,
}: FilterBarProps) {
  const methods = ['ALL', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'];

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex gap-4 items-center">
        {/* Method Filter Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="method-filter" className="text-sm font-medium text-gray-700">
            Method:
          </label>
          <select
            id="method-filter"
            value={methodFilter}
            onChange={(e) => onMethodChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
          >
            {methods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>

        {/* Path Search Box */}
        <div className="flex items-center gap-2 flex-1">
          <label htmlFor="path-search" className="text-sm font-medium text-gray-700">
            Path:
          </label>
          <input
            id="path-search"
            type="text"
            value={pathSearch}
            onChange={(e) => onPathChange(e.target.value)}
            placeholder="Search path..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Clear Button */}
        <button
          onClick={onClear}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
