import APIClient from './client';
import { API_ENDPOINTS } from './config';
import type { 
  SearchResponse, 
  ChatResponse, 
  DocumentUploadResponse 
} from './types';

export const searchService = {
  search: (query: string) => 
    APIClient.get<SearchResponse>(API_ENDPOINTS.SEARCH, { q: query }),
};

export const chatService = {
  sendMessage: (message: string) =>
    APIClient.post<ChatResponse>(API_ENDPOINTS.CHAT, { message }),
};

export const documentService = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return APIClient.upload<DocumentUploadResponse>(API_ENDPOINTS.DOCUMENT_UPLOAD, formData);
  },
}; 