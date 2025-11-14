'use client';

import { useEffect, useState } from 'react';
import RequestTable from '@/components/RequestTable';
import RequestModal from '@/components/RequestModal';
import FilterBar from '@/components/FilterBar';
import DiffsView from '@/components/DiffsView';
import LatencyHeatmap from '@/components/LatencyHeatmap';
import { Request, EndpointDiff, EndpointLatency } from '@/types/request';

type Tab = 'requests' | 'diffs' | 'analytics';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('requests');
  const [requests, setRequests] = useState<Request[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
  const [diffs, setDiffs] = useState<EndpointDiff[]>([]);
  const [latencyData, setLatencyData] = useState<EndpointLatency[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Filter state
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [pathSearch, setPathSearch] = useState('');

  // Fetch requests from API
  const fetchRequests = async () => {
    try {
      const response = await fetch('http://localhost:9000/api/requests');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success && data.data) {
        setRequests(data.data);
        setError(null);
        setLastUpdate(new Date());
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  // Fetch diffs from API
  const fetchDiffs = async () => {
    try {
      const response = await fetch('http://localhost:9000/api/diffs');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success && data.data) {
        setDiffs(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch diffs:', err);
    }
  };

  // Fetch latency stats from API
  const fetchLatencyStats = async () => {
    try {
      const response = await fetch('http://localhost:9000/api/stats/latency');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success && data.data) {
        setLatencyData(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch latency stats:', err);
    }
  };

  // Apply filters to requests
  useEffect(() => {
    let filtered = [...requests];

    // Apply method filter
    if (methodFilter !== 'ALL') {
      filtered = filtered.filter(req => req.method === methodFilter);
    }

    // Apply path search
    if (pathSearch.trim()) {
      const search = pathSearch.toLowerCase();
      filtered = filtered.filter(req =>
        req.path.toLowerCase().includes(search)
      );
    }

    setFilteredRequests(filtered);
  }, [requests, methodFilter, pathSearch]);

  // Poll for new requests every 2 seconds
  useEffect(() => {
    fetchRequests();
    fetchDiffs();
    fetchLatencyStats();
    const interval = setInterval(() => {
      fetchRequests();
      fetchDiffs();
      fetchLatencyStats();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleClearFilters = () => {
    setMethodFilter('ALL');
    setPathSearch('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Neph's API Inspector</h1>
              <p className="text-sm text-gray-500">Local reverse proxy monitoring</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Live</span>
              </div>
              <div className="text-sm text-gray-600">
                {activeTab === 'requests' ? (
                  <>
                    {filteredRequests.length} / {requests.length} requests
                  </>
                ) : activeTab === 'diffs' ? (
                  <>
                    {diffs.length} endpoint{diffs.length !== 1 ? 's' : ''} with diffs
                  </>
                ) : (
                  <>
                    {latencyData.length} endpoint{latencyData.length !== 1 ? 's' : ''}
                  </>
                )}
                {lastUpdate && (
                  <span className="text-gray-400 ml-2">
                    (updated {lastUpdate.toLocaleTimeString()})
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${activeTab === 'requests'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
            >
              Requests
            </button>
            <button
              onClick={() => setActiveTab('diffs')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'diffs'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
            >
              Diffs
              {diffs.length > 0 && (
                <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                  {diffs.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${activeTab === 'analytics'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
            >
              Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar - Only show for Requests tab */}
      {activeTab === 'requests' && (
        <FilterBar
          methodFilter={methodFilter}
          pathSearch={pathSearch}
          onMethodChange={setMethodFilter}
          onPathChange={setPathSearch}
          onClear={handleClearFilters}
        />
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading && activeTab === 'requests' && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-600">Loading requests...</p>
          </div>
        )}

        {error && activeTab === 'requests' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800">Error: {error}</p>
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && !loading && !error && (
          <RequestTable
            requests={filteredRequests}
            onRowClick={setSelectedRequest}
          />
        )}

        {/* Diffs Tab */}
        {activeTab === 'diffs' && (
          <DiffsView diffs={diffs} />
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <LatencyHeatmap data={latencyData} />
        )}
      </div>

      {/* Modal */}
      {selectedRequest && (
        <RequestModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </div>
  );
}
