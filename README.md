# Bug Tracker Application

A comprehensive bug tracking web application built with React.js, Python Flask, MongoDB, and Groq AI for intelligent bug analysis.

## 🔧 Tech Stack

- **Frontend**: React.js with Vite, Material UI
- **Backend**: Python Flask with JWT authentication
- **Database**: MongoDB with PyMongo
- **AI**: Groq for automatic tag generation
- **Authentication**: JWT tokens

## 📁 Project Structure

```
task-management/
├── backend/
│   ├── app.py              # Flask application
│   ├── requirements.txt    # Python dependencies
│   └── .env.example       # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   └── App.jsx        # Main app component
│   └── package.json       # Node.js dependencies
└── README.md
```

## 🚀 Features

### ✅ Completed Features

1. **User Authentication**
   - User registration and login
   - JWT-based authentication
   - Protected routes

2. **Bug Management**
   - Create, read, update, delete bugs
   - Bug severity levels (Low, Medium, High, Critical)
   - Bug status tracking (Open, In Progress, Resolved, Closed)
   - User assignment functionality

3. **AI-Powered Features**
   - Automatic tag generation using Groq AI
   - Intelligent bug categorization

4. **User Interface**
   - Responsive Material UI design
   - Dashboard with statistics
   - Bug listing with filtering and grouping
   - Search functionality
   - Tag-based filtering

5. **Visual Organization**
   - Status-based tabs
   - Severity-based grouping
   - Color-coded chips for status and severity
   - Expandable sections

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- MongoDB (local or cloud instance)
- Groq API key

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` file with your configuration:
   ```
   MONGO_URI=mongodb://localhost:27017/bug_tracker
   JWT_SECRET_KEY=your-super-secret-jwt-key
   GROQ_API_KEY=your-groq-api-key
   ```

5. **Start the backend server**
   ```bash
   python app.py
   ```

   The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`

### Database Setup

1. **Install MongoDB** (if running locally)
   - Download from [MongoDB Official Site](https://www.mongodb.com/try/download/community)
   - Or use MongoDB Atlas (cloud)

2. **Start MongoDB service**
   ```bash
   mongod
   ```

### Groq API Setup

1. **Get Groq API Key**
   - Sign up at [Groq Console](https://console.groq.com/)
   - Create an API key
   - Add it to your `.env` file

## 📱 Usage

1. **Register/Login**
   - Create a new account or login with existing credentials
   - JWT tokens are automatically managed

2. **Dashboard**
   - View bug statistics and recent bugs
   - Quick access to create new bugs

3. **Bug Management**
   - Create new bugs with detailed information
   - AI automatically generates relevant tags
   - Edit and update bug status and assignments
   - Delete bugs when resolved

4. **Filtering and Search**
   - Filter by status using tabs
   - Search bugs by title and description
   - Filter by tags (click on tags to filter)
   - Group bugs by severity level

## 🔮 Future Enhancements

- [ ] Email notifications for bug assignments
- [ ] File attachments for bugs
- [ ] Comments and discussion threads
- [ ] Advanced reporting and analytics
- [ ] Integration with external tools (Slack, Jira)
- [ ] Bulk operations for bug management
- [ ] Custom fields and workflows

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.