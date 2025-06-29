// API Configuration - Updated for Vercel deployment
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Remove trailing slash from base URL if it exists, then add proper paths
const cleanBaseUrl = API_BASE_URL.replace(/\/$/, '');

export const API_ENDPOINTS = {
  LOGIN: `${cleanBaseUrl}/login`,
  REGISTER: `${cleanBaseUrl}/register`,
  ME: `${cleanBaseUrl}/me`,
  SEND_MAIL: `${cleanBaseUrl}/sendmail`,
  EMAIL_HISTORY: `${cleanBaseUrl}/email-history`,
  DASHBOARD_STATS: `${cleanBaseUrl}/dashboard-stats`
};

export default cleanBaseUrl;
