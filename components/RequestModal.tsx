'use client';

import { Request } from '@/types/request';
import { useEffect } from 'react';

interface RequestModalProps {
  request: Request | null;
  onClose: () => void;
}

export default function RequestModal({ request, onClose }: RequestModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!request) return null;

  const formatJson = (str: string): string => {
    try {
      return JSON.stringify(JSON.parse(str), null, 2);
    } catch {
      return str;
    }
  };

  const formatHeaders = (headers: Record<string, string | string[]>): string => {
    return Object.entries(headers)
      .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
      .join('\n');
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 rounded-md font-medium text-blue-600 bg-blue-50">
              {request.method}
            </span>
            <span className="font-mono text-gray-900">{request.path}</span>
            <span className="px-3 py-1 rounded-md font-medium text-green-600 bg-green-50">
              {request.statusCode}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Duration:</span>
              <span className="ml-2 font-medium">{request.durationMs}ms</span>
            </div>
            <div>
              <span className="text-gray-500">Timestamp:</span>
              <span className="ml-2 font-medium">
                {new Date(request.timestamp).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Session ID:</span>
              <span className="ml-2 font-mono text-xs">{request.sessionId}</span>
            </div>
            {request.error && (
              <div className="col-span-2">
                <span className="text-red-500">Error:</span>
                <span className="ml-2 font-medium text-red-600">{request.error}</span>
              </div>
            )}
          </div>

          {/* Request Headers */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Request Headers</h3>
            <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm font-mono">
              {formatHeaders(request.requestHeaders)}
            </pre>
          </div>

          {/* Request Body */}
          {request.requestBody && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Request Body</h3>
              <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                {formatJson(request.requestBody)}
              </pre>
            </div>
          )}

          {/* Response Headers */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Response Headers</h3>
            <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm font-mono">
              {formatHeaders(request.responseHeaders)}
            </pre>
          </div>

          {/* Response Body */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Response Body</h3>
            <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm font-mono max-h-96">
              {formatJson(request.responseBody)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
