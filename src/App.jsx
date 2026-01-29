import { useState, useMemo } from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom'

import DashboardPage from './pages/DashboardPage'
import PatientsPage from './pages/PatientsPage'
import PatientDetailPage from './pages/PatientDetailPage'
import PatientFormPage from './pages/PatientFormPage'
import IndicatorFormPage from './pages/IndicatorFormPage' // Import the new page
import FollowUpsPage from './pages/FollowUpsPage'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'

// Wrapper to handle route parameters for Patient Details
const PatientDetailRoute = ({ navigate }) => {
  const { id } = useParams()
  return <PatientDetailPage patientId={id} navigate={navigate} /> // Added navigate prop here
}

// Wrapper for Patient Form
const PatientFormRoute = ({ navigate }) => {
  const { id } = useParams()
  return <PatientFormPage patientId={id} navigate={navigate} />
}

// Wrapper for Indicator Form
const IndicatorFormRoute = ({ navigate }) => {
  const { id } = useParams()
  return <IndicatorFormPage patientId={id} navigate={navigate} />
}

const AppContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const routerNavigate = useNavigate()

  const navigate = (view, id) => {
    setSidebarOpen(false)
    switch (view) {
      case 'dashboard':
        routerNavigate('/')
        break
      case 'patients':
        routerNavigate('/patients')
        break
      case 'create-patient':
        routerNavigate('/patients/new')
        break
      case 'edit-patient':
        routerNavigate(`/patients/edit/${id}`)
        break
      case 'patient-detail':
        routerNavigate(`/patients/${id}`)
        break
      case 'add-indicator': // New case for navigation
        routerNavigate(`/patients/${id}/indicators/new`)
        break
      case 'follow-ups':
        routerNavigate('/followup')
        break
      default:
        routerNavigate('/')
    }
  }

  const currentView = useMemo(() => {
    const path = location.pathname
    if (path === '/') return 'dashboard'
    if (path === '/patients') return 'patients'
    if (path.startsWith('/patients/new') || path.startsWith('/patients/edit')) return 'patients'
    // Ensure detail view is active for indicator form too
    if (path.startsWith('/patients/')) return 'patient-detail'
    if (path.startsWith('/followup')) return 'follow-ups'
    return 'dashboard'
  }, [location.pathname])

  const title = useMemo(() => {
    switch (currentView) {
      case 'dashboard': return 'Dashboard'
      case 'patients': return 'Patients'
      case 'patient-detail': return 'Patient Profile'
      case 'follow-ups': return 'Follow-ups'
      default: return 'Dashboard'
    }
  }, [currentView])

  return (
    <div className="flex h-screen">
      <Sidebar
        currentView={currentView}
        navigate={navigate}
        isOpen={sidebarOpen}
        close={() => setSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col">
        <Header title={title} openSidebar={() => setSidebarOpen(true)} />
        <div className="flex-1 overflow-auto p-6">
          <Routes>
            <Route path="/" element={<DashboardPage navigate={navigate} />} />
            <Route path="/patients" element={<PatientsPage navigate={navigate} />} />
            <Route path="/patients/new" element={<PatientFormPage navigate={navigate} />} />
            <Route path="/patients/edit/:id" element={<PatientFormRoute navigate={navigate} />} />
            <Route path="/patients/:id" element={<PatientDetailRoute navigate={navigate} />} />
            {/* New Route for Indicators */}
            <Route path="/patients/:id/indicators/new" element={<IndicatorFormRoute navigate={navigate} />} />
            <Route path="/followup" element={<FollowUpsPage />} />
            <Route path="*" element={<DashboardPage navigate={navigate} />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App