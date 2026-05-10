# 📝 Task Tracker

A modern, production-ready task management application built with the MERN stack (MongoDB, Express.js, React, Node.js). Features secure authentication, real-time task management, and a responsive UI.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)
![React](https://img.shields.io/badge/react-18.2.0-blue)

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based auth with bcrypt password hashing
- ✅ **Task Management** - Create, read, update, and delete tasks
- 🎯 **Status Tracking** - Mark tasks as pending or completed
- 🔍 **Smart Filtering** - Filter tasks by status (all/pending/completed)
- 📱 **Responsive Design** - Mobile-friendly interface
- 🛡️ **Input Validation** - Client and server-side validation
- ⚡ **Rate Limiting** - API protection against abuse
- 🔒 **Security Headers** - Helmet.js for enhanced security
- 🌐 **CORS Protection** - Configurable origin whitelist
- 💾 **MongoDB Atlas** - Cloud database with connection pooling
- 🚀 **Production Ready** - Optimized for deployment

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client with interceptors
- **CSS3** - Modern styling with gradients and animations

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Token-based authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **express-validator** - Input validation
- **express-rate-limit** - Rate limiting
- **Morgan** - HTTP request logger

## 📁 Project Structure

```
task-tracker/
├── client/                 # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoute.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Login.css
│   │   │   ├── Dashboard.js
│   │   │   └── Dashboard.css
│   │   ├── utils/
│   │   │   └── api.js      # API client with interceptors
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── .env.example
│
├── server/                 # Node.js backend
│   ├── config/
│   │   └── database.js     # MongoDB connection with retry logic
│   ├── middleware/
│   │   ├── auth.js         # JWT authentication
│   │   ├── errorHandler.js # Global error handler
│   │   └── validators.js   # Input validation rules
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.js         # Authentication routes
│   │   └── tasks.js        # Task CRUD routes
│   ├── server.js           # Main server file
│   ├── package.json
│   └── .env.example
│
├── .gitignore
├── package.json            # Root package.json for scripts
├── wrangler.toml           # Cloudflare Workers config
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/task-tracker.git
   cd task-tracker
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```
   Or install separately:
   ```bash
   # Install root dependencies
   npm install

   # Install server dependencies
   cd server && npm install

   # Install client dependencies
   cd ../client && npm install
   ```

3. **Set up environment variables**

   **Server** (`server/.env`):
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tasktracker?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   ALLOWED_ORIGINS=http://localhost:3000
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

   **Client** (`client/.env`):
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start the development servers**
   ```bash
   # From root directory - runs both frontend and backend
   npm run dev
   ```

   Or run separately:
   ```bash
   # Terminal 1 - Backend (from root)
   npm run server

   # Terminal 2 - Frontend (from root)
   npm run client
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/health

## 🔧 Available Scripts

### Root Directory
- `npm run install:all` - Install all dependencies (root, server, client)
- `npm run dev` - Run both frontend and backend concurrently
- `npm run server` - Run backend only
- `npm run client` - Run frontend only
- `npm run build` - Build frontend for production
- `npm run start:prod` - Start backend in production mode

### Server Directory
- `npm start` - Start server in production mode
- `npm run dev` - Start server with nodemon (auto-reload)

### Client Directory
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## 🌐 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |

### Tasks
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tasks` | Get all user tasks | Yes |
| POST | `/api/tasks` | Create new task | Yes |
| PUT | `/api/tasks/:id` | Update task | Yes |
| DELETE | `/api/tasks/:id` | Delete task | Yes |
| PATCH | `/api/tasks/:id/toggle` | Toggle task status | Yes |

### System
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/health` | Health check | No |

## 🚀 Deployment

### Cloudflare Pages (Frontend)

1. **Build the frontend**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy to Cloudflare Pages**
   - Connect your GitHub repository to Cloudflare Pages
   - Set build command: `cd client && npm install && npm run build`
   - Set build output directory: `client/build`
   - Add environment variable: `REACT_APP_API_URL=https://your-api-url.com/api`

### Cloudflare Workers (Backend) or Any Node.js Host

#### Option 1: Traditional Node.js Hosting (Recommended)

Deploy to platforms like:
- **Railway**: https://railway.app
- **Render**: https://render.com
- **Heroku**: https://heroku.com
- **DigitalOcean App Platform**: https://www.digitalocean.com/products/app-platform

**Environment Variables to Set:**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_production_jwt_secret
ALLOWED_ORIGINS=https://your-frontend-domain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Option 2: Cloudflare Workers (Advanced)

Note: Cloudflare Workers have limitations with traditional Node.js apps. Consider using Cloudflare Workers for API routes with edge computing benefits.

1. Install Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```

2. Login to Cloudflare:
   ```bash
   wrangler login
   ```

3. Set environment variables:
   ```bash
   wrangler secret put MONGODB_URI
   wrangler secret put JWT_SECRET
   wrangler secret put ALLOWED_ORIGINS
   ```

4. Deploy:
   ```bash
   wrangler deploy
   ```

### MongoDB Atlas Setup

1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Create a database user
3. Whitelist your IP (or use 0.0.0.0/0 for all IPs in production)
4. Get your connection string
5. Replace `<username>`, `<password>`, and `<cluster>` in the connection string

## 🔒 Security Features

- ✅ JWT token authentication with 24-hour expiry
- ✅ Password hashing with bcrypt (12 rounds)
- ✅ Input validation on client and server
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ CORS protection with origin whitelist
- ✅ Security headers via Helmet.js
- ✅ MongoDB injection prevention
- ✅ XSS protection
- ✅ Request timeout handling
- ✅ Graceful error handling

## 📝 Environment Variables

### Required Variables

**Backend:**
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 5000)
- `ALLOWED_ORIGINS` - Comma-separated list of allowed origins

**Frontend:**
- `REACT_APP_API_URL` - Backend API URL

### Optional Variables

- `RATE_LIMIT_WINDOW_MS` - Rate limit window (default: 900000ms)
- `RATE_LIMIT_MAX_REQUESTS` - Max requests per window (default: 100)

## 🧪 Testing

```bash
# Run frontend tests
cd client
npm test
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify your MongoDB URI is correct
   - Check if your IP is whitelisted in MongoDB Atlas
   - Ensure network connectivity

2. **CORS Error**
   - Add your frontend URL to `ALLOWED_ORIGINS` in backend `.env`
   - Check if backend is running

3. **Authentication Issues**
   - Clear browser localStorage
   - Verify JWT_SECRET is set
   - Check token expiry

4. **Port Already in Use**
   - Change PORT in server/.env
   - Kill process using the port: `npx kill-port 5000`

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourprofile)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ⭐ Show your support

Give a ⭐️ if this project helped you!

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

---

**Built with ❤️ using the MERN Stack**
