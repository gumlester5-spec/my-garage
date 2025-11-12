import React, { useState, useRef, useEffect } from 'react';
import { Motorcycle, View } from '../types';
import { ChevronDownIcon, MotorcycleIcon } from './icons';

interface MobileHeaderProps {
  activeView: View;
  motorcycles: Motorcycle[];
  selectedMotorcycle: Motorcycle | undefined;
  setSelectedMotorcycleId: (id: string | null) => void;
}

const VIEW_TITLES: Record<View, string> = {
    garage: 'Mi Garage',
    services: 'Bitácora',
    reminders: 'Recordatorios',
    tech: 'Datos Técnicos'
};

const MobileHeader: React.FC<MobileHeaderProps> = ({ activeView, motorcycles, selectedMotorcycle, setSelectedMotorcycleId }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const title = VIEW_TITLES[activeView];
    const canSelectMoto = activeView !== 'garage' && motorcycles.length > 0;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="md:hidden sticky top-0 bg-[#0a0a0a]/70 backdrop-blur-lg z-30 p-4 border-b border-white/10">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-white">{title}</h1>
            </div>
            {canSelectMoto && (
                 <div className="mt-4 relative" ref={dropdownRef}>
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full flex justify-between items-center bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2 text-left text-gray-200"
                    >
                        <span className="font-semibold">
                            {selectedMotorcycle ? selectedMotorcycle.nickname : 'Seleccionar moto'}
                        </span>
                        <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-lg z-50">
                            <ul className="py-1">
                                {motorcycles.map(moto => (
                                    <li key={moto.id}>
                                        <button
                                            onClick={() => {
                                                setSelectedMotorcycleId(moto.id);
                                                setIsDropdownOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-gray-300 hover:bg-white/5 flex items-center space-x-3"
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
                        </div>
                    )}
                 </div>
            )}
        </header>
    );
};

export default MobileHeader;