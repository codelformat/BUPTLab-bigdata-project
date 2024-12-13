export interface SearchResponse {
  results: SearchResult[];
}

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  relevanceScore: number;
}

export interface ChatResponse {
  response: string;
}

export interface DocumentUploadResponse {
  id: string;
  url: string;
}

export interface ErrorResponse {
  message: string;
  status: number;
} 