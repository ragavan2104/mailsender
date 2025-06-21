// API Configuration - Updated for Vercel deployment
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/login`,
  REGISTER: `${API_BASE_URL}/register`,
  ME: `${API_BASE_URL}/me`,
  SEND_MAIL: `${API_BASE_URL}/sendmail`,
  EMAIL_HISTORY: `${API_BASE_URL}/email-history`,
  DASHBOARD_STATS: `${API_BASE_URL}/dashboard-stats`
};

export default API_BASE_URL;
