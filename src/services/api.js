import { API_BASE_URL, ENDPOINTS } from './endpoints';

// Helper to get headers with Auth token
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

/**
 * Registers a new user.
 */
export const registerUser = async (userData) => {
  try {
    const url = `${API_BASE_URL}${ENDPOINTS.REGISTER}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Registration failed');
    }
    return await response.json();
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
};

/**
 * Logs in a user and retrieves an access token.
 */
export const loginUser = async (username, password) => {
  try {
    const url = `${API_BASE_URL}${ENDPOINTS.LOGIN}`;
    
    // Construct form URL encoded body
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

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Login failed');
    }
    return await response.json();
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

/**
 * Fetches dashboard statistics.
 */
export const fetchDashboard = async () => {
  try {
    const url = `${API_BASE_URL}${ENDPOINTS.DASHBOARD}`;
    const response = await fetch(url, {
      headers: getHeaders()
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    throw error;
  }
};


/**
 * Fetches the list of patients from the backend.
 */
export const fetchPatients = async () => {
  try {
    const url = `${API_BASE_URL}${ENDPOINTS.PATIENTS_LIST}`;
    const response = await fetch(url, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
};

/**
 * Fetches details of a single patient.
 */
export const fetchPatientDetails = async (id) => {
  try {
    const url = `${API_BASE_URL}${ENDPOINTS.PATIENT_DETAIL(id)}`;
    const response = await fetch(url, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching patient ${id}:`, error);
    throw error;
  }
};

/**
 * Creates a new patient.
 */
export const createPatient = async (patientData) => {
  try {
    const url = `${API_BASE_URL}${ENDPOINTS.PATIENTS_LIST}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(patientData)
    });
    if (!response.ok) throw new Error(`Failed to create patient`);
    return await response.json();
  } catch (error) {
    console.error('Error creating patient:', error);
    throw error;
  }
};

/**
 * Updates an existing patient.
 */
export const updatePatient = async (id, patientData) => {
  try {
    const url = `${API_BASE_URL}${ENDPOINTS.PATIENT_DETAIL(id)}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(patientData)
    });
    if (!response.ok) throw new Error(`Failed to update patient`);
    return await response.json();
  } catch (error) {
    console.error(`Error updating patient ${id}:`, error);
    throw error;
  }
};

/**
 * Creates a new health indicator record (BP, Glucose).
 */
export const createIndicator = async (indicatorData) => {
  try {
    const url = `${API_BASE_URL}${ENDPOINTS.INDICATORS}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(indicatorData)
    });

    if (!response.ok) throw new Error(`Failed to create indicator`);
    return await response.json();
  } catch (error) {
    console.error('Error creating indicator:', error);
    throw error;
  }
};


/**
 * Fetches current logged-in user.
 */
export const getCurrentUser = async () => {
  try {
    const url = `${API_BASE_URL}${ENDPOINTS.ME}`;
    const response = await fetch(url, {
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};
