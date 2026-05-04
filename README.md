# Nger Clinic 🏥 - Hệ thống quản lý và đặt lịch khám bệnh đa khoa

## 📖 Giới thiệu

**Nger Clinic** là một ứng dụng web Fullstack hỗ trợ số hóa toàn diện quy trình hoạt động của một phòng khám đa khoa. Hệ thống giúp bệnh nhân dễ dàng đặt lịch khám, trong khi đó ban quản trị, bác sĩ và lễ tân có thể quản lý lịch hẹn, hồ sơ bệnh nhân và giao tiếp trực tuyến một cách dễ dàng.

## ✨ Tính năng nổi bật

- **🔐 Xác thực & Phân quyền (RBAC):** Hệ thống bảo mật với JWT, phân quyền chi tiết cho 4 vai trò độc lập:
  - **Admin :** Toàn quyền quản trị hệ thống.
  - **Bác sĩ :** Quản lý lịch khám, theo dõi hồ sơ bệnh nhân.
  - **Lễ tân :** Xác nhận lịch khám, chat trực tuyến hỗ trợ bệnh nhân.
  - **Bệnh nhân :** Đặt lịch hẹn, xem lịch sử khám bệnh.
- **📅 Đặt lịch khám thông minh:** Luồng đặt lịch xử lý chống trùng lặp, giới hạn bệnh nhân/khung giờ. Áp dụng **Database Transaction** (Sequelize) để đảm bảo tính toàn vẹn dữ liệu.
- **💬 Live Chat Real-time:** Hỗ trợ nhắn tin trực tuyến theo thời gian thực giữa Lễ tân và Bệnh nhân thông qua **Socket.io**.
- **⚡ Hiệu năng tối ưu:** Áp dụng kỹ thuật Debounce trong tìm kiếm, Server-side Pagination cho danh sách lịch hẹn và tin nhắn chat.

## 💻 Công nghệ sử dụng

### Frontend

- **Framework:** ReactJS
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS
- **Khác:** Socket.io-client, Axios, Day.js

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL
- **ORM:** Sequelize
- **Real-time:** Socket.io
- **Security:** JWT (JSON Web Token)

## 🚀 Hướng dẫn cài đặt và chạy dự án (Local Development)

### Yêu cầu hệ thống

- [Node.js](https://nodejs.org/) (Phiên bản >= 14.x)
- [MySQL](https://www.mysql.com/) (Phiên bản >= 8.x) hoặc XAMPP

### 1. Cài đặt Backend

```bash
# Di chuyển vào thư mục backend
cd backend

# Cài đặt các dependencies
npm install
```

Tạo file `.env` trong thư mục `backend` và điền các thông tin sau:

```env
PORT=8080
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE_NAME=dat_lich_kham_benh
PORT= 3001
URL_CLIENT = "http://localhost:5173"
JWT_ACCESS_KEY = "nger113"
JWT_REFRESH_KEY = "nger193"
```

Khởi tạo cơ sở dữ liệu và chạy server:

```bash
# Chạy file migrations để tạo bảng trong DB
npx sequelize-cli db:migrate

# Chạy seeders để tạo dữ liệu mẫu (nếu có)
npx sequelize-cli db:seed:all

# Khởi động server
npm run start
```

### 2. Cài đặt Frontend

```bash
# Mở một terminal mới, di chuyển vào thư mục frontend
cd frontend

# Cài đặt các dependencies
npm install

# Cấu hình biến môi trường frontend (tạo file .env)
VITE_UPLOAD_PRESET=dat_lich_kham-rdnzg5se
VITE_CLOUD_NAME=dhj8wklmj

# Khởi động ứng dụng React
npm start
```

## 👨‍💻 Tác giả

- Bắc
