# Company Management System

A comprehensive web-based management system for companies with modules for HR, Inventory, Finance, and Analytics.

## 🚀 Features

### General Features
- ✅ User login & role-based access control
- ✅ Interactive dashboard with analytics
- ✅ MySQL database for storing records
- ✅ Modern, responsive UI with Tailwind CSS

### HR Management
- ✅ Employee records management
- ✅ Attendance tracking
- ✅ Payroll automation
- ✅ Leave management

### Inventory Management
- ✅ Product catalog
- ✅ Stock level monitoring with alerts
- ✅ Purchase order management
- ✅ Sales order tracking
- ✅ Supplier management

### Finance
- ✅ Invoice management
- ✅ Payment tracking
- ✅ Expense management with approval workflow
- ✅ Financial reports

### Analytics
- ✅ KPI dashboards
- ✅ Sales analytics with charts
- ✅ Financial analytics
- ✅ HR analytics

## 🛠️ Tech Stack

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js with Express
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Charts**: Recharts
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## 🔧 Installation

### 1. Clone the repository
```bash
cd /var/www/system
```

### 2. Set up the database
```bash
# Login to MySQL
mysql -u root -p

# Create database and import schema
mysql -u root -p < backend/config/database.sql
```

### 3. Configure Backend
```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your database credentials
nano .env
```

Update the `.env` file with your MySQL credentials:
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=management_system
DB_PORT=3306

JWT_SECRET=your_secret_key_change_this
JWT_EXPIRE=7d

CORS_ORIGIN=http://localhost:3000
```

### 4. Configure Frontend
```bash
cd ../frontend

# Install dependencies
npm install
```

## 🚀 Running the Application

### Start Backend Server
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

### Start Frontend Development Server
```bash
cd frontend
npm start
# Application runs on http://localhost:3000
```

## 👥 Default Users

The system comes with pre-configured demo users:

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | Admin |
| hr_manager | admin123 | HR Manager |
| finance_manager | admin123 | Finance Manager |
| inventory_manager | admin123 | Inventory Manager |

## 📱 User Roles & Permissions

### Admin
- Full access to all modules
- User management
- System configuration

### Manager
- Dashboard access
- Employee management
- Leave approvals
- Sales orders
- Analytics

### HR
- Employee records
- Attendance tracking
- Leave management
- Payroll processing

### Finance
- Invoice management
- Payment tracking
- Expense approval
- Financial reports

### Inventory
- Product management
- Purchase orders
- Sales orders
- Stock management

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/register` - Register new user (Admin only)

### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create employee
- `GET /api/employees/:id` - Get employee details
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Attendance
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance` - Mark attendance
- `PUT /api/attendance/:id` - Update attendance

### Leaves
- `GET /api/leaves` - Get leave requests
- `POST /api/leaves` - Create leave request
- `PUT /api/leaves/:id` - Approve/reject leave

### Payroll
- `GET /api/payroll` - Get payroll records
- `POST /api/payroll` - Create payroll
- `PUT /api/payroll/:id` - Update payroll

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `GET /api/products/:id` - Get product details
- `PUT /api/products/:id` - Update product
- `GET /api/products/alerts/low-stock` - Get low stock alerts

### Purchases
- `GET /api/purchases` - Get purchase orders
- `POST /api/purchases` - Create purchase order
- `GET /api/purchases/:id` - Get purchase order details
- `PUT /api/purchases/:id/receive` - Receive purchase order

### Sales
- `GET /api/sales` - Get sales orders
- `POST /api/sales` - Create sales order
- `GET /api/sales/:id` - Get sales order details
- `PUT /api/sales/:id` - Update sales order

### Finance
- `GET /api/finance/invoices` - Get invoices
- `POST /api/finance/invoices` - Create invoice
- `GET /api/finance/payments` - Get payments
- `POST /api/finance/payments` - Record payment
- `GET /api/finance/expenses` - Get expenses
- `POST /api/finance/expenses` - Create expense
- `PUT /api/finance/expenses/:id` - Update expense status

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard analytics
- `GET /api/analytics/sales` - Get sales analytics

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Protected API routes
- SQL injection prevention with parameterized queries

## 🎨 UI Features

- Responsive design (mobile, tablet, desktop)
- Modern sidebar navigation
- Interactive charts and graphs
- Toast notifications
- Modal forms
- Search and filter functionality
- Status badges
- Loading states

## 📦 Production Build

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
# Build files will be in the 'build' directory
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

MIT License

## 📧 Support

For support, please contact your system administrator.

## 🔄 Future Enhancements

- [ ] PDF/Excel export for reports
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Mobile app
- [ ] Document management
- [ ] Task management
- [ ] Performance reviews
- [ ] Customer portal
"# backend-app" 
