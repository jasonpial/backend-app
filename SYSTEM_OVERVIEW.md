# System Overview - Company Management System

## 📋 Project Structure

```
/var/www/system/
├── backend/                    # Node.js + Express API
│   ├── config/
│   │   ├── database.js        # MySQL connection pool
│   │   └── database.sql       # Database schema & seed data
│   ├── controllers/           # Business logic
│   │   ├── authController.js
│   │   ├── employeeController.js
│   │   ├── attendanceController.js
│   │   ├── leaveController.js
│   │   ├── payrollController.js
│   │   ├── productController.js
│   │   ├── purchaseController.js
│   │   ├── salesController.js
│   │   ├── financeController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   └── auth.js            # JWT authentication & authorization
│   ├── routes/                # API routes
│   ├── server.js              # Express server
│   ├── package.json
│   └── .env.example
│
├── frontend/                   # React.js Application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.js      # Main layout with sidebar
│   │   ├── context/
│   │   │   └── AuthContext.js # Authentication state
│   │   ├── pages/             # All application pages
│   │   │   ├── Login.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Employees.js
│   │   │   ├── Attendance.js
│   │   │   ├── Leaves.js
│   │   │   ├── Payroll.js
│   │   │   ├── Products.js
│   │   │   ├── Purchases.js
│   │   │   ├── Sales.js
│   │   │   ├── Invoices.js
│   │   │   ├── Expenses.js
│   │   │   └── Analytics.js
│   │   ├── utils/
│   │   │   └── api.js         # Axios configuration
│   │   ├── App.js             # Main app component
│   │   ├── index.js
│   │   └── index.css          # Tailwind CSS
│   ├── package.json
│   └── tailwind.config.js
│
├── README.md                   # Main documentation
├── SETUP_GUIDE.md             # Quick setup instructions
├── SYSTEM_OVERVIEW.md         # This file
└── setup.sh                   # Automated setup script
```

## 🎯 Core Modules

### 1. Authentication & Authorization
**Features:**
- JWT-based authentication
- Role-based access control (RBAC)
- Secure password hashing with bcrypt
- Protected routes on both frontend and backend

**Roles:**
- **Admin**: Full system access
- **Manager**: Business operations
- **HR**: Human resources management
- **Finance**: Financial operations
- **Inventory**: Stock and order management
- **Employee**: Limited access (leaves, profile)

### 2. HR Management Module
**Features:**
- **Employee Records**: Complete employee database with personal details
- **Attendance Tracking**: Daily check-in/out with status management
- **Leave Management**: Request, approve/reject leave applications
- **Payroll Automation**: Calculate salaries with allowances and deductions

**Database Tables:**
- `employees`
- `attendance`
- `leaves`
- `payroll`

### 3. Inventory Management Module
**Features:**
- **Product Catalog**: Comprehensive product information
- **Stock Tracking**: Real-time stock levels with alerts
- **Purchase Orders**: Manage supplier orders
- **Sales Orders**: Track customer orders
- **Low Stock Alerts**: Automatic notifications

**Database Tables:**
- `products`
- `suppliers`
- `purchase_orders`
- `purchase_order_items`
- `sales_orders`
- `sales_order_items`
- `stock_transactions`

### 4. Finance Module
**Features:**
- **Invoice Management**: Create and track invoices
- **Payment Tracking**: Record and monitor payments
- **Expense Management**: Submit and approve expenses
- **Financial Reports**: Revenue and expense analysis

**Database Tables:**
- `invoices`
- `payments`
- `expenses`

### 5. Analytics & Reporting
**Features:**
- **Dashboard KPIs**: Key performance indicators
- **Sales Analytics**: Revenue trends and charts
- **HR Analytics**: Employee and attendance statistics
- **Financial Reports**: Profit/loss analysis
- **Interactive Charts**: Visual data representation

## 🔐 Security Features

### Authentication
- JWT tokens with expiration
- Secure HTTP-only token storage
- Password hashing with bcrypt (salt rounds: 10)
- Automatic token refresh

### Authorization
- Role-based access control
- Route-level permissions
- API endpoint protection
- Frontend route guards

### Database Security
- Parameterized queries (SQL injection prevention)
- Connection pooling
- Environment variable configuration
- Secure credential storage

## 🎨 Frontend Architecture

### Technology Stack
- **React 18**: Latest React features
- **React Router v6**: Client-side routing
- **Tailwind CSS**: Utility-first CSS
- **Axios**: HTTP client
- **Recharts**: Data visualization
- **Lucide React**: Modern icons
- **React Hot Toast**: Notifications

### Key Components
- **Layout**: Responsive sidebar navigation
- **PrivateRoute**: Protected route wrapper
- **AuthContext**: Global authentication state
- **Modal Forms**: Dynamic form modals
- **Data Tables**: Sortable, filterable tables
- **Charts**: Interactive data visualizations

### Design Patterns
- Context API for state management
- Custom hooks for reusability
- Component composition
- Protected routes
- Error boundaries

## 🔧 Backend Architecture

