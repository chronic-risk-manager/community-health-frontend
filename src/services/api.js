import { API_BASE_URL, ENDPOINTS } from './endpoints';

/**
 * Fetches the list of patients from the backend.
 */
export const fetchPatients = async () => {
  try {
    const url = `${API_BASE_URL}${ENDPOINTS.PATIENTS_LIST}`;
    const response = await fetch(url);
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
    const response = await fetch(url);
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
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
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
 * @param {Object} indicatorData - { blood_pressure_sys, blood_pressure_dia, glucose, patient_id }
 */
export const createIndicator = async (indicatorData) => {
  try {
    const url = `${API_BASE_URL}${ENDPOINTS.INDICATORS}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(indicatorData)
    });

    if (!response.ok) throw new Error(`Failed to create indicator`);
    return await response.json();
  } catch (error) {
    console.error('Error creating indicator:', error);
    throw error;
  }
};