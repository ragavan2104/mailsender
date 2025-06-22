import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './AuthContext';
import LoginPage from './LoginPage';
import Navigation from './Navigation';
import Dashboard from './Dashboard';
import EmailHistory from './EmailHistory';
import EmailComposer from './components/EmailComposer';
import LoadingSpinner from './components/LoadingSpinner';
import DebugUrls from './components/DebugUrls'; // Debug component

// Main App Component
function MainApp() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');

  // Listen for navigation events
  useEffect(() => {
    const handleNavigate = (event) => {
      setCurrentView(event.detail);
    };

    window.addEventListener('navigate', handleNavigate);
    return () => window.removeEventListener('navigate', handleNavigate);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading MailBlaster Pro...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'compose':
        return <EmailComposer />;
      case 'history':
        return <EmailHistory />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in">
          {renderCurrentView()}
        </div>
        <DebugUrls /> {/* Include debug component here */}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
