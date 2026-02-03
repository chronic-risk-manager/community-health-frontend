import { useState, useMemo } from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigate, useParams, Navigate, Outlet } from 'react-router-dom'

import DashboardPage from './pages/DashboardPage'
import PatientsPage from './pages/PatientsPage'
import PatientDetailPage from './pages/PatientDetailPage'
import PatientFormPage from './pages/PatientFormPage'
import IndicatorFormPage from './pages/IndicatorFormPage'
import FollowUpsPage from './pages/FollowUpsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'

// --- Route Components ---

const PatientDetailRoute = ({ navigate }) => {
  const { id } = useParams()
  return <PatientDetailPage patientId={id} navigate={navigate} />
}

const PatientFormRoute = ({ navigate }) => {
  const { id } = useParams()
  return <PatientFormPage patientId={id} navigate={navigate} />
}

const IndicatorFormRoute = ({ navigate }) => {
  const { id } = useParams()
  return <IndicatorFormPage patientId={id} navigate={navigate} />
}

// --- Protected Route Guard ---

const ProtectedRoute = () => {
  const token = localStorage.getItem('token')
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}

// --- Main Layout Component ---

const AppLayout = () => {
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
      case 'add-indicator':
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
    <div className="flex h-screen bg-white">
      <Sidebar
        currentView={currentView}
        navigate={navigate}
        isOpen={sidebarOpen}
        close={() => setSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <Header title={title} openSidebar={() => setSidebarOpen(true)} />
        <div className="flex-1 overflow-auto p-6 bg-slate-50/50">
          <Routes>
            <Route path="/" element={<DashboardPage navigate={navigate} />} />
            <Route path="/patients" element={<PatientsPage navigate={navigate} />} />
            <Route path="/patients/new" element={<PatientFormPage navigate={navigate} />} />
            <Route path="/patients/edit/:id" element={<PatientFormRoute navigate={navigate} />} />
            <Route path="/patients/:id" element={<PatientDetailRoute navigate={navigate} />} />
            <Route path="/patients/:id/indicators/new" element={<IndicatorFormRoute navigate={navigate} />} />
            <Route path="/followup" element={<FollowUpsPage />} />
            <Route path="*" element={<DashboardPage navigate={navigate} />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

// --- Main App Entry ---

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/*" element={<AppLayout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App