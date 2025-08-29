# 🔧 Cấu hình Environment và API

## 📁 Cấu trúc Files

```
src/
├── config/
│   ├── api.ts          # Cấu hình API endpoints
│   └── environment.ts  # Cấu hình môi trường
├── services/
|   └── apiService.ts   # Real API service
```

## 🌍 Environment Configuration

### Development (Default)
- **API Base URL**: `http://localhost:3001`
- **Run Endpoint**: `/api/runner/run`
- **Status Endpoint**: `/api/runner/status`

### Production
- **API Base URL**: Từ `API_BASE_URL` hoặc default

## 🔌 API Endpoints

### 1. Run Code
```
POST /runner/run
Content-Type: application/json

{
  "language": "javascript",
  "code": "console.log('Hello World');"
}
```

**Response:**
```json
{
  "success": true,
  "id": "exec_1234567890_abc123"
}
```

### 2. Check Status
```
GET /runner/status/:id
```

**Response:**
```json
{
  "status": "IDLE|COMPLETED|RUNNING|ERROR",
  "output": "Output của code (nếu thành công)",
  "error": "Thông báo lỗi (nếu có)"
}
```

## ⚙️ Cách cấu hình

### 1. Tạo file .env.local
```bash
# Tạo file .env.local trong thư mục gốc
touch .env.local
```

### 2. Cấu hình trong .env.local
```env
# Server Configuration
API_BASE_URL=http://your-server.com
RUN_ENDPOINT=/api/runner/run
STATUS_ENDPOINT=/api/runner/status

# Ví dụ:
# API_BASE_URL=http://localhost:3001
# API_BASE_URL=https://api.example.com
# API_BASE_URL=https://your-production-server.com
```

### 3. Restart ứng dụng
```bash
npm start
```

## 🔄 Chuyển đổi giữa Mock và Real API

### Development Mode (Mock API)
- Tự động sử dụng mock API
- Không cần backend server
- Có thể test toàn bộ flow

### Production Mode (Real API)
- Sử dụng real API calls
- Cần backend server hoạt động
- Gọi thực tế đến server

## 🚀 Backend Server Requirements

### CORS Configuration
```javascript
// Backend cần enable CORS cho frontend
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-domain.com'],
  credentials: true
}));
```

### Error Handling
```javascript
// Backend nên trả về error format
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## 🧪 Testing

### Test Mock API
1. Chạy `npm start`
2. Chọn ngôn ngữ và viết code
3. Nhấn Run
4. Xem console logs để debug

### Test Real API
1. Cấu hình `.env.local` với server URL
2. Đảm bảo backend server đang chạy
3. Restart React app
4. Test với real server

## 📝 Logs

### Console Logs
- 🚀 API Request logs
- ✅ API Response logs
- ❌ Error logs
- 🔍 Status check logs

### Mock API Logs
- 🚀 Mock execution started
- ⏱️ Expected completion time
- ✅ Mock execution completed
- ❌ Mock execution failed

## 🔧 Troubleshooting

### Common Issues

1. **CORS Error**
   - Kiểm tra backend CORS configuration
   - Đảm bảo frontend origin được allow

2. **API Timeout**
   - Tăng timeout trong `apiService.ts`
   - Kiểm tra backend performance

3. **Mock API không hoạt động**
   - Kiểm tra `shouldUseMockAPI()` return value
   - Restart ứng dụng

4. **Environment variables không load**
   - Đảm bảo file `.env.local` đúng format
   - Restart ứng dụng sau khi thay đổi

### Debug Commands
```bash
# Xem environment variables
echo $API_BASE_URL

# Check current environment
npm run build
# Xem build output để confirm environment
``` 