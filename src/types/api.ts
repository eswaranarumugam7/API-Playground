export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface Header {
  key: string;
  value: string;
  enabled: boolean;
}

export interface ApiRequest {
  url: string;
  method: HttpMethod;
  headers: Header[];
  body?: string;
}

export interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  responseTime: number;
}

export interface ApiError {
  message: string;
  type: 'network' | 'timeout' | 'validation' | 'server';
}