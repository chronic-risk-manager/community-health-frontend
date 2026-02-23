import { useState, useEffect } from 'react'
import { Search, ChevronRight, ChevronLeft, AlertCircle, Loader2, Plus, Edit2 } from 'lucide-react'
import { fetchPatients } from '../services/api'
import { useLocation } from "react-router-dom";

const ITEMS_PER_PAGE = 10;

const PatientsPage = ({ navigate }) => {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const data = await fetchPatients()
        data.reverse();
        console.log('Fetched patients:', data)
        setPatients(data)
        setError(null)
      } catch (err) {
        setError(err.message || 'Failed to connect to the server. Please ensure the backend is running.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Filter logic
  const location = useLocation();
  const filterType = location.state?.filter || 'null';
  
  // Apply filters to get the full list of matching patients
  let filtered = patients;

  // High risk filter
  if (filterType === "high_risk") {
    filtered = filtered.filter(p => {
      const lastAssessment = p.assessments?.[p.assessments.length - 1];
      const risk = lastAssessment?.risk_level;
      if (!risk) return false;
      return risk.toLowerCase() === "high";
    });
  }

  // Search filter
  if (search) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.contact_info.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterType]);

  // Pagination Logic
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPatients = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <Loader2 className="animate-spin mb-2" size={32} />
        <p>Loading patient records...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
        <AlertCircle size={24} />
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 p-6">
      {filterType === "high_risk" && (
        <div className="bg-red-50 border border-red-200 px-4 py-2 rounded-lg text-red-600 font-medium flex items-center gap-2">
           <AlertCircle size={16} />
           Showing High Risk Patients
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            className="pl-10 p-2 border border-slate-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => navigate('create-patient')}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
        >
          <Plus size={20} />
          <span>Add Patient</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Name</th>
                <th className="text-left p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Age</th>
                <th className="text-left p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Gender</th>
                <th className="text-left p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Contact Info</th>
                <th className="w-24 text-right p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedPatients.map(p => (
                <tr 
                  key={p.id}
                  onClick={() => navigate('patient-detail', p.id)}
                  className="cursor-pointer hover:bg-slate-50 transition-colors group"
                >
                  <td className="p-4 font-medium text-slate-900">{p.name}</td>
                  <td className="p-4 text-slate-600">{p.age}</td>
                  <td className="p-4 text-slate-600 capitalize">{p.gender}</td>
                  <td className="p-4 text-slate-600">{p.contact_info}</td>
                  <td className="p-4 flex items-center justify-end gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('edit-patient', p.id);
                      }}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      title="Edit Patient"
                    >
                      <Edit2 size={18} />
                    </button>
                    <div className="text-slate-300 group-hover:text-slate-400">
                      <ChevronRight size={20} />
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-slate-500">
                    <p className="text-lg font-medium mb-1">No patients found</p>
                    <p className="text-sm">Try adjusting your search or add a new patient.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {filtered.length > 0 && (
          <div className="border-t border-slate-200 px-6 py-4 bg-slate-50 flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)}</span> of <span className="font-medium">{filtered.length}</span> results
            </span>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-md border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              
              {/* Simple Page Numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let p = i + 1;
                if (totalPages > 5) {
                   if (currentPage <= 3) { p = i + 1; }
                   else if (currentPage >= totalPages - 2) { p = totalPages - 4 + i; }
                   else { p = currentPage - 2 + i; }
                }
                
                return (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    className={`w-8 h-8 rounded-md text-sm font-medium transition-colors
                      ${currentPage === p 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'
                      }`}
                  >
                    {p}
                  </button>
                );
              })}
              
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PatientsPage