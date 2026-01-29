import { Users, Activity, Calendar, Bell } from 'lucide-react'
import KPICard from '../components/ui/KPICard';
import SimpleLineChart from '../components/charts/SimpleLineChart';
import SimpleBarChart from '../components/charts/SimpleBarChart';
import RiskBadge from '../components/ui/RiskBadge';
import { AlertTriangle } from 'lucide-react';


// --- MOCK DATA ---
const KPI_DATA = {
  totalPatients: 124,
  highRisk: 12,
  dueFollowUps: 8,
  activeAlerts: 5,
};

const MOCK_PATIENTS = [
  { id: 1, name: "Robert Fox", risk: "High" },
  { id: 2, name: "Jane Cooper", risk: "Medium" },
  { id: 3, name: "Guy Hawkins", risk: "Low" },
];




// --- DASHBOARD PAGE ---
const DashboardPage = () => {
 return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Patients" value={KPI_DATA.totalPatients} subtext="+4 this month" icon={Users} colorClass="bg-blue-50 text-blue-600" />
        <KPICard title="High Risk" value={KPI_DATA.highRisk} subtext="Requires attention" icon={Activity} colorClass="bg-red-50 text-red-600" />
        <KPICard title="Follow-ups Due" value={KPI_DATA.dueFollowUps} subtext="Next 7 days" icon={Calendar} colorClass="bg-orange-50 text-orange-600" />
        <KPICard title="Active Alerts" value={KPI_DATA.activeAlerts} subtext="Unresolved" icon={Bell} colorClass="bg-purple-50 text-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">Population Risk Trends</h3>
            <select className="text-sm border-slate-200 rounded-md text-slate-500 bg-slate-50 px-2 py-1">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-center bg-slate-50 rounded-lg border border-dashed border-slate-300 relative overflow-hidden">
             {/* Mocking a more complex chart visually */}
             <div className="absolute inset-0 p-4 opacity-50">
               <SimpleLineChart data={[30, 45, 32, 50, 60, 55, 70, 65, 80, 75, 85, 90]} height={200} color="#6366f1" />
               <div className="mt-[-200px]">
                 <SimpleLineChart data={[20, 25, 22, 30, 28, 35, 32, 40, 38, 45, 42, 48]} height={200} color="#10b981" />
               </div>
             </div>
             <div className="z-10 text-sm text-slate-400 mb-2">Avg Risk Score (Composite)</div>
          </div>
        </div>

        {/* Distribution */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-2">Risk Distribution</h3>
          <p className="text-sm text-slate-500 mb-6">Current active patient base</p>
          <SimpleBarChart data={[65, 23, 12]} labels={['Low', 'Medium', 'High']} />
        </div>
      </div>

      {/* Alerts Table */}
      {/* <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Recent Clinical Alerts</h3>
          <button onClick={() => navigate('patients')} className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-slate-500 bg-slate-50 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Patient</th>
                <th className="px-6 py-3">Condition</th>
                <th className="px-6 py-3">Alert Reason</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_PATIENTS.filter(p => p.risk === 'High' || p.risk === 'Medium').slice(0, 4).map((patient) => (
                <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{patient.name}</td>
                  <td className="px-6 py-4 text-slate-600">{patient.condition}</td>
                  <td className="px-6 py-4 text-slate-600">
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={14} className={patient.risk === 'High' ? "text-red-500" : "text-orange-500"} />
                      {patient.status}
                    </div>
                  </td>
                  <td className="px-6 py-4"><RiskBadge level={patient.risk} /></td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => navigate('patient-detail', patient.id)}
                      className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}
    </div>
  );
}

export default DashboardPage;
export { KPI_DATA, MOCK_PATIENTS, KPICard };