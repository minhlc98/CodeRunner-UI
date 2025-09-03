export const API_CONFIG = {
  // Base Server URL
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:4000',
  
  // Endpoints
  ENDPOINTS: {
    RUN: '/api/runner/run',
    STATUS: '/api/runner/status'
  }
};

// Helper function to generate full URL
export const getApiUrl = (endpoint: string, params?: string) => {
  const baseUrl = API_CONFIG.BASE_URL!.replace(/\/$/, ''); // Remove trailing slash
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