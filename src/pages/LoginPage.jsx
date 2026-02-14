import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { LogIn, Activity, AlertCircle, Loader2 } from 'lucide-react'
import { loginUser,  getCurrentUser } from '../services/api.js'

const LoginPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const data = await loginUser(formData.username, formData.password)
      // Store token in localStorage for future use
     if (data.access_token) {
  localStorage.setItem('token', data.access_token)

  // Fetch logged-in user info
  const user = await getCurrentUser()

  // Save user to localStorage
  localStorage.setItem('user', JSON.stringify(user))

  navigate('/')
}
 else {
        setError('Token not received from server.')
      }
    } catch (err) {
      setError(err.message || 'Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-3">
            <Activity size={28} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-slate-500">Sign in to Community Health</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center gap-3 text-sm">
            <AlertCircle size={18} />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input
              required
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              required
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <LogIn size={20} />}
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage