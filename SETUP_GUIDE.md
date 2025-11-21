# Quick Setup Guide

## Step-by-Step Installation

### 1️⃣ Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Run the SQL script to create database and tables
source /var/www/system/backend/config/database.sql

# Verify the database was created
SHOW DATABASES;
USE management_system;
SHOW TABLES;
```

### 2️⃣ Backend Setup

```bash
# Navigate to backend directory
cd /var/www/system/backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit the .env file with your credentials
nano .env
```

**Update these values in `.env`:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=management_system
JWT_SECRET=your_random_secret_key_here
```

**Start the backend server:**
```bash
npm start
# or for development with auto-reload
npm run dev
```

Backend should now be running on **http://localhost:5000**

### 3️⃣ Frontend Setup

```bash
# Open a new terminal
# Navigate to frontend directory
cd /var/www/system/frontend

# Install dependencies
npm install

# Start the development server
npm start
```

Frontend should now be running on **http://localhost:3000**

### 4️⃣ Access the Application

Open your browser and go to: **http://localhost:3000**

**Login Credentials:**
- Username: `admin`
- Password: `admin123`

## 🎯 Default User Accounts

| Username | Password | Role | Access |
|----------|----------|------|--------|
| admin | admin123 | Admin | Full system access |
| hr_manager | admin123 | HR | HR modules |
| finance_manager | admin123 | Finance | Finance modules |
| inventory_manager | admin123 | Inventory | Inventory modules |

## 🔍 Verify Installation

### Backend Health Check
```bash
curl http://localhost:5000/api/health
```

Should return: `{"success":true,"message":"Server is running"}`

### Database Connection
Check backend terminal for:
```
✅ Database connected successfully
🚀 Server running on port 5000
```

## 🚨 Troubleshooting

### Backend won't start
- Check if MySQL is running: `sudo service mysql status`
- Verify database credentials in `.env`
- Check if port 5000 is available: `lsof -i :5000`

### Frontend won't start
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Check if port 3000 is available: `lsof -i :3000`

### Database connection error
```bash
# Restart MySQL service
sudo service mysql restart

# Login and check user privileges
mysql -u root -p
SHOW GRANTS FOR 'root'@'localhost';
```

### "Cannot connect to backend" error
- Verify backend is running on port 5000
- Check CORS settings in backend
- Verify `proxy` in frontend/package.json

## 📦 Production Deployment

### Backend Production
```bash
cd backend
# Set environment to production in .env
NODE_ENV=production
# Use PM2 for process management
npm install -g pm2
pm2 start server.js --name management-backend
```

### Frontend Production
```bash
cd frontend
npm run build
# Serve the build folder with nginx or apache
```

## 🔐 Security Checklist

- [ ] Change default JWT_SECRET
- [ ] Change all default passwords
- [ ] Enable HTTPS in production
- [ ] Configure firewall rules
- [ ] Set up database backups
- [ ] Enable MySQL authentication
- [ ] Review and set CORS_ORIGIN

## 📊 Testing the System

### Test Employee Module
1. Login as admin
2. Go to Employees
3. Click "Add Employee"
4. Fill in the form and submit

### Test Products Module
1. Go to Products
2. Click "Add Product"
3. Add a sample product
4. Verify it appears in the list

### Test Dashboard
1. Navigate to Dashboard
2. Verify statistics are displayed
3. Check charts are rendering

## 🆘 Need Help?

Check the logs:
- Backend: Terminal where backend is running
- Frontend: Browser console (F12)
- MySQL: `/var/log/mysql/error.log`

## 🎉 Success!

If everything is working:
- ✅ Backend running on port 5000
- ✅ Frontend running on port 3000
- ✅ Database connected
- ✅ Can login with admin account
- ✅ Dashboard loads with data

Your Company Management System is ready to use!
