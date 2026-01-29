import { useState } from 'react'
import { Save, Activity, Heart, Droplet, Loader2, AlertCircle } from 'lucide-react'
import { createIndicator } from '../services/api'

const IndicatorFormPage = ({ patientId, navigate }) => {
  const [formData, setFormData] = useState({
    blood_pressure_sys: '',
    blood_pressure_dia: '',
    glucose: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const payload = {
      blood_pressure_sys: parseInt(formData.blood_pressure_sys, 10),
      blood_pressure_dia: parseInt(formData.blood_pressure_dia, 10),
      glucose: parseFloat(formData.glucose),
      patient_id: parseInt(patientId, 10)
    }

    try {
      await createIndicator(payload)
      // Navigate back to the patient's profile to see the new data
      navigate('patient-detail', patientId)
    } catch (err) {
      setError(err.message || 'Failed to save indicators. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <button 
          onClick={() => navigate('patient-detail', patientId)} 
          className="text-sm text-slate-500 hover:text-slate-800 mb-2 flex items-center gap-1"
        >
          ← Cancel
        </button>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Activity className="text-blue-600" />
          Add Health Indicators
        </h1>
        <p className="text-slate-500 mt-1">
          Record new blood pressure and glucose readings.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        
        {/* Blood Pressure Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-700 flex items-center gap-2 border-b pb-2">
            <Heart className="text-red-500" size={18} /> Blood Pressure (mmHg)
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Systolic (Top)</label>
              <input
                required
                type="number"
                name="blood_pressure_sys"
                value={formData.blood_pressure_sys}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="120"
                min="50"
                max="300"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Diastolic (Bottom)</label>
              <input
                required
                type="number"
                name="blood_pressure_dia"
                value={formData.blood_pressure_dia}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="80"
                min="30"
                max="200"
              />
            </div>
          </div>
        </div>

        {/* Glucose Section */}
        <div className="space-y-4">
           <h3 className="font-semibold text-slate-700 flex items-center gap-2 border-b pb-2">
            <Droplet className="text-purple-500" size={18} /> Blood Glucose (mmol/L)
          </h3>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Level</label>
            <input
              required
              type="number"
              step="0.1"
              name="glucose"
              value={formData.glucose}
              onChange={handleChange}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="5.5"
              min="0"
              max="50"
            />
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 mt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Save Record
          </button>
        </div>
      </form>
    </div>
  )
}

export default IndicatorFormPage