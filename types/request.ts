export interface Request {
  id: number;
  sessionId: string;
  method: string;
  path: string;
  statusCode: number;
  durationMs: number;
  requestHeaders: Record<string, string | string[]>;
  requestBody: string;
  responseHeaders: Record<string, string | string[]>;
  responseBody: string;
  error: string | null;
  timestamp: number;
  createdAt: string;
}

export interface ApiResponse {
  success: boolean;
  data: Request[];
}

// Diff types
export interface FieldDiff {
  field: string;
  type: 'missing' | 'type_change' | 'extra';
  expectedType?: string;
  actualType?: string;
  path: string;
}

export interface EndpointDiff {
  method: string;
  path: string;
  totalResponses: number;
  inconsistencies: {
    missingFields: FieldDiff[];
    typeChanges: FieldDiff[];
    extraFields: FieldDiff[];
  };
  baseShape: any;
  variantShapes: any[];
}

export interface DiffsResponse {
  success: boolean;
  data: EndpointDiff[];
  count: number;
}

// Latency stats types
export interface EndpointLatency {
  endpoint: string;
  method: string;
  path: string;
  avgLatency: number;
  minLatency: number;
  maxLatency: number;
  count: number;
}

export interface LatencyResponse {
  success: boolean;
  data: EndpointLatency[];
  count: number;
}
