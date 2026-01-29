import {
  LayoutDashboard,
  Users,
  Calendar,
  BarChart2,
  Activity,
  X,
  User
} from 'lucide-react'
import SidebarItem from '../ui/SidebarItem'

const Sidebar = ({ currentView, navigate, isOpen, close }) => {
  return (
    <aside className={`
      fixed md:relative z-30 h-full bg-white border-r border-slate-200
      transition-all duration-300
      ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 w-64'}
    `}>
      <div className="p-6 flex justify-between items-center">
        <div className="flex items-center gap-2 text-blue-600">
          <Activity size={28} />
          <span className="font-bold text-xl text-slate-800">Community Health</span>
        </div>
        <button onClick={close} className="md:hidden">
          <X />
        </button>
      </div>

      <nav className="px-4">
        <SidebarItem icon={LayoutDashboard} label="Dashboard"
          active={currentView === 'dashboard'}
          onClick={() => navigate('dashboard')}
        />
        <SidebarItem icon={Users} label="Patients"
          active={currentView === 'patients' || currentView === 'patient-detail'}
          onClick={() => navigate('patients')}
        />
        <SidebarItem icon={Calendar} label="Follow-ups"
          active={currentView === 'follow-ups'}
          onClick={() => navigate('follow-ups')}
        />
      </nav>

      <div className="absolute bottom-0 w-full p-4 border-t">
        <div className="flex gap-3 items-center">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
            <User size={16} />
          </div>
          <div>
            <p className="text-sm font-medium">Dr. S. Miller</p>
            <p className="text-xs text-slate-400">Family Medicine</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
