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

export interface ProgrammingLanguage {
  id: string;
  name: string;
  defaultCode?: string;
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
 * Lấy danh sách ngôn ngữ lập trình từ API
 * @returns Promise<ProgrammingLanguage[]>
 */
export const fetchLanguages = async (): Promise<ProgrammingLanguage[]> => {
  try {
    const response = await apiClient.get<ProgrammingLanguage[]>(API_URLS.PROGRAMMING_LANGUAGES.LIST_ACTIVE);
    return response.data;
  } catch (error) {
    console.error('💥 Error fetching languages:', error);
    throw error;
  }
};

/**
 * Gửi code lên server để thực thi
 * @param programmingLanguageId - ID của ngôn ngữ lập trình đã chọn
 * @param code - Code cần chạy
 * @returns Promise<RunResponse>
 */
export const runCode = async (programmingLanguageId: string, code: string): Promise<RunResponse> => {
  try {
    const response = await apiClient.post<RunResponse>(API_URLS.RUNNER.RUN, {
      programmingLanguageId,
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
    const response = await apiClient.get<StatusResponse>(API_URLS.RUNNER.STATUS(id));
    
    return response.data;
  } catch (error) {
    console.error('💥 Error checking status:', error);
    throw error;
  }
};