// Real API Service để gọi backend server
import axios from 'axios';
import { API_URLS } from '../config/api';

interface RunResponse {
  success: boolean;
  id: string;
}

interface StatusResponse {
  status: string;
  output: string;
  error: string;
}

// Tạo axios instance với cấu hình mặc định
const apiClient = axios.create({
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor để log requests
apiClient.interceptors.request.use(
  (config) => config,
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor để log responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ Response error:', error);
    if (error.response) {
      console.error('📊 Error response:', error.response.data);
      console.error('🔢 Error status:', error.response.status);
    }
    return Promise.reject(error);
  }
);

/**
 * Gửi code lên server để thực thi
 * @param language - Ngôn ngữ lập trình
 * @param code - Code cần chạy
 * @returns Promise<RunResponse>
 */
export const runCode = async (language: string, code: string): Promise<RunResponse> => {
  try {
    const response = await apiClient.post<RunResponse>(API_URLS.RUN, {
      language,
      code
    });
    
    return response.data;
  } catch (error) {
    console.error('💥 Error running code:', error);
    throw error;
  }
};

/**
 * Kiểm tra trạng thái thực thi code
 * @param id - ID của execution
 * @returns Promise<StatusResponse>
 */
export const checkStatus = async (id: string): Promise<StatusResponse> => {
  try {
    const response = await apiClient.get<StatusResponse>(API_URLS.STATUS(id));
    
    return response.data;
  } catch (error) {
    console.error('💥 Error checking status:', error);
    throw error;
  }
};

/**
 * Hàm helper để kiểm tra kết nối server
 * @returns Promise<boolean>
 */
export const checkServerConnection = async (): Promise<boolean> => {
  try {
    const baseUrl = API_URLS.RUN.split('/runner')[0]; // Lấy base URL
    await axios.get(`${baseUrl}/health`, { timeout: 5000 });
    return true;
  } catch (error) {
    console.warn('⚠️ Server connection check failed:', error);
    return false;
  }
}; 