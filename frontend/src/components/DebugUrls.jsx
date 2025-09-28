import { API_ENDPOINTS } from '../config/api.js';

const DebugUrls = () => {
  const rawApiUrl = import.meta.env.VITE_API_URL;
  const cleanedApiUrl = rawApiUrl?.replace(/\/$/, '');
  
  // Check for double slashes in the path part (not the protocol part)
  const hasDoubleSlash = (url) => {
    if (!url) return false;
    // Replace the protocol part and check for double slashes in the path
    const pathPart = url.replace(/^https?:\/\//, '');
    return pathPart.includes('//');
  };
  
  const doubleSlashFound = hasDoubleSlash(API_ENDPOINTS.REGISTER);
  
  // Test endpoint connectivity
  const testEndpoint = async (url, method = 'GET', body = null) => {
    try {
      const options = { 
        method,
        headers: {
          'Content-Type': 'application/json',
        }
      };
      
      if (body) {
        options.body = JSON.stringify(body);
      }
      
      console.log(`Testing ${method} ${url}`, options);
      const response = await fetch(url, options);
      const data = await response.json();
      console.log(`${method} ${url}:`, response.status, data);
      return { status: response.status, data };
    } catch (error) {
      console.error(`${method} ${url} failed:`, error);
      return { error: error.message };
    }
  };
  
  const handleTestRegister = () => {
    testEndpoint(API_ENDPOINTS.REGISTER, 'POST', {
      username: 'debugtest',
      password: 'debugtest123',
      email: 'debugtest@example.com'
    });
  };
  
  const handleTestHealth = () => {
    testEndpoint(`${cleanedApiUrl}/health`, 'GET');
  };
  
  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'black',
      color: 'white',
      padding: '10px',
      fontSize: '12px',
      maxWidth: '400px',
      zIndex: 9999,
      borderRadius: '4px'
    }}>
      <h4>🐛 Debug URLs:</h4>
      <p><strong>Raw VITE_API_URL:</strong> {rawApiUrl}</p>
      <p><strong>Cleaned Base URL:</strong> {cleanedApiUrl}</p>
      <p><strong>Environment:</strong> {import.meta.env.MODE}</p>
      <p><strong>REGISTER Endpoint:</strong> {API_ENDPOINTS.REGISTER}</p>
      <p><strong>LOGIN Endpoint:</strong> {API_ENDPOINTS.LOGIN}</p>
      <p style={{color: doubleSlashFound ? 'red' : 'green'}}>
        <strong>Double Slash Check:</strong> {doubleSlashFound ? '❌ FOUND' : '✅ CLEAN'}
      </p>
      <div style={{marginTop: '10px'}}>
        <button 
          onClick={handleTestHealth}
          style={{marginRight: '5px', padding: '2px 8px', fontSize: '10px'}}
        >
          Test Health
        </button>
        <button 
          onClick={handleTestRegister}
          style={{padding: '2px 8px', fontSize: '10px'}}
        >
          Test Register
        </button>
      </div>
      <p style={{fontSize: '10px', marginTop: '5px', color: '#888'}}>
        Check browser console for test results
      </p>
    </div>
  );
};

export default DebugUrls;
