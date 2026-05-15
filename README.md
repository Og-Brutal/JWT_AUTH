# JWT_AUTH 🔐

A comprehensive JWT (JSON Web Token) based authentication system built with Express.js and MongoDB. This project implements modern authentication practices including email verification, token refresh, multi-device logout, and secure password handling.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Authentication Flow](#authentication-flow)
- [Project Structure Details](#project-structure-details)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

- **User Registration** - Secure user sign-up with email verification
- **User Login** - JWT-based user authentication
- **Email Verification** - OTP-based email verification using Google Nodemailer
- **Token Refresh** - Refresh access tokens without re-login
- **Multi-Device Logout** - Logout user from all devices simultaneously
- **Single Device Logout** - Logout from individual devices
- **Password Encryption** - Bcrypt for secure password hashing
- **Role-Based Access** - Private and public endpoints
- **Cookie Management** - Secure cookie-based token storage
- **MongoDB Integration** - NoSQL database for user data persistence
- **Request Logging** - Morgan middleware for HTTP request logging

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Express.js** | Web framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB ODM |
| **JWT (jsonwebtoken)** | Token-based authentication |
| **Bcrypt** | Password hashing |
| **Nodemailer** | Email service |
| **Cookie-parser** | Cookie middleware |
| **Morgan** | HTTP request logger |
| **Dotenv** | Environment variable management |
| **Nodemon** | Development server with auto-restart |

---

## 📁 Project Structure

```
JWT_AUTH/
├── Controllers/          # Business logic for routes
│   └── user.controller.js
├── Models/              # Database schemas
│   └── user.model.js
├── Routers/             # API endpoints
│   └── User.route.js
├── Database/            # Database connection
│   └── dbconnection.js
├── config/              # Configuration files
│   └── config.js
├── services/            # Business services
├── utils/               # Utility functions
├── app.js               # Express app setup
├── server.js            # Server entry point
├── package.json         # Dependencies
├── .gitignore           # Git ignore rules
└── README.md            # Documentation
```

---

## 📦 Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (Local or MongoDB Atlas)
- **Google Account** (for email service via Nodemailer)

---

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Og-Brutal/JWT_AUTH.git
   cd JWT_AUTH
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the root directory
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (see [Environment Variables](#environment-variables) section)

---

## 🔑 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# MongoDB Connection
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name

# JWT Secret Key
JWT_SCRET_KEY=your_super_secret_jwt_key_here

# Google SMTP Configuration (for email verification)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REFRESH_TOKEN=your_google_refresh_token
GOOGLE_USER=your_email@gmail.com

# Optional: Server Port
PORT=3000
```

### How to get Google credentials:
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Gmail API
4. Create OAuth 2.0 credentials
5. Use the credentials to send emails via Nodemailer

---

## ▶️ Getting Started

### Development Mode
```bash
npm run dev
```
The server will start on `http://localhost:3000`

### Production Mode
```bash
node server.js
```

### Expected Output
```
database connected successfully!
server started successfully at port :  3000
```

---

## 🔌 API Endpoints

### Authentication Routes

#### 1. **Register User**
- **Route:** `POST /api/auth/register`
- **Access:** Public
- **Description:** Register a new user
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123",
    "name": "John Doe"
  }
  ```

#### 2. **Login User**
- **Route:** `POST /api/auth/login`
- **Access:** Public
- **Description:** Login user and receive JWT tokens
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123"
  }
  ```

#### 3. **Verify Email**
- **Route:** `POST /api/auth/verify-email`
- **Access:** Public
- **Description:** Verify user's email using OTP
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "otp": "123456"
  }
  ```

#### 4. **Get Current User**
- **Route:** `GET /api/auth/get-me`
- **Access:** Private (Requires JWT token)
- **Description:** Retrieve current logged-in user information
- **Headers:**
  ```
  Authorization: Bearer your_jwt_token
  ```

#### 5. **Refresh Access Token**
- **Route:** `GET /api/auth/refresh-page`
- **Access:** Private (Requires Refresh Token)
- **Description:** Get a new access token using refresh token
- **Headers:**
  ```
  Cookie: refreshToken=your_refresh_token
  ```

#### 6. **Logout (Single Device)**
- **Route:** `POST /api/auth/logout`
- **Access:** Private (Requires JWT token)
- **Description:** Logout from current device
- **Headers:**
  ```
  Authorization: Bearer your_jwt_token
  ```

#### 7. **Logout All Devices**
- **Route:** `POST /api/auth/logout-all`
- **Access:** Private (Requires JWT token)
- **Description:** Logout from all devices
- **Headers:**
  ```
  Authorization: Bearer your_jwt_token
  ```

---

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────────────────┐
│                  User Registration                  │
└──────────────────────┬────────────────────────────┘
                       │
                       ▼
         ┌─────────────────────────────┐
         │  Hash Password with Bcrypt  │
         └──────────────┬──────────────┘
                        │
                        ▼
         ┌─────────────────────────────┐
         │   Save User to MongoDB      │
         └──────────────┬──────────────┘
                        │
                        ▼
         ┌─────────────────────────────┐
         │  Send OTP via Email         │
         └──────────────┬──────────────┘
                        │
                        ▼
         ┌─────────────────────────────┐
         │  User Verifies Email        │
         └─────────────────────────────┘


┌─────────────────────────────────────────────────────┐
│                     User Login                      │
└──────────────────────┬────────────────────────────┘
                       │
                       ▼
         ┌─────────────────────────────┐
         │   Verify Credentials        │
         └──────────────┬──────────────┘
                        │
                        ▼
         ┌─────────────────────────────┐
         │  Generate JWT & Refresh     │
         │        Tokens               │
         └──────────────┬──────────────┘
                        │
                        ▼
         ┌─────────────────────────────┐
         │   Return Tokens (Cookies)   │
         └─────────────────────────────┘
```

---

## 📂 Project Structure Details

### **Controllers/user.controller.js**
Contains all the business logic for:
- User registration
- User login
- Email verification
- Token refresh
- Single and multi-device logout
- User information retrieval

### **Models/user.model.js**
Defines MongoDB user schema with fields like:
- Email (unique)
- Password (hashed)
- Name
- Verification status
- Refresh tokens (for multi-device support)
- Created/Updated timestamps

### **Routers/User.route.js**
Defines all API routes and maps them to controller functions

### **Database/dbconnection.js**
Establishes MongoDB connection using Mongoose

### **config/config.js**
Centralizes all environment variables and validates their presence

### **app.js**
Express app configuration including:
- Middleware setup (JSON, Morgan, Cookie-parser)
- Route registration
- Database connection

### **server.js**
Server startup entry point on port 3000

---

## ⚙️ Configuration

### Express Middleware
- **morgan("dev")** - Logs HTTP requests in development format
- **express.json()** - Parses incoming JSON requests
- **cookieParser()** - Parses HTTP request cookies

### Database
- Connected via Mongoose to MongoDB
- Connection string from `MONGO_URI` environment variable

### Security
- Passwords hashed with Bcrypt (cost factor: 10)
- JWT tokens with secret key for authentication
- HTTP-only cookies for token storage (recommended)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License** - see the package.json for details.

---

## 🔗 Related Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [JWT Introduction](https://jwt.io/introduction)
- [Bcrypt Documentation](https://github.com/kelektiv/node.bcrypt.js)
- [Nodemailer Guide](https://nodemailer.com/smtp/)

---

## 💡 Tips for Development

- Use the `npm run dev` command for development with auto-reload
- Test API endpoints with tools like Postman or Insomnia
- Check `.env` file is properly configured before running
- Monitor server logs for debugging
- Use MongoDB Compass for database visualization

---

## 📞 Support

For issues, questions, or suggestions, please open an issue on the [GitHub repository](https://github.com/Og-Brutal/JWT_AUTH).

---

**Made with ❤️ by Og-Brutal**
