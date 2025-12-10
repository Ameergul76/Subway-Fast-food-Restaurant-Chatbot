import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import OrderList from './components/OrderList';
import AnalyticsPage from './components/AnalyticsPage';
import MenuPage from './components/MenuPage';
import ChatInterface from './components/ChatInterface';
import AboutPage from './components/AboutPage';

function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Dashboard Header with Image */}
      <div className="relative bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl overflow-hidden shadow-lg">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200"
            alt="Restaurant"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative p-8 text-white">
          <h1 className="text-3xl font-bold">🥪 Subway Fast Food Dashboard</h1>
          <p className="text-emerald-100 mt-2">Manage your orders and track your business</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
          <div className="bg-emerald-100 p-3 rounded-full">
            <span className="text-2xl">📋</span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Active Orders</p>
            <p className="text-xl font-bold text-emerald-600">View Below</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <span className="text-2xl">👨‍🍳</span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Kitchen Status</p>
            <p className="text-xl font-bold text-blue-600">Ready</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
          <div className="bg-amber-100 p-3 rounded-full">
            <span className="text-2xl">⏰</span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Avg. Prep Time</p>
            <p className="text-xl font-bold text-amber-600">15 mins</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-full">
            <span className="text-2xl">✅</span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Today</p>
            <p className="text-xl font-bold text-green-600">Open</p>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <OrderList />
    </div>
  );
}

function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '🏠' },
    { path: '/about', label: 'About Us', icon: '📖' },
    { path: '/menu', label: 'Order Manually', icon: '🍽️' },
    { path: '/analytics', label: 'Analytics', icon: '📊' },
    { path: '/chat', label: 'Customer Chat', icon: '💬' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-emerald-600 text-white p-2 rounded-md shadow-lg"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-gradient-to-b from-emerald-600 to-green-700 text-white transition-transform duration-300 z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 w-64 shadow-xl`}>
        {/* Logo/Header */}
        <div className="p-6 border-b border-emerald-500/50">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-lg shadow-lg">
              <span className="text-2xl">🥪</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Subway</h1>
              <p className="text-emerald-200 text-xs">Fast Food Restaurant</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="mt-6 px-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-all duration-200 ${isActive(item.path)
                ? 'bg-white/20 shadow-md backdrop-blur-sm'
                : 'hover:bg-white/10'
                }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Restaurant Image */}
        <div className="px-3 mt-6">
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400"
              alt="Fresh Sandwich"
              className="w-full h-32 object-cover opacity-90"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-emerald-500/50">
          <div className="text-emerald-100 text-xs text-center">
            <p>🥪 Subway Fast Food</p>
            <p className="mt-1">AI-Powered Ordering</p>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex">
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/chat" element={<ChatInterface />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
