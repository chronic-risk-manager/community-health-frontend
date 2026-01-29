
# Community Health Frontend

A React-based dashboard application for managing community health indicators, patient data, and follow-up tracking.

## Features

- **Dashboard**: View key performance indicators (KPIs) and health metrics with charts
- **Patient Management**: Create, view, and manage patient records
- **Health Indicators**: Track and record health indicators with a dedicated form
- **Follow-ups**: Monitor and manage patient follow-up appointments
- **Risk Assessment**: Display risk badges for patients based on health status
- **Responsive UI**: Clean sidebar navigation and organized layout

## Tech Stack

- **Framework**: React 18 with Vite
- **Styling**: CSS
- **Charts**: Data visualization components
- **Code Quality**: ESLint

## Project Structure

```
src/
├── components/
│   ├── charts/       # Bar and line chart components
│   ├── layout/       # Header and sidebar layout
│   └── ui/           # Reusable UI components (KPI cards, badges)
├── pages/            # Page components (Dashboard, Patients, Forms)
├── services/         # API integration (endpoints, requests)
├── data/             # Mock data for development
├── App.jsx           # Main app component
└── main.jsx          # Entry point
```

## Getting Started

1. Install dependencies:
    ```bash
    npm install
    ```

2. Start development server:
    ```bash
    npm run dev
    ```

3. Build for production:
    ```bash
    npm run build
    ```

## API Integration

API endpoints are configured in `src/services/endpoints.js`. Update the base URL as needed for your backend.
