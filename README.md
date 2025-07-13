# 🔗 URL Shorter - Professional URL Shortening Service

A modern, full-stack URL shortening application with authentication, built with React and Node.js.

![URL Shorter](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)

## ✨ Features

- 🔐 **User Authentication** - JWT-based login/signup system
- 🚫 **Anonymous Limits** - 3 URLs for anonymous users
- ♾️ **Unlimited URLs** - No limits for registered users
- 📊 **URL History** - Track and manage all your shortened links
- 🎨 **Modern UI** - Beautiful interface with dark/light themes
- 📱 **Responsive Design** - Works perfectly on all devices
- ⚡ **Fast & Reliable** - Lightning-fast URL shortening
- 🛡️ **Secure** - Password hashing and JWT tokens
- 🗄️ **Flexible Storage** - MongoDB with in-memory fallback

## 🚀 Live Demo

**Coming Soon** - Deploy to Vercel for live demo

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS framework
- **JavaScript (ES6+)** - Modern JavaScript features

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database (with in-memory fallback)
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

### Deployment
- **Vercel** - Production deployment platform
- **GitHub** - Version control and CI/CD

## 📁 Project Structure

```
Url-Shorter/
├── Frontend/                 # React frontend application
│   ├── src/
│   │   ├── App.jsx          # Main React component
│   │   ├── main.jsx         # React entry point
│   │   └── index.css        # Global styles
│   ├── public/              # Static assets
│   ├── package.json         # Frontend dependencies
│   └── vite.config.js       # Vite configuration
├── Backend/                 # Node.js API server
│   ├── src/
│   │   ├── controller/      # Request controllers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── services/        # Business logic
│   │   └── utils/           # Helper functions
│   ├── app.js              # Express server setup
│   └── package.json        # Backend dependencies
├── vercel.json             # Vercel deployment config
├── DEPLOYMENT.md           # Deployment instructions
└── README.md               # This file
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (optional - uses in-memory storage as fallback)

### 1. Clone the Repository
```bash
git clone https://github.com/Talha22223/Url-Stucture.git
cd Url-Stucture
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
cd Frontend
npm install

# Install backend dependencies
cd ../Backend
npm install
```

### 3. Environment Setup
Create a `.env` file in the Backend directory:
```env
PORT=5000
JWT_SECRET=your-super-secure-jwt-secret-key
MONGODB_URI=mongodb://localhost:27017/urlshortener
NODE_ENV=development
```

### 4. Start Development Servers

**Backend (Terminal 1):**
```bash
cd Backend
npm start
# Server runs on http://localhost:5000
```

**Frontend (Terminal 2):**
```bash
cd Frontend
npm run dev
# App runs on http://localhost:5173
```

## 🌐 Deployment

### Deploy to Vercel

1. **Connect to GitHub:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository

2. **Configure Environment Variables:**
   ```
   NODE_ENV=production
   JWT_SECRET=your-production-jwt-secret
   MONGODB_URI=your-mongodb-connection-string
   ```

3. **Deploy:**
   - Vercel auto-detects the configuration
   - Deployment happens automatically on every push

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 📖 API Documentation

### Authentication Endpoints
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - User login

### URL Management
- `POST /api/create` - Create shortened URL
- `GET /api/:shortCode` - Redirect to original URL

### Request Examples

**Create Short URL:**
```bash
curl -X POST http://localhost:5000/api/create \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/very-long-url"}'
```

**User Registration:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"securepass123"}'
```

## 🎨 Screenshots

### Main Interface
- Clean, modern design with URL input
- Dark/light theme toggle
- Real-time URL shortening

### Authentication
- Secure login/signup modals
- JWT-based session management
- User dashboard with URL history

### Features
- Anonymous user limits (3 URLs)
- Unlimited URLs for registered users
- Copy to clipboard functionality
- URL history and management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Talha Waris**
- GitHub: [@Talha22223](https://github.com/Talha22223)
- Repository: [Url-Stucture](https://github.com/Talha22223/Url-Stucture)

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the beautiful styling system
- Vercel for seamless deployment
- MongoDB for flexible data storage

---

⭐ **Star this repository if you found it helpful!**
