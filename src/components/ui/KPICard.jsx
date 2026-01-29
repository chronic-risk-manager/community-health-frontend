const KPICard = ({ title, value, subtext, icon: Icon, colorClass }) => (
  <div className="bg-white p-6 rounded-xl border shadow-sm flex justify-between items-center">
    <div>
      <p className="text-sm text-slate-500">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
      {subtext && <p className="text-xs text-slate-400">{subtext}</p>}
    </div>
    <div className={`p-3 rounded-lg ${colorClass || 'bg-blue-50 text-blue-600'}`}>
      {/* 1. Check if Icon exists, 2. Render using the capitalized variable */}
      {Icon && <Icon size={20} />}
    </div>
  </div>
);

export default KPICard
