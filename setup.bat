@echo off
echo 🚀 Bug Tracker Application Setup
echo =================================

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16 or higher.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Setup Backend
echo.
echo 🔧 Setting up Backend...
cd backend

REM Create virtual environment
echo Creating Python virtual environment...
python -m venv venv

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate

REM Install Python dependencies
echo Installing Python dependencies...
pip install -r requirements.txt

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
    echo ⚠️  Please edit backend\.env file with your MongoDB URI and Groq API key
)

cd ..

REM Setup Frontend
echo.
echo 🎨 Setting up Frontend...
cd frontend

REM Install Node.js dependencies
echo Installing Node.js dependencies...
npm install

cd ..

echo.
echo ✅ Setup completed successfully!
echo.
echo 📋 Next Steps:
echo 1. Edit backend\.env file with your configuration:
echo    - MONGO_URI (MongoDB connection string)
echo    - JWT_SECRET_KEY (random secret key)
echo    - GROQ_API_KEY (your Groq API key)
echo.
echo 2. Start MongoDB service
echo.
echo 3. Start the backend server:
echo    cd backend
echo    venv\Scripts\activate
echo    python main.py
echo.
echo 4. In a new terminal, start the frontend:
echo    cd frontend
echo    npm run dev
echo.
echo 5. Open http://localhost:5173 in your browser
echo.
echo 🎉 Happy bug tracking!
pause
