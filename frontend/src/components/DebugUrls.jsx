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
      <p><strong>REGISTER Endpoint:</strong> {API_ENDPOINTS.REGISTER}</p>
      <p><strong>LOGIN Endpoint:</strong> {API_ENDPOINTS.LOGIN}</p>
      <p style={{color: doubleSlashFound ? 'red' : 'green'}}>
        <strong>Double Slash Check:</strong> {doubleSlashFound ? '❌ FOUND' : '✅ CLEAN'}
      </p>
    </div>
  );
};

export default DebugUrls;
