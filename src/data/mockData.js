const MOCK_PATIENTS = [
  { id: 1, name: "Robert Fox", age: 64, gender: "Male", condition: "Hypertension", risk: "High", lastVisit: "2023-10-15", nextFollowUp: "2023-10-30", bp: [140, 145, 142, 150, 155, 160], glucose: [95, 98, 102, 99, 105, 110], status: "Critical Alert" },
  { id: 2, name: "Jane Cooper", age: 58, gender: "Female", condition: "Type 2 Diabetes", risk: "Medium", lastVisit: "2023-09-20", nextFollowUp: "2023-11-05", bp: [128, 130, 129, 132, 130, 135], glucose: [140, 145, 138, 150, 160, 155], status: "Monitoring" },
  { id: 3, name: "Guy Hawkins", age: 71, gender: "Male", condition: "COPD", risk: "Low", lastVisit: "2023-10-01", nextFollowUp: "2024-01-15", bp: [120, 122, 118, 120, 121, 119], glucose: [90, 92, 91, 89, 93, 90], status: "Stable" },
  { id: 4, name: "Eleanor Pena", age: 66, gender: "Female", condition: "Arthritis", risk: "Low", lastVisit: "2023-08-12", nextFollowUp: "2024-02-10", bp: [115, 118, 116, 120, 119, 118], glucose: [88, 90, 89, 85, 87, 88], status: "Stable" },
  { id: 5, name: "Albert Flores", age: 52, gender: "Male", condition: "Hypertension", risk: "Medium", lastVisit: "2023-10-10", nextFollowUp: "2023-11-01", bp: [135, 138, 136, 140, 139, 142], glucose: [100, 105, 102, 108, 106, 110], status: "Medication Change" },
  { id: 6, name: "Theresa Webb", age: 49, gender: "Female", condition: "Asthma", risk: "High", lastVisit: "2023-10-18", nextFollowUp: "2023-10-25", bp: [125, 128, 130, 129, 132, 135], glucose: [92, 94, 95, 93, 96, 98], status: "Exacerbation" },
];

const FOLLOW_UPS = [
  { id: 101, patientId: 1, name: "Robert Fox", type: "Urgent Review", date: "2023-10-24", status: "Overdue" },
  { id: 102, patientId: 6, name: "Theresa Webb", type: "Routine Check", date: "2023-10-25", status: "Pending" },
  { id: 103, patientId: 2, name: "Jane Cooper", type: "Lab Results", date: "2023-10-26", status: "Pending" },
  { id: 104, patientId: 5, name: "Albert Flores", type: "Medication Review", date: "2023-10-22", status: "Completed" },
];

const KPI_DATA = {
  totalPatients: 124,
  highRisk: 12,
  dueFollowUps: 8,
  activeAlerts: 5
};

export { MOCK_PATIENTS, FOLLOW_UPS, KPI_DATA };