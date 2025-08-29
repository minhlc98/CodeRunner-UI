// API Configuration
import { CURRENT_ENV } from './environment';

export const API_CONFIG = {
  // Base URL của server - thay đổi theo môi trường
  BASE_URL: CURRENT_ENV.API_BASE_URL,
  
  // Endpoints
  ENDPOINTS: {
    RUN: CURRENT_ENV.RUN_ENDPOINT,
    STATUS: CURRENT_ENV.STATUS_ENDPOINT
  }
};

// Helper function để tạo full URL
export const getApiUrl = (endpoint: string, params?: string) => {
  const baseUrl = API_CONFIG.BASE_URL.replace(/\/$/, ''); // Remove trailing slash
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  if (params) {
    return `${baseUrl}${cleanEndpoint}/${params}`;
  }
  
  return `${baseUrl}${cleanEndpoint}`;
};

// Full URLs
export const API_URLS = {
  RUN: getApiUrl(API_CONFIG.ENDPOINTS.RUN),
  STATUS: (id: string) => getApiUrl(API_CONFIG.ENDPOINTS.STATUS, id)
}; 