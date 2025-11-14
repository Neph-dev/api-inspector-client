'use client';

import { FieldDiff } from '@/types/request';

interface ShapeComparisonProps {
  baseShape: any;
  variantShapes: any[];
  inconsistencies: {
    missingFields: FieldDiff[];
    typeChanges: FieldDiff[];
    extraFields: FieldDiff[];
  };
}

export default function ShapeComparison({
  baseShape,
  variantShapes,
  inconsistencies,
}: ShapeComparisonProps) {
  const allDiffs = [
    ...inconsistencies.missingFields,
    ...inconsistencies.typeChanges,
    ...inconsistencies.extraFields,
  ];

  const renderShape = (shape: any, title: string, isDiff: boolean = false) => {
    const shapeStr = JSON.stringify(shape, null, 2);
    
    return (
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">{title}</h4>
        <div className={`border rounded-lg p-4 ${isDiff ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-200'}`}>
          <pre className="text-xs font-mono text-gray-800 overflow-x-auto whitespace-pre-wrap">
            {shapeStr}
          </pre>
        </div>
      </div>
    );
  };

  const getDiffTypeLabel = (type: string) => {
    switch (type) {
      case 'missing':
        return 'Missing Field';
      case 'type_change':
        return 'Type Changed';
      case 'extra':
        return 'Extra Field';
      default:
        return type;
    }
  };

  const getDiffTypeColor = (type: string) => {
    switch (type) {
      case 'missing':
        return 'bg-red-100 text-red-800';
      case 'type_change':
        return 'bg-orange-100 text-orange-800';
      case 'extra':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Differences Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Differences Found ({allDiffs.length})
        </h3>
        
        {allDiffs.length === 0 ? (
          <p className="text-gray-500">No inconsistencies detected</p>
        ) : (
          <div className="space-y-2">
            {allDiffs.map((diff, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <div className={`px-2 py-1 rounded text-xs font-medium ${getDiffTypeColor(diff.type)}`}>
                  {getDiffTypeLabel(diff.type)}
                </div>
                <div className="flex-1">
                  <p className="font-mono text-sm text-gray-900">{diff.path}</p>
                  {diff.type === 'type_change' && (
                    <p className="text-xs text-gray-600 mt-1">
                      Expected: <span className="font-semibold">{diff.expectedType}</span>
                      {' → '}
                      Found: <span className="font-semibold text-red-600">{diff.actualType}</span>
                    </p>
                  )}
                  {diff.type === 'missing' && (
                    <p className="text-xs text-gray-600 mt-1">
                      Expected type: <span className="font-semibold">{diff.expectedType}</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Side-by-side Shape Comparison */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Shape Comparison</h3>
        
        <div className="space-y-4">
          {/* Base Shape */}
          <div>
            {renderShape(baseShape, 'Expected Shape (Base)')}
          </div>

          {/* Variant Shapes */}
          {variantShapes.map((variant, idx) => (
            <div key={idx}>
              {renderShape(variant, `Variant Shape ${idx + 1}`, true)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
