import { Award, ChevronRight } from 'lucide-react';
import { MENU_ITEMS, COOLVETICA_FONT } from '../../utils/constants';

export default function Sidebar({ isOpen, activeTab, onTabChange }) {
  return (
    <aside 
      style={COOLVETICA_FONT}
      className={`${isOpen ? 'w-72' : 'w-0'} transition-all duration-500 ease-in-out overflow-hidden bg-[#111111] border-r border-zinc-800/50 flex flex-col`}
    >
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#FFB800] rounded-lg flex items-center justify-center">
            <Award size={20} className="text-black" />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter text-white">Credible.</h1>
        </div>
      </div>
      
      <nav className="mt-4 flex-1 px-4 space-y-1">
        {MENU_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-200 group
                ${isActive ? 'bg-[#FFB800] text-black shadow-lg shadow-[#FFB800]/10' : 'text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-200'}`}
            >
              <Icon size={18} strokeWidth={isActive ? 3 : 2} />
              <span className="text-base font-bold tracking-tight">{item.label}</span>
              {isActive && <ChevronRight size={14} className="ml-auto" />}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}