import { API_BASE_URL, DEFAULT_HEADERS, APIError } from './config';

// Generic API client for handling requests
class APIClient {
  private static readonly DEFAULT_TIMEOUT = 75000; // 60 seconds

  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        errorData.message || 'An error occurred',
        response.status,
        errorData
      );
    }

    return response.json();
  }

  private static async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout = APIClient.DEFAULT_TIMEOUT
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new APIError('Request timeout', 408);
      }
      throw error;
    }
  }

  static async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const baseUrl = window.location.origin;
    const url = new URL(API_BASE_URL + endpoint, baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await this.fetchWithTimeout(url.toString(), {
      method: 'GET',
      headers: DEFAULT_HEADERS,
    });

    return this.handleResponse<T>(response);
  }

  static async post<T>(
    endpoint: string,
    data: any,
    headers?: HeadersInit
  ): Promise<T> {
    const response = await this.fetchWithTimeout(API_BASE_URL + endpoint, {
      method: 'POST',
      headers: {
        ...DEFAULT_HEADERS,
        ...headers,
      },
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  static async upload<T>(endpoint: string, formData: FormData): Promise<T> {
    const response = await this.fetchWithTimeout(API_BASE_URL + endpoint, {
      method: 'POST',
      body: formData,
    });

    return this.handleResponse<T>(response);
  }
}

export default APIClient; 