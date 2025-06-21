import { useState, useEffect } from 'react'
import './App.css'
import { AuthProvider, useAuth } from './AuthContext';
import LoginPage from './LoginPage';
import Navigation from './Navigation';
import Dashboard from './Dashboard';
import EmailHistory from './EmailHistory';
import EmailComposer from './components/EmailComposer';
import LoadingSpinner from './components/LoadingSpinner';
import AnimatedBackground from './components/AnimatedBackground';

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-float opacity-40"></div>
        <div className="absolute top-40 right-1/3 w-1 h-1 bg-pink-400 rounded-full animate-float opacity-60" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-1/3 w-3 h-3 bg-blue-400 rounded-full animate-float opacity-30" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <Navigation currentView={currentView} onViewChange={setCurrentView} />
        <main className="px-4 py-8">
          {renderCurrentView()}
        </main>
      </div>
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
