#!/bin/bash

echo "=================================="
echo "Company Management System Setup"
echo "=================================="
echo ""

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed. Please install MySQL first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Database setup
echo "📦 Setting up database..."
echo "Please enter your MySQL root password:"
read -s MYSQL_PASSWORD

mysql -u root -p"$MYSQL_PASSWORD" < backend/config/database.sql

if [ $? -eq 0 ]; then
    echo "✅ Database created successfully"
else
    echo "❌ Database creation failed"
    exit 1
fi

# Backend setup
echo ""
echo "🔧 Setting up backend..."
cd backend

if [ ! -f .env ]; then
    cp .env.example .env
    echo "📝 Created .env file. Please update it with your credentials:"
    echo "   - DB_PASSWORD"
    echo "   - JWT_SECRET"
fi

npm install
if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Backend installation failed"
    exit 1
fi

cd ..

# Frontend setup
echo ""
echo "🎨 Setting up frontend..."
cd frontend

npm install
if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "❌ Frontend installation failed"
    exit 1
fi

cd ..

echo ""
echo "=================================="
echo "✅ Setup completed successfully!"
echo "=================================="
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your database password and JWT secret"
echo "2. Start backend:  cd backend && npm start"
echo "3. Start frontend: cd frontend && npm start"
echo "4. Open http://localhost:3000 in your browser"
echo "5. Login with username: admin, password: admin123"
echo ""
echo "For detailed instructions, see SETUP_GUIDE.md"
