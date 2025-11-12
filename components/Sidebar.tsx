import React from 'react';
import { Motorcycle, View } from '../types';
import { MotorcycleIcon, WrenchIcon, BellIcon, ClipboardIcon, SignOutIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
  motorcycles: Motorcycle[];
  selectedMotorcycleId: string | null;
  setSelectedMotorcycleId: (id: string | null) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}> = ({ icon, label, isActive, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full flex items-center p-3 rounded-lg transition-all duration-300 text-left ${
      isActive
        ? 'bg-[#00f6ff] text-black shadow-lg shadow-[#00f6ff]/30'
        : disabled 
        ? 'text-gray-600 cursor-not-allowed'
        : 'text-gray-300 hover:bg-white/5 hover:text-white'
    }`}
  >
    {icon}
    <span className="ml-4 font-semibold">{label}</span>
  </button>
);


const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  motorcycles,
  selectedMotorcycleId,
  setSelectedMotorcycleId,
}) => {
  const hasMotorcycles = motorcycles.length > 0;
  const { signOut, currentUser } = useAuth();
  
  return (
    <aside className="hidden md:flex w-64 lg:w-72 bg-[#141414] p-4 flex-col border-r border-white/10">
      <div>
        <div className="flex items-center space-x-3 p-2">
          <MotorcycleIcon className="w-8 h-8 text-[#00f6ff]" />
          <h1 className="text-2xl font-bold text-white">Mi Garage</h1>
        </div>
        
        <nav className="space-y-2 mt-6">
          <NavItem 
            icon={<MotorcycleIcon className="w-5 h-5"/>} 
            label="Mi Garage"
            isActive={activeView === 'garage'}
            onClick={() => setActiveView('garage')}
          />
          <NavItem 
            icon={<WrenchIcon className="w-5 h-5"/>} 
            label="Bitácora"
            isActive={activeView === 'services'}
            onClick={() => setActiveView('services')}
            disabled={!hasMotorcycles}
          />
          <NavItem 
            icon={<BellIcon className="w-5 h-5"/>} 
            label="Recordatorios"
            isActive={activeView === 'reminders'}
            onClick={() => setActiveView('reminders')}
            disabled={!hasMotorcycles}
          />
          <NavItem 
            icon={<ClipboardIcon className="w-5 h-5"/>} 
            label="Datos Técnicos"
            isActive={activeView === 'tech'}
            onClick={() => setActiveView('tech')}
            disabled={!hasMotorcycles}
          />
        </nav>
      </div>

      <div className="flex-grow pt-4 border-t border-white/10 mt-6 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-500 mb-3 px-2">Mis Motos</h2>
          {motorcycles.length === 0 ? (
            <p className="text-sm text-gray-500 px-2">Agrega tu primera moto en "Mi Garage".</p>
          ) : (
            <ul className="space-y-1">
              {motorcycles.map((moto) => (
                <li key={moto.id}>
                  <button
                    onClick={() => setSelectedMotorcycleId(moto.id)}
                    className={`w-full text-left p-2 rounded-md transition-colors text-sm flex items-center space-x-3 ${
                      selectedMotorcycleId === moto.id
                        ? 'bg-[#00f6ff]/10 font-semibold text-[#00f6ff]'
                        : 'hover:bg-white/5 text-gray-400'
                    }`}
                  >
                    {moto.photo ? (
                      <img src={moto.photo} alt={moto.nickname} className="w-8 h-8 rounded-full object-cover"/>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                        <MotorcycleIcon className="w-4 h-4 text-gray-400"/>
                      </div>
                    )}
                    <span>{moto.nickname}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="pt-4 border-t border-white/10">
          <p className="text-xs text-gray-500 px-2 truncate" title={currentUser?.email || ''}>
            {currentUser?.email}
          </p>
          <button
            onClick={signOut}
            className="w-full flex items-center p-3 mt-2 rounded-lg text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-colors duration-300"
          >
            <SignOutIcon className="w-5 h-5"/>
            <span className="ml-4 font-semibold">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
