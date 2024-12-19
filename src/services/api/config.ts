// API configuration and constants
export const API_BASE_URL = '/api';

export const API_ENDPOINTS = {
  SEARCH: '/search',
  CHAT: '/chat',
  DOCUMENT_UPLOAD: '/pdfs',
} as const;

// Common headers for API requests
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// API error class for consistent error handling
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
} 