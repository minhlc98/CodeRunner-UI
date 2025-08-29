// Environment Configuration
export const ENV_CONFIG = {
  // Development
  DEVELOPMENT: {
    API_BASE_URL: 'http://127.0.0.1:4000',
    RUN_ENDPOINT: '/api/runner/run',
    STATUS_ENDPOINT: '/api/runner/status',
  },
  
  // Production
  PRODUCTION: {
    API_BASE_URL: process.env.CODE_RUNNER_BASE_URL || 'https://your-production-server.com',
    RUN_ENDPOINT: process.env.RUN_CODE_ENDPOINT || '/api/runner/run',
    STATUS_ENDPOINT: process.env.REACT_APP_STATUS_ENDPOINT || '/api/runner/status',
  },
  
  // Staging
  STAGING: {
    API_BASE_URL: process.env.CODE_RUNNER_BASE_URL || 'https://your-staging-server.com',
    RUN_ENDPOINT: process.env.RUN_CODE_ENDPOINT || '/api/runner/run',
    STATUS_ENDPOINT: process.env.CHECK_STATUS_ENDPOINT || '/api/runner/status',
  }
};

// Lấy environment hiện tại
export const getCurrentEnvironment = () => {
  if (process.env.NODE_ENV === 'production') {
    return ENV_CONFIG.PRODUCTION;
  } else if (process.env.NODE_ENV === 'test') {
    return ENV_CONFIG.DEVELOPMENT; // Sử dụng development config cho test
  } else {
    return ENV_CONFIG.DEVELOPMENT;
  }
};

// Export current config
export const CURRENT_ENV = getCurrentEnvironment();