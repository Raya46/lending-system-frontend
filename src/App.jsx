import { useState } from "react";
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminHistoryLog from './pages/AdminHistoryLog.jsx';
import AdminClassLog from './pages/AdminClassLog.jsx';

import AdminInventory from './pages/AdminInventory.jsx';

const InventoryApp = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminSection, setAdminSection] = useState('dashboard');

  // PNJ Logo Component
  const PNJLogo = () => (
    <>
      <img
        src="./src/assets/PEENJE.png"
        className="w-1000 h-1000 md:w-100 md:h-100 items-center justify-center"
      />
    </>
  );

  // Inventory Icon
  const InventoryIcon = () => (
    <>
      <img
        src="./src/assets/PEENJE.png"
        className="w-10 h-10 md:w-18 md:h-18 object-contain mx-auto"
      />
    </>
  );

  // Landing Page
  const LandingPage = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-8">
      <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-16 lg:space-x-24 max-w-4xl w-full">
        <div className="flex-shrink-0">
          <PNJLogo />
        </div>

        <div className="text-center w-full md:w-auto">
          <InventoryIcon />
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
            Inventory System
          </h1>
          <p className="text-gray-600 mb-6 md:mb-8">What's your purpose?</p>

          <div className="space-y-3 w-full max-w-xs mx-auto md:w-64">
            <button
              onClick={() => setCurrentView("borrow")}
              className="w-full py-3 px-6 text-white rounded-md hover:opacity-90 transition-all font-medium"
              style={{ backgroundColor: "#048494" }}
            >
              Borrow
            </button>
            <button
              onClick={() => setCurrentView("login")}
              className="w-full py-3 px-6 rounded-md hover:opacity-90 transition-all font-medium"
              style={{ backgroundColor: "#eae9e5", color: "#212122" }}
            >
              Login Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Login Page
  const LoginPage = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-8">
      <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-16 lg:space-x-24 max-w-4xl w-full">
        <div className="flex-shrink-0">
          <PNJLogo />
        </div>

        <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-200 w-full max-w-sm md:max-w-md">
          <div className="flex items-center justify-between mb-6">
            <div></div>
            <button
              onClick={() => setCurrentView("landing")}
              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <div className="text-center mb-6">
            <InventoryIcon />
            <h1 className="text-lg md:text-xl font-semibold text-gray-900 mb-1">
              Log in to your account
            </h1>
            <p className="text-sm text-gray-600">
              Welcome back! Please enter your details.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">
                Email
              </div>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">
                Password
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" className="w-4 h-4 rounded" />
              <span className="text-sm text-gray-600">
                Remember for 30 days
              </span>
            </div>

            <button
              onClick={() => {
                setIsLoggedIn(true);
                setCurrentView('admin');
                setAdminSection('dashboard');
              }}
              className="w-full py-3 text-white rounded-md hover:opacity-90 transition-all font-medium"
              style={{ backgroundColor: '#048494' }}
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Borrow Modal
  const BorrowModal = () => (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-sm md:max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">
              Borrow
            </h2>
            <button
              onClick={() => setCurrentView("landing")}
              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Name</div>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">
                Student ID
              </div>
              <input
                type="text"
                placeholder="Enter your ID number"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">
                Lecturer name
              </div>
              <input
                type="text"
                placeholder="Enter Lecturer name"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">
                Room number
              </div>
              <input
                type="text"
                placeholder="Enter room number"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">
                Start in
              </div>
              <input
                type="datetime-local"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">
                Return in
              </div>
              <input
                type="datetime-local"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
              <button
                onClick={() => setCurrentView("landing")}
                className="w-full sm:flex-1 py-2.5 px-4 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium"
                style={{ backgroundColor: "#eae9e5", color: "#212122" }}
              >
                Discard
              </button>
              <button
                onClick={() =>
                  alert("Borrow request - connect to your backend!")
                }
                className="w-full sm:flex-1 py-2.5 px-4 text-white rounded-md hover:opacity-90 transition-all font-medium"
                style={{ backgroundColor: "#048494" }}
              >
                Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Main render logic
  const renderView = () => {
    if (isLoggedIn && currentView === 'admin') {
      switch (adminSection) {
        case 'dashboard':
        default:
          return <AdminDashboard onNavigate={setAdminSection} currentSection={adminSection} />;
        case 'history':
          return <AdminHistoryLog onNavigate={setAdminSection} currentSection={adminSection} />;
        case 'class':
          return <AdminClassLog onNavigate={setAdminSection} currentSection={adminSection} />;
        case 'inventory':
          return <AdminInventory onNavigate={setAdminSection} currentSection={adminSection} />;
      }
    }
    if (currentView === 'login') {
      return <LoginPage />;
    }
    if (currentView === 'borrow') {
      return (
        <>
          <LandingPage />
          <BorrowModal />
        </>
      );
    }
    return <LandingPage />;
  };

  return <div className="font-sans">{renderView()}</div>;
};

export default InventoryApp;