import { useState, useEffect } from 'react'
import { Loader2, AlertCircle, Calendar, Phone, User, Activity, Clock, CheckCircle2, Plus } from 'lucide-react'
import RiskBadge from '../components/ui/RiskBadge'
import SimpleLineChart from '../components/charts/SimpleLineChart'
import { fetchPatientDetails } from '../services/api'

const PatientDetailPage = ({ patientId, navigate }) => {
  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!patientId) return;

    const loadData = async () => {
      try {
        setLoading(true)
        const data = await fetchPatientDetails(patientId)
        setPatient(data)
        setError(null)
      } catch (err) {
        console.error(err)
        setError('Failed to load patient details. Please ensure the backend is running.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [patientId])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <Loader2 className="animate-spin mb-2" size={32} />
        <p>Loading patient profile...</p>
      </div>
    )
  }

  if (error || !patient) {
    return (
      <div className="space-y-4">
        <button 
          onClick={() => navigate('patients')} 
          className="text-slate-500 hover:text-slate-800 flex items-center gap-2"
        >
          ← Back to Patients
        </button>
        <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
          <AlertCircle size={24} />
          <p>{error || 'Patient not found'}</p>
        </div>
      </div>
    )
  }

  // --- Data Transformation for UI ---
  
  // Sort indicators by date (ascending) to show trend correctly
  const sortedIndicators = [...(patient.indicators || [])].sort((a, b) => new Date(a.recorded_at) - new Date(b.recorded_at))

  // Extract raw values for the SimpleLineChart (which expects array of numbers)
  const bpData = sortedIndicators.map(i => i.blood_pressure_sys)
  const glucoseData = sortedIndicators.map(i => i.glucose)

  // Get latest risk level
  // Mapping 'Med' to 'Medium' if necessary to match RiskBadge styles, or passing directly
  const rawRisk = patient.assessments?.[patient.assessments.length - 1]?.risk_level || 'Unknown'
  const currentRisk = rawRisk === 'Med' ? 'Medium' : rawRisk

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 border-b border-slate-200 pb-6">
        <div>
          <button 
            onClick={() => navigate('patients')} 
            className="text-sm text-slate-500 hover:text-blue-600 mb-2 font-medium"
          >
            ← Back to Patients
          </button>
          <h1 className="text-3xl font-bold text-slate-900">{patient.name}</h1>
          <div className="flex flex-wrap gap-4 mt-3 text-slate-600">
            <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full text-sm">
              <User size={14} />
              <span>{patient.age} years • {patient.gender}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full text-sm">
              <Phone size={14} />
              <span>{patient.contact_info}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full text-sm">
              <Calendar size={14} />
              <span>Joined {new Date(patient.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-3">
           <div className="flex items-center gap-2">
             <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Risk Status</span>
             <RiskBadge level={currentRisk} />
           </div>
           
           <button
             onClick={() => navigate('add-indicator', patientId)}
             className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
           >
             <Plus size={18} />
             Add Indicator
           </button>
        </div>
      </div>

      {/* --- Charts Section --- */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* BP Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="text-red-500" size={20} />
              <h3 className="font-semibold text-slate-800">Systolic BP Trend</h3>
            </div>
          
          </div>
          <div className="w-full">
            {bpData.length > 1 ? (
               <SimpleLineChart data={bpData} color="#ef4444" height={100} />
            ) : (
              <div className="h-[100px] flex items-center justify-center text-slate-400 text-sm bg-slate-50 rounded">
                {bpData.length === 1 ? 'Not enough data for trend' : 'No blood pressure data recorded'}
              </div>
            )}
          </div>
        </div>

        {/* Glucose Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
           <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="text-purple-500" size={20} />
              <h3 className="font-semibold text-slate-800">Glucose Trend</h3>
            </div>
          
          </div>
          <div className="w-full">
            {glucoseData.length > 1 ? (
              <SimpleLineChart data={glucoseData} color="#a855f7" height={100} />
            ) : (
              <div className="h-[100px] flex items-center justify-center text-slate-400 text-sm bg-slate-50 rounded">
                {glucoseData.length === 1 ? 'Not enough data for trend' : 'No glucose data recorded'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- Details Grid: Assessments & Follow-ups --- */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Recent Assessments */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <CheckCircle2 size={20} className="text-slate-400"/> Recent Assessments
          </h3>
          <div className="space-y-3">
            {patient.assessments?.map(assessment => (
              <div key={assessment.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-slate-700 text-sm">
                    {new Date(assessment.assessment_date).toLocaleDateString()}
                  </span>
                  <div className="transform scale-90 origin-right">
                    {/* Handle potential 'Med' vs 'Medium' mismatch */}
                    <RiskBadge level={assessment.risk_level === 'Med' ? 'Medium' : assessment.risk_level} />
                  </div>
                </div>
                <p className="text-slate-600 text-sm font-bold">{assessment.notes}</p>
              </div>
            ))}
            {(!patient.assessments || patient.assessments.length === 0) && (
              <div className="p-8 text-center bg-slate-50 rounded-lg border border-slate-100 border-dashed text-slate-400 text-sm">
                No assessments found.
              </div>
            )}
          </div>
        </div>

        {/* Follow Up Tasks */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <Clock size={20} className="text-slate-400"/> Follow-up Plan
          </h3>
          <div className="space-y-3">
             {patient.follow_ups?.map(task => (
               <div key={task.id} className="flex gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
                 <div className={`w-1 shrink-0 rounded-full ${task.status === 'Pending' ? 'bg-orange-400' : 'bg-green-500'}`} />
                 <div className="flex-1 min-w-0">
                    <p className="text-slate-900 font-medium text-sm truncate">{task.task_description}</p>
                    <div className="flex justify-between mt-2 text-xs text-slate-500">
                      <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                      <span className={`${task.status === 'Pending' ? 'text-orange-600' : 'text-green-600'} font-medium`}>
                        {task.status}
                      </span>
                    </div>
                 </div>
               </div>
             ))}
             {(!patient.follow_ups || patient.follow_ups.length === 0) && (
              <div className="p-8 text-center bg-slate-50 rounded-lg border border-slate-100 border-dashed text-slate-400 text-sm">
                No active follow-up tasks.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default PatientDetailPage