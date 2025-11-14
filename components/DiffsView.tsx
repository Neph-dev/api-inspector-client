'use client';

import { useState } from 'react';
import { EndpointDiff } from '@/types/request';
import ShapeComparison from './ShapeComparison';

interface DiffsViewProps {
  diffs: EndpointDiff[];
}

export default function DiffsView({ diffs }: DiffsViewProps) {
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointDiff | null>(null);

  const getTotalIssues = (diff: EndpointDiff) => {
    return (
      diff.inconsistencies.missingFields.length +
      diff.inconsistencies.typeChanges.length +
      diff.inconsistencies.extraFields.length
    );
  };

  const getMethodColor = (method: string) => {
    const colors: { [key: string]: string; } = {
      GET: 'bg-blue-100 text-blue-800',
      POST: 'bg-green-100 text-green-800',
      PUT: 'bg-yellow-100 text-yellow-800',
      PATCH: 'bg-purple-100 text-purple-800',
      DELETE: 'bg-red-100 text-red-800',
      OPTIONS: 'bg-gray-100 text-gray-800',
      HEAD: 'bg-gray-100 text-gray-800',
    };
    return colors[method] || 'bg-gray-100 text-gray-800';
  };

  if (selectedEndpoint) {
    return (
      <div className="space-y-4">
        {/* Back Button */}
        <button
          onClick={() => setSelectedEndpoint(null)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to all diffs
        </button>

        {/* Endpoint Header */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getMethodColor(selectedEndpoint.method)}`}>
              {selectedEndpoint.method}
            </span>
            <span className="font-mono text-lg text-gray-900">{selectedEndpoint.path}</span>
            <span className="text-sm text-gray-500">
              ({selectedEndpoint.totalResponses} responses analyzed)
            </span>
          </div>
        </div>

        {/* Shape Comparison */}
        <ShapeComparison
          baseShape={selectedEndpoint.baseShape}
          variantShapes={selectedEndpoint.variantShapes}
          inconsistencies={selectedEndpoint.inconsistencies}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Endpoint Inconsistencies
        </h2>
        <p className="text-gray-600">
          {diffs.length} endpoint{diffs.length !== 1 ? 's' : ''} with shape differences detected
        </p>
      </div>

      {/* Endpoints List */}
      {diffs.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <div className="text-green-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Inconsistencies Found
          </h3>
          <p className="text-gray-600">
            All endpoints have consistent response shapes
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {diffs && diffs.map((diff, idx) => {
            const totalIssues = getTotalIssues(diff);

            return (
              <div
                key={idx}
                onClick={() => setSelectedEndpoint(diff)}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getMethodColor(diff.method)}`}>
                      {diff.method}
                    </span>
                    <span className="font-mono text-gray-900">{diff.path}</span>
                    <span className="text-sm text-gray-500">
                      ({diff.totalResponses} responses)
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Issue Counts */}
                    <div className="flex items-center gap-3 text-sm">
                      {diff.inconsistencies.missingFields.length > 0 && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded font-medium">
                          {diff.inconsistencies.missingFields.length} missing
                        </span>
                      )}
                      {diff.inconsistencies.typeChanges.length > 0 && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded font-medium">
                          {diff.inconsistencies.typeChanges.length} type changes
                        </span>
                      )}
                      {diff.inconsistencies.extraFields.length > 0 && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded font-medium">
                          {diff.inconsistencies.extraFields.length} extra
                        </span>
                      )}
                    </div>

                    {/* Total Badge */}
                    <div className="px-3 py-1 bg-red-500 text-white rounded-full font-semibold">
                      {totalIssues}
                    </div>

                    {/* Arrow */}
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
