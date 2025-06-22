import { API_ENDPOINTS } from '../config/api.js';

const DebugUrls = () => {
  const rawApiUrl = import.meta.env.VITE_API_URL;
  const cleanedApiUrl = rawApiUrl?.replace(/\/$/, '');
  
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
      <p style={{color: API_ENDPOINTS.REGISTER.includes('//') ? 'red' : 'green'}}>
        <strong>Double Slash Check:</strong> {API_ENDPOINTS.REGISTER.includes('//') ? '❌ FOUND' : '✅ CLEAN'}
      </p>
    </div>
  );
};

export default DebugUrls;
