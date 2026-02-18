import React, { useState, useEffect } from 'react';
// FIX: Changed import path to look in parent directory
import { fetchFollowUps, updateFollowUp } from '../services/api';
import { RefreshCw, CheckCircle, Clock, AlertCircle, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

const FollowUpsPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  
  // Filtering and Pagination State
  const [filterStatus, setFilterStatus] = useState('All'); // 'All', 'Pending', 'Overdue', 'Completed'
  const [currentPage, setCurrentPage] = useState(1);

  // Load tasks from API
  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      // Pass filter to API
      // Note: 'Overdue' might be a derived state on frontend or a backend status. 
      // Passing it as query param assuming backend support or handling it.
      const params = {};
      if (filterStatus !== 'All') {
        params.status = filterStatus;
      }

      const data = await fetchFollowUps(params);
      
      // Flatten the structure
      const flattenedTasks = data.flatMap(item => 
        item.followups.map(fu => ({
          ...fu,
          patientName: item.patient.name,
          patientId: item.patient.id
        }))
      );
      
      // Sort: Pending first, then by date
      flattenedTasks.sort((a, b) => {
        if (a.status === 'Completed' && b.status !== 'Completed') return 1;
        if (a.status !== 'Completed' && b.status === 'Completed') return -1;
        return new Date(a.due_date) - new Date(b.due_date);
      });

      setTasks(flattenedTasks);
      setCurrentPage(1); // Reset to first page on new fetch
    } catch (err) {
      console.error(err);
      setError('Failed to load follow-up tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [filterStatus]);

  // Handle marking a task as done
  const markDone = async (id) => {
    setUpdatingId(id);
    try {
      const completedAt = new Date().toISOString();
      await updateFollowUp(id, {
        status: 'Completed',
        completed_at: completedAt
      });
      
      // Update local state
      setTasks(prevTasks => prevTasks.map(t => 
        t.id === id ? { ...t, status: 'Completed', completed_at: completedAt } : t
      ));
    } catch (err) {
      console.error('Failed to update task:', err);
      alert('Failed to update task status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(tasks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentTasks = tasks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const FilterButton = ({ status, label }) => (
    <button
      onClick={() => setFilterStatus(status)}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2
        ${filterStatus === status 
          ? 'bg-indigo-600 text-white shadow-sm' 
          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
        }`}
    >
      {label}
    </button>
  );

  if (loading && tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <RefreshCw className="animate-spin mb-2 text-indigo-500" size={24} />
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (error && tasks.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-red-50 text-red-500 rounded-full mb-3">
          <AlertCircle size={24} />
        </div>
        <h3 className="text-lg font-medium text-slate-900">Error Loading Tasks</h3>
        <p className="text-slate-500 mb-4">{error}</p>
        <button 
          onClick={loadTasks} 
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Follow-up Tasks</h2>
           <p className="text-sm text-slate-500 mt-1">Manage patient follow-ups and schedules</p>
        </div>
        <div className="flex items-center gap-2">
          <FilterButton status="All" label="All" />
          <FilterButton status="Pending" label="Pending" />
          <FilterButton status="Overdue" label="Overdue" />
          <FilterButton status="Completed" label="Completed" />
          
          <button 
            onClick={loadTasks} 
            className="p-2 ml-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg border border-transparent hover:border-slate-200 transition-all"
            title="Refresh List"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
        {tasks.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <CheckCircle className="mx-auto mb-3 text-slate-300" size={32} />
            <p>No tasks found for this filter.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto min-h-[400px]">
              <table className="w-full text-sm text-left">
                <thead className="text-slate-500 bg-slate-50 font-medium border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3">Patient</th>
                    <th className="px-6 py-3">Task Description</th>
                    <th className="px-6 py-3">Due Date</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentTasks.map((task) => {
                    const isOverdue = new Date(task.due_date) < new Date() && task.status !== 'Completed';
                    const isCompleted = task.status === 'Completed';

                    return (
                      <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">{task.patientName}</td>
                        <td className="px-6 py-4 text-slate-600 max-w-xs truncate" title={task.task_description}>
                          {task.task_description}
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                           <div className="flex items-center gap-2">
                             <Clock size={14} className={isOverdue ? "text-red-400" : "text-slate-400"} />
                             <span className={isOverdue ? "text-red-600 font-medium" : ""}>
                               {new Date(task.due_date).toLocaleDateString()}
                             </span>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1.5
                            ${isOverdue ? 'bg-red-100 text-red-700' : 
                              isCompleted ? 'bg-slate-100 text-slate-500' : 
                              'bg-blue-100 text-blue-700'}`}>
                            {isCompleted && <CheckCircle size={10} />}
                            {isOverdue && !isCompleted ? 'Overdue' : task.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {!isCompleted && (
                            <button 
                              onClick={() => markDone(task.id)}
                              disabled={updatingId === task.id}
                              className={`text-xs px-3 py-1.5 rounded border font-medium transition-all
                                ${updatingId === task.id 
                                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' 
                                  : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-200'
                                }
                              `}
                            >
                              {updatingId === task.id ? 'Updating...' : 'Mark Done'}
                            </button>
                          )}
                          {isCompleted && (
                            <span className="text-xs text-slate-400 italic">Completed</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="border-t border-slate-200 px-6 py-4 bg-slate-50 flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(startIndex + ITEMS_PER_PAGE, tasks.length)}</span> of <span className="font-medium">{tasks.length}</span> results
              </span>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Simple logic to show first 5 pages or adjust window (simplified for now)
                  let p = i + 1;
                  if (totalPages > 5 && currentPage > 3) {
                     p = currentPage - 2 + i;
                  }
                  if (p > totalPages) return null;
                  
                  return (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`w-8 h-8 rounded-md text-sm font-medium transition-colors
                        ${currentPage === p 
                          ? 'bg-indigo-600 text-white' 
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
          </>
        )}
      </div>
    </div>
  );
}

export default FollowUpsPage;