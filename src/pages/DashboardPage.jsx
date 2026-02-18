import React, { useEffect, useState } from 'react';
import { Users, Activity, Calendar, Bell, RefreshCw, AlertCircle } from 'lucide-react';
import { fetchDashboard } from '../services/api';
import { useNavigate } from "react-router-dom";


// Importing from your existing components folder
// Note: Ensure these paths match your actual project structure. 
// If components are in 'src/components', this relative path assumes DashboardPage is in 'src/pages'
import KPICard from '../components/ui/KPICard';
import SimpleBarChart from '../components/charts/simpleBarChart';
// import SimpleLineChart from '../components/SimpleLineChart'; // Available if needed for trend data

const DashboardPage = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <RefreshCw className="animate-spin text-indigo-600" size={32} />
        <p className="text-slate-500">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4 text-center p-6">
        <div className="p-4 bg-red-50 rounded-full text-red-500">
          <AlertCircle size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-800">Unable to load dashboard</h3>
        <p className="text-slate-500 max-w-md">{error}</p>
        <button 
          onClick={loadData}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Destructure data safely with defaults
  const { 
    counts = { total_patients: 0, high_risk_patients: 0, upcoming_followups: 0 }, 
    risk_distribution = { high: 0, medium: 0, low: 0 }, 
    weekly_patient_registrations = [], 
    age_distribution = [] 
  } = dashboardData || {};

  // Prepare chart data for Age Distribution
  const ageLabels = age_distribution.map(d => d.range);
  const ageData = age_distribution.map(d => Number(d.count));


  // Prepare chart data for Risk Distribution (aligned Low -> Medium -> High)
  const riskLabels = ['Low', 'Medium', 'High'];
 const riskData = [
  Number(risk_distribution.low) || 0,
  Number(risk_distribution.medium) || 0,
  Number(risk_distribution.high) || 0
];


  // Calculate new patients count
  const newPatientsCount = weekly_patient_registrations.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="p-6 bg-slate-50 min-h-screen space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Patient Analytics</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time population health insights</p>
        </div>
        <button 
          onClick={loadData}
          className="text-sm bg-white px-3 py-1 rounded-full border border-slate-200 text-slate-500 shadow-sm hover:bg-slate-50 flex items-center gap-2 transition-colors"
        >
           <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {/* KPI Section - Using your KPICard component */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div onClick={() => navigate("/patients")} className="cursor-pointer hover:scale-[1.02] transition-transform">
        <KPICard 
         title="Total Patients" 
         value={counts.total_patients} 
         subtext="Active records" 
         icon={Users} 
         colorClass="bg-blue-50 text-blue-600" 
       />
      </div>
      
       <KPICard 
          title="High Risk" 
          value={counts.high_risk_patients} 
          subtext="Requires attention" 
          icon={Activity} 
          colorClass="bg-red-50 text-red-600" 
        />
      

        <KPICard 
          title="Follow-ups Due" 
          value={counts.upcoming_followups} 
          subtext="Pending actions" 
          icon={Calendar} 
          colorClass="bg-orange-50 text-orange-600" 
        />
        <KPICard 
          title="New Registrations" 
          value={newPatientsCount} 
          subtext="This week" 
          icon={Bell} 
          colorClass="bg-purple-50 text-purple-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Age Distribution Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
               <h3 className="font-bold text-slate-800">Patient Age Distribution</h3>
               <p className="text-xs text-slate-400">Demographic breakdown by age group</p>
            </div>
          </div>
          {/* Container for the chart */}
          <div className="w-full">
             <SimpleBarChart data={ageData} labels={ageLabels} height={220} />
          </div>
        </div>

        {/* Risk Distribution Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="mb-6">
            <h3 className="font-bold text-slate-800 mb-1">Risk Distribution</h3>
            <p className="text-sm text-slate-500">Current active patient base</p>
          </div>
          <div className="flex-1">
             <SimpleBarChart data={riskData} labels={riskLabels} height={220} />
          </div>

        </div>
      </div>
    </div>
  );
}

export default DashboardPage;