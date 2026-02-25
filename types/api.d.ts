// Backend Response Interfaces
export interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
}

export interface CursorPagination {
  per_page: number;
  next_cursor: string | null;
  has_more_pages: boolean;
  prev_cursor: string | null;
}

export interface ExtraResponse {
  _block?: string[] | null;
  pagination?: Pagination;
  cursor_pagination?: CursorPagination;
  [key: string]: any;
}

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  result: T;
}

export interface ApiDataResponse<T = any> {
  status: number;
  success: boolean;
  messages: string[] | null | object | string;
  data: T | null;
  extra: ExtraResponse | null;
}

// Error Types
export interface ApiError {
  status: number;
  message: string;
  data?: any;
  code?: string;
}

// Request Configuration
export interface RequestConfig {
  skipAuth?: boolean;
  skipErrorHandling?: boolean;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export interface ApiClientConfig {
  baseURL?: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  onTokenExpired?: () => void | Promise<void>;
  onUnauthorized?: () => void | Promise<void>;
}

// Request Types
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestOptions extends RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

// Pagination Response Types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface CursorPaginatedResponse<T> {
  data: T[];
  cursor_pagination: CursorPagination;
}
