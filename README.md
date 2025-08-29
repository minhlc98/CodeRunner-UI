# 🖥️ Code Online Runner

Một ứng dụng React để chạy code online với giao diện đẹp và hiện đại.

## ✨ Tính năng

- **Hỗ trợ nhiều ngôn ngữ lập trình**: JavaScript, Typescript, Python, Java, C++, C#, PHP, Ruby, Go, Rust, Swift
- **Code Editor**: Textarea với syntax highlighting cho từng ngôn ngữ
- **Output Display**: Hiển thị kết quả và lỗi một cách rõ ràng
- **Real-time Status**: Theo dõi trạng thái thực thi code
- **Responsive Design**: Giao diện tương thích với mọi thiết bị
- **Auto-cleanup**: Tự động dọn dẹp resources khi cần thiết

## 🚀 Cách sử dụng

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Khởi chạy ứng dụng
```bash
npm start
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

### 3. Build cho production
```bash
npm run build
```

## 🔧 Cấu trúc API

Ứng dụng cần 2 API endpoints:

### POST /api/runner/run
Gửi code lên server để thực thi.

**Request Body:**
```json
{
  "language": "javascript",
  "code": "console.log('Hello World');"
}
```

**Response:**
```json
{
  "success": true,
  "id": "unique-execution-id"
}
```

### GET /api/runner/status/:id
Kiểm tra trạng thái thực thi code.

**Response:**
```json
{
  "status": "IDLE|COMPLETED|RUNNING|ERROR",
  "output": "Output của code (nếu thành công)",
  "error": "Thông báo lỗi (nếu có)"
}
```

## ⚙️ Cấu hình Environment

### Development Mode (Default)
- Sử dụng **Mock API** để demo
- Không cần backend server
- API Base URL: `http://localhost:3001`

### Production Mode
- Sử dụng **Real API** calls
- Cần backend server hoạt động
- Cấu hình qua environment variables

**Tạo file `.env.local`:**
```env
API_BASE_URL=http://your-server.com
RUN_ENDPOINT=/api/runner/run
STATUS_ENDPOINT=/api/runner/status
```

Xem chi tiết trong [CONFIGURATION.md](./CONFIGURATION.md)

## 📱 Giao diện

- **Left Panel**: Chọn ngôn ngữ, editor code, và các nút điều khiển
- **Right Panel**: Hiển thị output, error, và trạng thái thực thi
- **Responsive**: Tự động điều chỉnh layout cho mobile và tablet

## 🎨 Styling

- Sử dụng CSS Grid và Flexbox cho layout
- Gradient backgrounds và modern shadows
- Smooth animations và transitions
- Color-coded output (green cho success, red cho error)

## 🔄 Logic hoạt động

1. User chọn ngôn ngữ → Load code mẫu tương ứng
2. User viết/sửa code → Có thể clear output
3. User nhấn Run → Gửi code lên server
4. Server trả về execution ID → Bắt đầu check status
5. setInterval check status mỗi giây trong 30 giây
6. Khi status = COMPLETED → Hiển thị output
7. Khi status = ERROR → Hiển thị error
8. Tự động dừng interval và cleanup

## 🛠️ Công nghệ sử dụng

- **React 18** với TypeScript
- **Axios** cho HTTP requests
- **CSS3** với Grid, Flexbox, và Animations
- **Responsive Design** principles

## 📝 Lưu ý

- Cần có backend server để xử lý API endpoints
- Code mẫu được cung cấp cho mỗi ngôn ngữ
- Timeout được set 30 giây cho mỗi lần thực thi
- Tự động cleanup intervals để tránh memory leaks

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy tạo issue hoặc pull request.

## 📄 License

MIT License
