import {
  LayoutDashboard,
  Users,
  Calendar,
  Activity,
  X,
  User,
  LogOut
} from 'lucide-react'
import SidebarItem from '../ui/SidebarItem.jsx'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'


const Sidebar = ({ currentView, navigate, isOpen, close }) => {
  const routerNavigate = useNavigate();
  const [user] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

   const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    routerNavigate('/login');
  };

  return (
    <aside className={`
      fixed md:relative z-30 h-full bg-white border-r border-slate-200
      transition-all duration-300 flex flex-col
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

      <nav className="px-4 flex-1">
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

      {/* User & Logout Section */}
      <div className="p-4 border-t bg-slate-50">
        <div className="flex items-center justify-between">
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center border border-blue-200">
              <User size={16} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">{user ? user.username : "User"}</p>
              <p className="text-xs text-slate-500">Logged In</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar