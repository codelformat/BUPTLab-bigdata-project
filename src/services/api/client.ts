import { API_BASE_URL, DEFAULT_HEADERS, APIError } from './config';

// Generic API client for handling requests
class APIClient {
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

  static async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(API_BASE_URL + endpoint);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
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
    const response = await fetch(API_BASE_URL + endpoint, {
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
    const response = await fetch(API_BASE_URL + endpoint, {
      method: 'POST',
      body: formData,
    });

    return this.handleResponse<T>(response);
  }
}

export default APIClient; 