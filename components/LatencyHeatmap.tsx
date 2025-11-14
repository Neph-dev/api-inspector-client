'use client';

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface EndpointLatency {
  endpoint: string;
  method: string;
  path: string;
  avgLatency: number;
  minLatency: number;
  maxLatency: number;
  count: number;
}

interface LatencyHeatmapProps {
  data: EndpointLatency[];
}

export default function LatencyHeatmap({ data }: LatencyHeatmapProps) {
  const getMethodColor = (method: string) => {
    const colors: { [key: string]: string } = {
      GET: 'rgba(59, 130, 246, 0.7)',      // blue
      POST: 'rgba(34, 197, 94, 0.7)',      // green
      PUT: 'rgba(234, 179, 8, 0.7)',       // yellow
      PATCH: 'rgba(168, 85, 247, 0.7)',    // purple
      DELETE: 'rgba(239, 68, 68, 0.7)',    // red
      OPTIONS: 'rgba(156, 163, 175, 0.7)', // gray
      HEAD: 'rgba(156, 163, 175, 0.7)',    // gray
    };
    return colors[method] || 'rgba(156, 163, 175, 0.7)';
  };

  const getMethodBorderColor = (method: string) => {
    const colors: { [key: string]: string } = {
      GET: 'rgba(59, 130, 246, 1)',
      POST: 'rgba(34, 197, 94, 1)',
      PUT: 'rgba(234, 179, 8, 1)',
      PATCH: 'rgba(168, 85, 247, 1)',
      DELETE: 'rgba(239, 68, 68, 1)',
      OPTIONS: 'rgba(156, 163, 175, 1)',
      HEAD: 'rgba(156, 163, 175, 1)',
    };
    return colors[method] || 'rgba(156, 163, 175, 1)';
  };

  // Sort by average latency descending
  const sortedData = [...data].sort((a, b) => b.avgLatency - a.avgLatency);

  const chartData = {
    labels: sortedData.map(item => `${item.method} ${item.path}`),
    datasets: [
      {
        label: 'Average Latency (ms)',
        data: sortedData.map(item => item.avgLatency),
        backgroundColor: sortedData.map(item => getMethodColor(item.method)),
        borderColor: sortedData.map(item => getMethodBorderColor(item.method)),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Average Response Time by Endpoint',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const item = sortedData[context.dataIndex];
            return [
              `Avg: ${item.avgLatency.toFixed(2)}ms`,
              `Min: ${item.minLatency.toFixed(2)}ms`,
              `Max: ${item.maxLatency.toFixed(2)}ms`,
              `Requests: ${item.count}`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Latency (ms)',
        },
      },
      y: {
        ticks: {
          autoSkip: false,
          font: {
            size: 11,
          },
        },
      },
    },
  };

  if (data.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <div className="text-gray-400 mb-4">
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
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Latency Data
        </h3>
        <p className="text-gray-600">
          Make some requests through the proxy to see latency statistics
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Total Endpoints</div>
          <div className="text-2xl font-bold text-gray-900">{data.length}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Avg Latency</div>
          <div className="text-2xl font-bold text-gray-900">
            {(data.reduce((sum, item) => sum + item.avgLatency, 0) / data.length).toFixed(2)}ms
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Slowest Endpoint</div>
          <div className="text-sm font-mono text-gray-900 truncate">
            {sortedData[0]?.method} {sortedData[0]?.path}
          </div>
          <div className="text-xs text-gray-500">{sortedData[0]?.avgLatency.toFixed(2)}ms</div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div style={{ height: `${Math.max(400, data.length * 40)}px` }}>
          <Bar data={chartData} options={options} />
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Endpoint
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Requests
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avg (ms)
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Min (ms)
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Max (ms)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      item.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                      item.method === 'POST' ? 'bg-green-100 text-green-800' :
                      item.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                      item.method === 'PATCH' ? 'bg-purple-100 text-purple-800' :
                      item.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.method}
                    </span>
                    <span className="font-mono text-sm text-gray-900">{item.path}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-sm text-gray-900">{item.count}</td>
                <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                  {item.avgLatency.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right text-sm text-gray-600">
                  {item.minLatency.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right text-sm text-gray-600">
                  {item.maxLatency.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
