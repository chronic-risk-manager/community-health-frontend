import { useState, useEffect } from 'react'
import { Save, X, Loader2, AlertCircle, User, Phone, Calendar } from 'lucide-react'
import { createPatient, updatePatient, fetchPatientDetails } from '../services/api'

const PatientFormPage = ({ patientId, navigate }) => {
  const isEditing = Boolean(patientId)
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'male',
    contact_info: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(isEditing)
  const [error, setError] = useState(null)

  // Load data if editing
  useEffect(() => {
    if (isEditing) {
      const loadPatient = async () => {
        try {
          const data = await fetchPatientDetails(patientId)
          setFormData({
            name: data.name || '',
            age: data.age || '',
            gender: data.gender || 'male',
            contact_info: data.contact_info || ''
          })
        } catch (err) {
          setError(err.message || 'Failed to load patient details.')
        } finally {
          setInitialLoading(false)
        }
      }
      loadPatient()
    }
  }, [patientId, isEditing])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Ensure age is sent as an integer
    const payload = {
      ...formData,
      age: parseInt(formData.age, 10)
    }

    try {
      if (isEditing) {
        await updatePatient(patientId, payload)
      } else {
        await createPatient(payload)
      }
      navigate('patients')
    } catch (err) {
      setError(err.message || `Failed to ${isEditing ? 'update' : 'create'} patient. Please check your inputs.`)
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-slate-500">
        <Loader2 className="animate-spin mb-2" size={32} />
        <p>Loading form data...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button 
            onClick={() => navigate('patients')} 
            className="text-sm text-slate-500 hover:text-slate-800 mb-2 flex items-center gap-1"
          >
            ← Back to List
          </button>
          <h1 className="text-3xl font-bold text-slate-900">
            {isEditing ? 'Edit Patient' : 'Register New Patient'}
          </h1>
          <p className="text-slate-500 mt-1">
            {isEditing ? 'Update the patient information below.' : 'Enter the details to create a new patient record.'}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
        
        {/* Name Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="pl-10 w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="e.g. John Doe"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Age Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Age</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                required
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="pl-10 w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="e.g. 35"
                min="0"
                max="120"
              />
            </div>
          </div>

          {/* Gender Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-all"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Contact Info Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Contact Information</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              required
              name="contact_info"
              value={formData.contact_info}
              onChange={handleChange}
              className="pl-10 w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="e.g. email@example.com or Phone Number"
            />
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 mt-6">
          <button
            type="button"
            onClick={() => navigate('patients')}
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {isEditing ? 'Save Changes' : 'Create Patient'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PatientFormPage