import { useState } from 'react'
import { FOLLOW_UPS } from '../data/mockData.js'

const FollowUpsPage = () => {
  const [tasks, setTasks] = useState(FOLLOW_UPS)

  const markDone = id => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: 'Completed' } : t))
  }
   const toggleStatus = (id) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, status: 'Completed' } : t
    ));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800">Follow-up Tasks</h2>
      
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-slate-500 bg-slate-50 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-3">Patient</th>
              <th className="px-6 py-3">Task Type</th>
              <th className="px-6 py-3">Due Date</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{task.name}</td>
                <td className="px-6 py-4 text-slate-600">{task.type}</td>
                <td className="px-6 py-4 text-slate-600">{task.date}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium 
                    ${task.status === 'Overdue' ? 'bg-red-100 text-red-700' : 
                      task.status === 'Completed' ? 'bg-gray-100 text-gray-500 line-through' : 
                      'bg-blue-100 text-blue-700'}`}>
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {task.status !== 'Completed' && (
                    <button 
                      onClick={() => toggleStatus(task.id)}
                      className="text-xs bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-3 py-1.5 rounded border border-emerald-200 font-medium transition-colors"
                    >
                      Mark Done
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FollowUpsPage
