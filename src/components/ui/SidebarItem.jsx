import React from 'react';
const SidebarItem = ({ icon: Icon, label, active, onClick, collapsed }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors mb-1
        ${
          active
            ? "bg-blue-50 text-blue-600"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        }
        ${collapsed ? "justify-center" : ""}
      `}
    >
      {/* Fix: Add "Icon &&" to prevent crashes if icon prop is missing */}
      {Icon && <Icon size={20} />}
      
      {!collapsed && <span className="font-medium text-sm">{label}</span>}
    </button>
  );
};

export default SidebarItem;
