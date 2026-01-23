export const API_CONFIG = {
  // Base Server URL
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:4000',
  
  // Endpoints
  ENDPOINTS: {
    RUNNER: {
      RUN: '/api/runner/run',
      STATUS: '/api/runner/status'      
    },
    PROGRAMMING_LANGUAGE: {
      LIST_ACTIVE: '/api/programming-languages/list-active'
    }
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
  RUNNER: {
    RUN: getApiUrl(API_CONFIG.ENDPOINTS.RUNNER.RUN),
    STATUS: (id: string) => getApiUrl(API_CONFIG.ENDPOINTS.RUNNER.STATUS, id)
  },
  PROGRAMMING_LANGUAGES: {
    LIST_ACTIVE: getApiUrl(API_CONFIG.ENDPOINTS.PROGRAMMING_LANGUAGE.LIST_ACTIVE),
  }
}; 