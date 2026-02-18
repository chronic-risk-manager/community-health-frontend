import { API_BASE_URL, ENDPOINTS } from './endpoints';

/* ===============================
   Helper: Get Headers
================================= */
const getHeaders = (isJson = true) => {
  const token = localStorage.getItem('token');
  const headers = {};

  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/* ===============================
   Global Response Handler
================================= */
const handleResponse = async (response) => {
  if (response.status === 401) {
    // 🚨 Token expired
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Redirect to login page
    window.location.href = '/login?expired=true';
    return;
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || `HTTP error! status: ${response.status}`
    );
  }

  return response.json();
};

/* ===============================
   AUTH
================================= */

export const registerUser = async (userData) => {
  const url = `${API_BASE_URL}${ENDPOINTS.REGISTER}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });

  return handleResponse(response);
};

export const loginUser = async (username, password) => {
  const url = `${API_BASE_URL}${ENDPOINTS.LOGIN}`;

  const formBody = new URLSearchParams();
  formBody.append('grant_type', 'password');
  formBody.append('username', username);
  formBody.append('password', password);
  formBody.append('scope', '');
  formBody.append('client_id', '');
  formBody.append('client_secret', '');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formBody.toString()
  });

  return handleResponse(response);
};

export const getCurrentUser = async () => {
  const url = `${API_BASE_URL}${ENDPOINTS.ME}`;

  const response = await fetch(url, {
    headers: getHeaders()
  });

  return handleResponse(response);
};

/* ===============================
   DASHBOARD
================================= */

export const fetchDashboard = async () => {
  const url = `${API_BASE_URL}${ENDPOINTS.DASHBOARD}`;
  const response = await fetch(url, {
    headers: getHeaders()
  });

  return handleResponse(response);
};

/* ===============================
   PATIENTS
================================= */

export const fetchPatients = async () => {
  const url = `${API_BASE_URL}${ENDPOINTS.PATIENTS_LIST}`;
  const response = await fetch(url, {
    headers: getHeaders()
  });

  return handleResponse(response);
};

export const fetchPatientDetails = async (id) => {
  const url = `${API_BASE_URL}${ENDPOINTS.PATIENT_DETAIL(id)}`;
  const response = await fetch(url, {
    headers: getHeaders()
  });

  return handleResponse(response);
};

export const createPatient = async (patientData) => {
  const url = `${API_BASE_URL}${ENDPOINTS.PATIENTS_LIST}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(patientData)
  });

  return handleResponse(response);
};

export const updatePatient = async (id, patientData) => {
  const url = `${API_BASE_URL}${ENDPOINTS.PATIENT_DETAIL(id)}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(patientData)
  });

  return handleResponse(response);
};

/* ===============================
   INDICATORS
================================= */

export const createIndicator = async (indicatorData) => {
  const url = `${API_BASE_URL}${ENDPOINTS.INDICATORS}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(indicatorData)
  });

  return handleResponse(response);
};

/* ===============================
   FOLLOW UPS
================================= */

export const fetchFollowUps = async (filters = {}) => {
  const params = new URLSearchParams();

  Object.keys(filters).forEach(key => {
    if (filters[key] && filters[key] !== 'All') {
      params.append(key, filters[key]);
    }
  });

  const queryString = params.toString();
  const url = `${API_BASE_URL}${ENDPOINTS.FOLLOWUPS}${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    headers: getHeaders()
  });

  return handleResponse(response);
};

export const updateFollowUp = async (id, data) => {
  const url = `${API_BASE_URL}${ENDPOINTS.FOLLOWUP_DETAIL(id)}`;
  const response = await fetch(url, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });

  return handleResponse(response);
};
