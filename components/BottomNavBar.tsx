import React from 'react';
import { View } from '../types';
import { MotorcycleIcon, WrenchIcon, BellIcon, ClipboardIcon } from './icons';

interface BottomNavBarProps {
  activeView: View;
  setActiveView: (view: View) => void;
  hasMotorcycles: boolean;
}

const NavButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
    disabled?: boolean;
}> = ({ icon, label, isActive, onClick, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-300 ${
            isActive ? 'text-[#00f6ff]' : 'text-gray-400'
        } ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:text-[#00f6ff]'}`}
    >
        {icon}
        <span className="text-xs mt-1">{label}</span>
    </button>
);

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeView, setActiveView, hasMotorcycles }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/70 backdrop-blur-lg border-t border-white/10 shadow-t-lg z-40 flex justify-around items-start">
      <NavButton
        icon={<MotorcycleIcon className="w-6 h-6" />}
        label="Garage"
        isActive={activeView === 'garage'}
        onClick={() => setActiveView('garage')}
      />
      <NavButton
        icon={<WrenchIcon className="w-6 h-6" />}
        label="Servicios"
        isActive={activeView === 'services'}
        onClick={() => setActiveView('services')}
        disabled={!hasMotorcycles}
      />
      <NavButton
        icon={<BellIcon className="w-6 h-6" />}
        label="Alertas"
        isActive={activeView === 'reminders'}
        onClick={() => setActiveView('reminders')}
        disabled={!hasMotorcycles}
      />
      <NavButton
        icon={<ClipboardIcon className="w-6 h-6" />}
        label="Datos"
        isActive={activeView === 'tech'}
        onClick={() => setActiveView('tech')}
        disabled={!hasMotorcycles}
      />
    </nav>
  );
};

export default BottomNavBar;