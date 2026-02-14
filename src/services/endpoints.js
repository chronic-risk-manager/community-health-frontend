// Base URL for your local backend
export const API_BASE_URL = 'http://127.0.0.1:8000';

// Centralized list of all API endpoints
export const ENDPOINTS = {
  PATIENTS_LIST: '/patients/',
  // Helper function for dynamic URLs
  PATIENT_DETAIL: (id) => `/patients/${id}/`,
  INDICATORS: '/indicators/',
  LOGIN: '/token',
  REGISTER: '/users/',
  DASHBOARD: '/dashboard/',
  ME: '/users/me',
};