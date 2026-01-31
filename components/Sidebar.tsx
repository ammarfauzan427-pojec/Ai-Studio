import React from 'react';
import { 
  LayoutTemplate, 
  Layers, 
  Camera, 
  Lock, 
  Settings, 
  Home
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'creative', label: 'Creative Suite', icon: LayoutTemplate },
    { id: 'composition', label: 'Composition', icon: Layers },
    { id: 'master', label: 'Master Maker', icon: Camera },
    { id: 'brand', label: 'Brand Lock', icon: Lock },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 h-screen flex flex-col flex-shrink-0 z-20">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          AI Studio
        </h1>
        <p className="text-xs text-slate-500 mt-1">Production Engine v1.0</p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-200 transition-colors w-full">
          <Settings size={20} />
          <span className="font-medium text-sm">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;