### Technology Stack
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MySQL2**: Database driver
- **JWT**: Authentication tokens
- **Bcrypt**: Password hashing
- **CORS**: Cross-origin resource sharing

### API Design
- RESTful architecture
- JSON request/response
- Proper HTTP status codes
- Error handling middleware
- Request validation

### Database Design
- Normalized schema (3NF)
- Foreign key relationships
- Indexes on frequently queried columns
- Transaction support
- Cascading deletes where appropriate

## 📊 Database Schema

### Core Tables
1. **users**: Authentication and user profiles
2. **employees**: Extended employee information
3. **attendance**: Daily attendance records
4. **leaves**: Leave requests and approvals
5. **payroll**: Salary calculations
6. **products**: Product inventory
7. **suppliers**: Supplier directory
8. **purchase_orders**: Purchase transactions
9. **sales_orders**: Sales transactions
10. **invoices**: Invoice records
11. **payments**: Payment history
12. **expenses**: Expense tracking
13. **stock_transactions**: Inventory movements

### Relationships
- Users → Employees (1:1)
- Employees → Attendance (1:N)
- Employees → Leaves (1:N)
- Employees → Payroll (1:N)
- Products → Purchase Order Items (1:N)
- Products → Sales Order Items (1:N)
- Sales Orders → Invoices (1:1)
- Invoices → Payments (1:N)

## 🚀 API Endpoints Summary

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/register` - Register user

### HR Module
- `/api/employees` - Employee CRUD
- `/api/attendance` - Attendance management
- `/api/leaves` - Leave requests
- `/api/payroll` - Payroll processing

### Inventory Module
- `/api/products` - Product catalog
- `/api/purchases` - Purchase orders
- `/api/sales` - Sales orders

### Finance Module
- `/api/finance/invoices` - Invoice management
- `/api/finance/payments` - Payment tracking
- `/api/finance/expenses` - Expense management

### Analytics
- `/api/analytics/dashboard` - Dashboard metrics
- `/api/analytics/sales` - Sales reports

## 💡 Key Features

### Dashboard
- Real-time statistics
- Quick access to all modules
- Low stock alerts
- Pending approvals
- Visual charts and graphs

### Responsive Design
- Mobile-friendly interface
- Tablet optimization
- Desktop full-screen layout
- Touch-friendly controls

### User Experience
- Intuitive navigation
- Search and filter
- Toast notifications
- Loading states
- Error handling
- Form validation

### Performance
- Connection pooling
- Efficient queries
- Lazy loading
- Code splitting
- Optimized assets

## 🔄 Workflow Examples

### Employee Onboarding
1. Admin creates user account
2. HR adds employee details
3. System generates employee code
4. Employee receives credentials
5. Employee logs in and updates profile

### Purchase Order Flow
1. Inventory manager creates PO
2. System checks available stock
3. PO sent to supplier
4. Stock received and marked
5. Inventory updated automatically
6. Transaction logged

### Leave Request Flow
1. Employee submits leave request
2. Manager/HR receives notification
3. Request approved or rejected
4. System updates leave balance
5. Attendance marked automatically
6. Email notification sent

### Sales Order Flow
1. Sales order created
2. Stock availability checked
3. Order confirmed
4. Stock deducted automatically
5. Invoice generated
6. Payment tracked

## 📈 Scalability Considerations

### Database
- Indexed columns for performance
- Archival strategy for old data
- Regular backup procedures
- Query optimization

### Backend
- Stateless API design
- Horizontal scaling ready
- Caching layer option
- Load balancing support

### Frontend
- Code splitting
- Lazy loading
- CDN for static assets
- Progressive Web App ready

## 🛠️ Customization Options

### Branding
- Update logo in Layout component
- Modify color scheme in tailwind.config.js
- Customize UI components

### Features
- Add new modules following existing pattern
- Extend database schema
- Create new API endpoints
- Add custom reports

### Integrations
- Email service (SendGrid, Mailgun)
- SMS notifications (Twilio)
- Payment gateways (Stripe, PayPal)
- Cloud storage (AWS S3)
- PDF generation (PDFKit)
- Excel export (ExcelJS)

## 📚 Best Practices Implemented

### Code Quality
- Consistent naming conventions
- Modular code structure
- Error handling
- Input validation
- Comments where needed

### Security
- Environment variables
- Input sanitization
- CORS configuration
- Rate limiting ready
- SQL injection prevention

### Performance
- Connection pooling
- Efficient queries
- Minimal re-renders
- Optimized images
- Lazy loading

## 🎓 Learning Resources

### Frontend
- React Documentation
- Tailwind CSS Docs
- React Router Guide

### Backend
- Express.js Guide
- MySQL Documentation
- JWT Best Practices

### Security
- OWASP Top 10
- Node.js Security
- JWT Security

## 🆘 Support & Maintenance

### Logs Location
- Backend: Console output
- Database: MySQL error logs
- Frontend: Browser console

### Monitoring
- Server uptime
- Database connections
- API response times
- Error rates

### Backup Strategy
- Daily database backups
- Code version control (Git)
- Environment configurations

---

**Built with ❤️ using React, Node.js, Express, and MySQL**
