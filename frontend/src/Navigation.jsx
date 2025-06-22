import { useState } from 'react';
import { useAuth } from './AuthContext';

function Navigation({ currentView, onViewChange }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
        </svg>
      )
    },
    { 
      id: 'compose', 
      label: 'Compose', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
        </svg>
      )
    },
    { 
      id: 'history', 
      label: 'History', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      )
    }
  ];

  return (
    <nav className="bg-white shadow-soft sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mr-3 shadow-soft">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">
                MailBlaster Pro
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth flex items-center ${
                    currentView === item.id
                      ? 'bg-blue-600 text-white shadow-soft'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* User Menu */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <div className="relative group">
                <button className="bg-gray-100 hover:bg-gray-200 rounded-lg p-2 text-gray-700 transition-smooth flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">
                      {user?.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="ml-2 text-sm font-medium">{user?.username}</span>
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-elegant border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-smooth">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                      Signed in as <strong className="text-gray-900">{user?.username}</strong>
                    </div>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-smooth"
                    >
                      <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-smooth"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-lg text-base font-medium transition-smooth ${
                  currentView === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
            
            {/* Mobile User Info */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="px-3 py-2 text-sm text-gray-500">
                Signed in as <strong className="text-gray-900">{user?.username}</strong>
              </div>
              <button
                onClick={logout}
                className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-smooth"
              >
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1"></path>
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navigation;
