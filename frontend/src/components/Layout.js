import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, Users, Calendar, DollarSign, Package, 
  ShoppingCart, FileText, BarChart3, LogOut, Menu, X 
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['admin', 'manager', 'hr', 'finance', 'inventory'] },
    { name: 'Employees', path: '/employees', icon: Users, roles: ['admin', 'hr', 'manager'] },
    { name: 'Attendance', path: '/attendance', icon: Calendar, roles: ['admin', 'hr'] },
    { name: 'Leaves', path: '/leaves', icon: Calendar, roles: ['admin', 'hr', 'manager', 'employee'] },
    { name: 'Payroll', path: '/payroll', icon: DollarSign, roles: ['admin', 'hr', 'finance'] },
    { name: 'Products', path: '/products', icon: Package, roles: ['admin', 'inventory'] },
    { name: 'Purchases', path: '/purchases', icon: ShoppingCart, roles: ['admin', 'inventory'] },
    { name: 'Sales', path: '/sales', icon: ShoppingCart, roles: ['admin', 'inventory', 'manager'] },
    { name: 'Invoices', path: '/invoices', icon: FileText, roles: ['admin', 'finance'] },
    { name: 'Expenses', path: '/expenses', icon: DollarSign, roles: ['admin', 'finance', 'manager'] },
    { name: 'Analytics', path: '/analytics', icon: BarChart3, roles: ['admin', 'manager'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(user?.role));

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold">Management System</h1>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X size={24} />
          </button>
        </div>
        
        <nav className="p-4 space-y-2">
          {filteredMenu.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-primary-600' : 'hover:bg-gray-800'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
              <Menu size={24} />
            </button>
            
            <div className="flex items-center space-x-4 ml-auto">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
