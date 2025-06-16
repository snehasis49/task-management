# 🚀 Task Management System

A comprehensive task management and bug tracking web application built with modern technologies including React.js, FastAPI, MongoDB, and Groq AI for intelligent task analysis.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-green.svg)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.5.0-green.svg)](https://www.mongodb.com/)
[![Material-UI](https://img.shields.io/badge/Material--UI-7.1.1-blue.svg)](https://mui.com/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

This Task Management System is a full-stack web application designed for efficient project management and bug tracking. It features a modern React frontend with Material-UI components, a robust FastAPI backend, and intelligent AI-powered task analysis using Groq AI.

### Key Highlights

- **Modern UI/UX**: Professional interface with dark/light mode support
- **Real-time Updates**: Live task status updates and notifications
- **AI-Powered**: Automatic tag generation and task categorization
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Secure Authentication**: JWT-based authentication with protected routes
- **Comprehensive Logging**: Daily rotating logs with 7-day retention

## ✨ Features

### 🔐 Authentication & Security
- User registration and login
- JWT-based authentication
- Protected routes and API endpoints
- Password hashing with bcrypt
- CORS configuration for cross-origin requests

### 📊 Task Management
- Create, read, update, delete tasks
- Task priority levels (Low, Medium, High, Critical)
- Status tracking (Open, In Progress, Resolved, Closed)
- User assignment functionality
- Due date management
- Task categorization with tags

### 🤖 AI-Powered Features
- Automatic tag generation using Groq AI
- Intelligent task categorization
- Smart task analysis and suggestions

### 🎨 User Interface
- Professional Material-UI design
- Dark/light mode toggle
- Responsive layout for all devices
- Drag-and-drop Kanban board
- Advanced filtering and search
- Real-time statistics dashboard

### 📈 Analytics & Reporting
- Task statistics and metrics
- Progress tracking
- Visual charts and graphs
- Export functionality

## 🛠️ Tech Stack

### Frontend
- **React 19.1.0** - Modern JavaScript library for building user interfaces
- **Vite 6.3.5** - Fast build tool and development server (replaces Node.js build tools)
- **Material-UI 7.1.1** - React component library with Material Design
- **React Router 7.6.2** - Declarative routing for React
- **Redux Toolkit 2.8.2** - State management for React
- **Axios 1.10.0** - Promise-based HTTP client
- **@hello-pangea/dnd 18.0.1** - Drag and drop library

### Backend
- **FastAPI 0.104.1** - Modern, fast web framework for building APIs
- **Uvicorn 0.24.0** - ASGI server implementation
- **PyMongo 4.5.0** - Python driver for MongoDB
- **Pydantic 2.11.7** - Data validation using Python type annotations
- **Python-JOSE 3.3.0** - JavaScript Object Signing and Encryption library
- **Passlib 1.7.4** - Password hashing library
- **LangChain 0.3.7** - Framework for developing AI applications
- **LangChain-Groq 0.2.1** - Groq integration for LangChain

### Database & AI
- **MongoDB** - NoSQL document database
- **Groq AI 0.14.0** - AI service for intelligent task analysis
- **Sentence Transformers 2.2.2** - For text embeddings and semantic search
- **Scikit-learn 1.3.0** - Machine learning utilities

### Development Tools
- **Vite** - Fast build tool and development server (no Node.js runtime needed)
- **ESLint** - JavaScript linting utility
- **Python-dotenv** - Environment variable management
- **CORS** - Cross-Origin Resource Sharing support

## 📁 Project Structure

```
task-management/
├── 📁 backend/                     # FastAPI Backend
│   ├── 📁 app/                     # Application package
│   │   ├── 📁 core/                # Core functionality
│   │   │   ├── config.py           # Configuration settings
│   │   │   └── logging_config.py   # Logging configuration
│   │   ├── 📁 database/            # Database connections
│   │   │   └── connection.py       # MongoDB connection
│   │   ├── 📁 middleware/          # Custom middleware
│   │   │   └── logging_middleware.py
│   │   ├── 📁 models/              # Pydantic models
│   │   │   ├── task.py             # Task models
│   │   │   └── user.py             # User models
│   │   ├── 📁 routers/             # API routes
│   │   │   ├── auth.py             # Authentication routes
│   │   │   ├── tasks.py            # Task management routes
│   │   │   ├── users.py            # User management routes
│   │   │   └── logs.py             # Logging routes
│   │   ├── 📁 services/            # Business logic
│   │   │   ├── auth_service.py     # Authentication service
│   │   │   ├── task_service.py     # Task service
│   │   │   └── ai_service.py       # AI service with Groq integration
│   │   └── 📁 utils/               # Utility functions
│   │       └── helpers.py          # Helper functions
│   ├── 📁 logs/                    # Application logs
│   ├── 📁 scripts/                 # Utility scripts
│   ├── main.py                     # FastAPI application entry point
│   ├── requirements.txt            # Python dependencies
│   └── .env.example               # Environment variables template
├── 📁 frontend/                    # React Frontend
│   ├── 📁 public/                  # Static assets
│   │   └── vite.svg               # Vite logo
│   ├── 📁 src/                     # Source code
│   │   ├── 📁 components/          # Reusable components
│   │   │   ├── KanbanBoard.jsx     # Drag-and-drop board
│   │   │   ├── Navbar.jsx          # Navigation component
│   │   │   └── ThemeToggle.jsx     # Theme switcher
│   │   ├── 📁 contexts/            # React contexts
│   │   │   ├── AuthContext.jsx     # Authentication context
│   │   │   └── ThemeContext.jsx    # Theme context
│   │   ├── 📁 pages/               # Page components
│   │   │   ├── Dashboard.jsx       # Main dashboard
│   │   │   ├── BugList.jsx         # Task listing page
│   │   │   ├── BugDetail.jsx       # Task detail page
│   │   │   ├── CreateBug.jsx       # Task creation page
│   │   │   ├── Login.jsx           # Login page
│   │   │   └── Register.jsx        # Registration page
│   │   ├── 📁 utils/               # Utility functions
│   │   │   └── api.js              # API client
│   │   ├── App.jsx                 # Main app component
│   │   ├── main.jsx                # Application entry point
│   │   └── index.css               # Global styles
│   ├── index.html                  # HTML template
│   ├── package.json                # Frontend dependencies
│   ├── vite.config.js              # Vite configuration
│   └── eslint.config.js            # ESLint configuration
├── setup.bat                       # Windows setup script
├── setup.sh                        # Unix setup script
├── DESIGN_UPDATE.md                # Design documentation
└── README.md                       # Project documentation
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

| Software | Version | Purpose | Download Link |
|----------|---------|---------|---------------|
| **Python** | 3.8+ | Backend development | [Download](https://python.org/) |
| **MongoDB** | 4.4+ | Database | [Download](https://mongodb.com/try/download/community) |
| **Git** | Latest | Version control | [Download](https://git-scm.com/) |

### Optional Tools

| Tool | Purpose | Download Link |
|------|---------|---------------|
| **MongoDB Compass** | Database GUI | [Download](https://mongodb.com/products/compass) |
| **Postman** | API testing | [Download](https://postman.com/) |
| **VS Code** | Code editor | [Download](https://code.visualstudio.com/) |

### API Keys Required

- **Groq API Key**: Sign up at [Groq Console](https://console.groq.com/) for AI features

### System Requirements

- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space
- **OS**: Windows 10+, macOS 10.15+, or Linux Ubuntu 18.04+

## 🚀 Installation

### Quick Start (Automated Setup)

For Windows users:
```bash
# Clone the repository
git clone https://github.com/your-username/task-management.git
cd task-management

# Run automated setup
setup.bat
```

For macOS/Linux users:
```bash
# Clone the repository
git clone https://github.com/your-username/task-management.git
cd task-management

# Make setup script executable and run
chmod +x setup.sh
./setup.sh
```

### Manual Setup

#### 1. Clone Repository
```bash
git clone https://github.com/your-username/task-management.git
cd task-management
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### 3. Environment Configuration

Create environment file:
```bash
# Copy example environment file
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/task_management

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Groq AI Configuration
GROQ_API_KEY=your-groq-api-key-from-console

# FastAPI Configuration
APP_NAME=Task Management API
DEBUG=True
VERSION=1.0.0

# CORS Configuration (automatically configured)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:5174
```

#### 4. Database Setup

**Option A: Local MongoDB**
```bash
# Install MongoDB Community Edition
# Windows: Download from MongoDB website
# macOS: brew install mongodb-community
# Ubuntu: sudo apt install mongodb

# Start MongoDB service
# Windows: net start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# Verify MongoDB is running
mongosh --eval "db.adminCommand('ismaster')"
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new cluster
3. Get connection string
4. Update `MONGO_URI` in `.env` file

#### 5. Start Backend Server

```bash
# Make sure you're in the backend directory with activated virtual environment
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Start FastAPI server
python main.py

# Or use uvicorn directly
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The backend will run on `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`
- Alternative Docs: `http://localhost:8000/redoc`

#### 6. Frontend Setup

```bash
# Navigate to frontend directory (open new terminal)
cd frontend

# Install dependencies using npm (comes with Python/system package managers)
npm install

# Start Vite development server
npm run dev
```

The frontend will run on `http://localhost:5174`

#### 7. Verify Installation

1. **Check Backend**: Visit `http://localhost:8000/health`
2. **Check Frontend**: Visit `http://localhost:5174`
3. **Check API Docs**: Visit `http://localhost:8000/docs`

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/task_management` | Yes |
| `JWT_SECRET_KEY` | Secret key for JWT tokens | - | Yes |
| `GROQ_API_KEY` | Groq AI API key | - | Optional |
| `DEBUG` | Enable debug mode | `True` | No |
| `ALLOWED_ORIGINS` | CORS allowed origins | Auto-configured | No |

### Frontend Configuration

The frontend automatically connects to the backend API. If you need to change the API URL, update the base URL in `frontend/src/utils/api.js`.

## 📱 Usage Guide

### Getting Started

1. **Access the Application**
   - Open your browser and navigate to `http://localhost:5174`
   - You'll see the login page

2. **Create an Account**
   - Click "Create Account"
   - Fill in your details (name, email, password)
   - Click "Create Account" to register

3. **Login**
   - Enter your email and password
   - Click "Sign In" to access the dashboard

### Dashboard Overview

The dashboard provides:
- **Task Statistics**: Total, Open, In Progress, Completed tasks
- **Recent Tasks**: Latest task activities
- **Quick Actions**: Create new tasks, view all tasks
- **Kanban Board**: Drag-and-drop task management

### Task Management

#### Creating Tasks
1. Click "Create New Task" button
2. Fill in task details:
   - **Title**: Brief description
   - **Description**: Detailed information
   - **Priority**: Low, Medium, High, Critical
   - **Status**: Open, In Progress, Resolved, Closed
   - **Assignee**: Select team member
   - **Due Date**: Set deadline
3. AI automatically generates relevant tags
4. Click "Create Task" to save

#### Managing Tasks
- **View Tasks**: Navigate to "Tasks" page
- **Filter Tasks**: Use status tabs, search, or tag filters
- **Edit Tasks**: Click on any task to view/edit details
- **Update Status**: Drag tasks between columns in Kanban view
- **Delete Tasks**: Use delete button in task details

### Advanced Features

#### AI-Powered Features (LangChain + Groq)
- **Smart Tagging**: LangChain with Groq AI automatically analyzes task content and generates relevant tags for categorization
- **Description Generation**: AI-powered description generator creates detailed task descriptions based on titles using Llama models
- **Intelligent Templates**: Fallback system provides structured templates when AI is unavailable
- **Modern Architecture**: Uses LangChain framework for better AI integration and reliability
- Helps with task organization, filtering, and content creation

#### Search and Filtering
- **Text Search**: Search by title or description
- **Status Filter**: Filter by Open, In Progress, etc.
- **Tag Filter**: Click tags to filter tasks
- **Priority Filter**: Filter by task priority

#### Theme Customization
- Toggle between light and dark modes
- Professional Poppins font throughout
- Responsive design for all devices

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Register new user | `{name, email, password}` |
| `POST` | `/api/auth/login` | User login | `{email, password}` |
| `POST` | `/api/auth/refresh` | Refresh JWT token | `{refresh_token}` |

### Task Management Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/tasks` | Get all tasks | ✅ |
| `POST` | `/api/tasks` | Create new task | ✅ |
| `GET` | `/api/tasks/{id}` | Get task by ID | ✅ |
| `PUT` | `/api/tasks/{id}` | Update task | ✅ |
| `DELETE` | `/api/tasks/{id}` | Delete task | ✅ |
| `GET` | `/api/tasks/stats` | Get task statistics | ✅ |
| `POST` | `/api/tasks/generate-description` | Generate AI description | ✅ |

### User Management Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/users/me` | Get current user | ✅ |
| `PUT` | `/api/users/me` | Update user profile | ✅ |
| `GET` | `/api/users` | Get all users | ✅ |

### System Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/docs` | API documentation |
| `GET` | `/api/logs` | Get application logs |

## 🏗️ Architecture

### System Architecture Overview

The Task Management System follows a modern three-tier architecture:

1. **Presentation Layer**: React.js frontend with Material-UI
2. **Application Layer**: FastAPI backend with business logic
3. **Data Layer**: MongoDB for data persistence

### Data Flow

```
User Interaction → React Components → API Calls → FastAPI Routes →
Business Services → MongoDB → Response → JSON → React State → UI Update
```

### Key Architectural Patterns

- **MVC Pattern**: Separation of concerns between models, views, and controllers
- **RESTful API**: Standard HTTP methods for resource manipulation
- **JWT Authentication**: Stateless authentication mechanism
- **Middleware Pattern**: Cross-cutting concerns like logging and CORS
- **Service Layer**: Business logic abstraction
- **Repository Pattern**: Data access abstraction

### Security Architecture

- **Authentication**: JWT tokens with expiration
- **Authorization**: Route-level protection
- **CORS**: Configured for cross-origin requests
- **Password Security**: Bcrypt hashing
- **Input Validation**: Pydantic models for data validation

### Scalability Considerations

- **Horizontal Scaling**: Stateless API design
- **Database Indexing**: Optimized MongoDB queries
- **Caching Strategy**: Ready for Redis integration
- **Load Balancing**: FastAPI supports multiple workers
- **Microservices Ready**: Modular service architecture

## 🔧 Troubleshooting

### Common Issues

#### Backend Issues

**Issue**: `ModuleNotFoundError: No module named 'app'`
```bash
# Solution: Ensure you're in the backend directory and virtual environment is activated
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python main.py
```

**Issue**: `pymongo.errors.ServerSelectionTimeoutError`
```bash
# Solution: Check MongoDB connection
# 1. Ensure MongoDB is running
mongosh --eval "db.adminCommand('ismaster')"

# 2. Check MONGO_URI in .env file
# 3. For MongoDB Atlas, ensure IP whitelist includes your IP
```

**Issue**: `groq.AuthenticationError`
```bash
# Solution: Check Groq API key
# 1. Verify GROQ_API_KEY in .env file
# 2. Ensure API key is valid at https://console.groq.com/
# 3. AI features will be disabled if key is invalid
```

#### Frontend Issues

**Issue**: `CORS policy: No 'Access-Control-Allow-Origin' header`
```bash
# Solution: Ensure backend CORS is configured
# 1. Check backend is running on correct port
# 2. Verify ALLOWED_ORIGINS in backend config
# 3. Frontend should match allowed origins
```

**Issue**: `Module not found: Can't resolve '@mui/material'`
```bash
# Solution: Reinstall dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Performance Optimization

#### Backend Optimization
- Use MongoDB indexes for frequently queried fields
- Implement pagination for large datasets
- Use connection pooling for database connections
- Enable FastAPI's automatic documentation caching

#### Frontend Optimization
- Implement React.memo for expensive components
- Use lazy loading for routes
- Optimize bundle size with Vite's tree shaking
- Implement virtual scrolling for large lists

## 🧪 Testing

### Backend Testing
```bash
cd backend
source venv/bin/activate

# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest tests/
```

### Frontend Testing
```bash
cd frontend

# Install test dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

# Run tests
npm test
```

### API Testing with Postman

1. Import the Postman collection from `/docs/postman/`
2. Set environment variables:
   - `base_url`: `http://localhost:8000`
   - `token`: JWT token from login response
3. Run the collection tests

## 🚀 Deployment

### Production Deployment

#### Backend Deployment (Docker)
```dockerfile
# Dockerfile for backend
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Frontend Deployment
```bash
# Build for production
cd frontend
npm run build

# Deploy to static hosting (Netlify, Vercel, etc.)
# Or serve with nginx
```

#### Environment Variables for Production
```env
# Production .env
DEBUG=False
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/task_management
JWT_SECRET_KEY=your-super-secure-production-key
GROQ_API_KEY=your-production-groq-key
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Cloud Deployment Options

| Platform | Backend | Frontend | Database |
|----------|---------|----------|----------|
| **AWS** | EC2/ECS/Lambda | S3/CloudFront | DocumentDB |
| **Google Cloud** | Cloud Run | Cloud Storage | MongoDB Atlas |
| **Azure** | Container Instances | Static Web Apps | Cosmos DB |
| **Heroku** | Heroku Dyno | Heroku Static | MongoDB Atlas |
| **DigitalOcean** | App Platform | App Platform | MongoDB Atlas |

## 🔮 Future Enhancements

### Planned Features
- [ ] **Real-time Notifications**: WebSocket integration for live updates
- [ ] **File Attachments**: Upload and manage task-related files
- [ ] **Comments System**: Discussion threads for tasks
- [ ] **Advanced Analytics**: Charts, reports, and insights
- [ ] **Team Management**: Role-based access control
- [ ] **Integration APIs**: Slack, Discord, email notifications
- [ ] **Mobile App**: React Native mobile application
- [ ] **Offline Support**: PWA with offline capabilities

### Technical Improvements
- [ ] **Caching Layer**: Redis for improved performance
- [ ] **Search Engine**: Elasticsearch for advanced search
- [ ] **Message Queue**: Celery for background tasks
- [ ] **Monitoring**: Prometheus and Grafana integration
- [ ] **Testing**: Comprehensive test coverage
- [ ] **CI/CD Pipeline**: Automated testing and deployment
- [ ] **Documentation**: Interactive API documentation
- [ ] **Internationalization**: Multi-language support

## 🤝 Contributing

We welcome contributions from the community! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) file for detailed guidelines.

### 🚨 Important Notice
**Attribution to Snehasis Santra is required in forks and derivative works.**
**Project name must not be renamed without permission.**

### Quick Start for Contributors
1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a feature branch** from `main`
4. **Make your changes** with clear commit messages
5. **Test thoroughly** before submitting
6. **Submit a pull request** with detailed description

For detailed contribution guidelines, development setup, and attribution requirements, please see [CONTRIBUTING.md](CONTRIBUTING.md).

## 📄 License

MIT © [Snehasis Santra](https://github.com/snehasis49)
Attribution must be retained.

## 🙏 Acknowledgments

- **React Team** for the amazing frontend framework
- **FastAPI** for the modern Python web framework
- **Material-UI** for the beautiful component library
- **MongoDB** for the flexible database solution
- **Groq** for the AI-powered features
- **Open Source Community** for inspiration and tools

## 📞 Support

### Getting Help
- **Documentation**: Check this README and inline code comments
- **Issues**: Create a GitHub issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact the maintainers directly

### Community
- **GitHub**: [Project Repository](https://github.com/your-username/task-management)
- **Discord**: [Community Server](https://discord.gg/your-server)
- **Twitter**: [@YourHandle](https://twitter.com/yourhandle)

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ by the Task Management Team

[🔝 Back to Top](#-task-management-system)

</div>