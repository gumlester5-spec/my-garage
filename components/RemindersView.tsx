import React, { useState } from 'react';
import { Motorcycle, Reminder } from '../types';
import Modal from './Modal';
import { PlusIcon, BellIcon, XMarkIcon } from './icons';

interface RemindersViewProps {
  selectedMotorcycle: Motorcycle | undefined;
  reminders: Reminder[];
  addReminder: (reminder: Omit<Reminder, 'id'>) => void;
  deleteReminder: (id: string) => void;
}

const RemindersView: React.FC<RemindersViewProps> = ({ selectedMotorcycle, reminders, addReminder, deleteReminder }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReminder, setNewReminder] = useState({ description: '', dueInfo: '' });

  if (!selectedMotorcycle) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <BellIcon className="w-16 h-16 text-gray-600 mb-4" />
        <h3 className="text-xl font-semibold text-gray-400">Selecciona una moto</h3>
        <p className="text-gray-500">Elige una moto para ver sus recordatorios.</p>
      </div>
    );
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewReminder(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(newReminder.description && newReminder.dueInfo) {
      addReminder({ ...newReminder, motorcycleId: selectedMotorcycle.id });
      setIsModalOpen(false);
      setNewReminder({ description: '', dueInfo: '' });
    }
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="hidden md:block text-3xl font-bold text-white">Recordatorios: <span className="text-[#00f6ff]">{selectedMotorcycle.nickname}</span></h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-[#00f6ff] hover:shadow-lg hover:shadow-[#00f6ff]/40 text-black font-bold py-2 px-4 rounded-lg flex items-center transition-all transform hover:scale-105 shadow-md">
          <PlusIcon className="w-5 h-5 mr-2" />
          Crear Recordatorio
        </button>
      </div>

      {reminders.length === 0 ? (
        <div className="text-center py-20 bg-[#1a1a1a] rounded-lg border-2 border-dashed border-gray-700">
          <BellIcon className="w-16 h-16 mx-auto text-gray-500" />
          <p className="mt-4 text-lg text-gray-400">No tienes recordatorios para esta moto.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reminders.map((reminder) => (
            <div key={reminder.id} className="bg-[#1a1a1a] p-4 rounded-lg border border-white/10 flex justify-between items-center shadow-sm transition-colors hover:border-[#00f6ff]/50">
              <div className="flex items-center">
                <BellIcon className="w-5 h-5 text-[#00f6ff] mr-4"/>
                <div>
                  <p className="font-semibold text-gray-200">{reminder.description}</p>
                  <p className="text-sm text-gray-400">{reminder.dueInfo}</p>
                </div>
              </div>
              <button onClick={() => deleteReminder(reminder.id)} className="text-gray-500 hover:text-red-500 p-1 rounded-full transition-colors">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Crear Nuevo Recordatorio">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">Recordatorio</label>
            <input
              type="text" id="description" name="description" value={newReminder.description} onChange={handleInputChange} required
              className="w-full bg-black/50 border border-gray-700 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-[#00f6ff] focus:border-[#00f6ff] outline-none transition-all duration-300"
              placeholder="Ej: Próximo cambio de aceite"
            />
          </div>
          <div>
            <label htmlFor="dueInfo" className="block text-sm font-medium text-gray-400 mb-1">Vencimiento</label>
            <input
              type="text" id="dueInfo" name="dueInfo" value={newReminder.dueInfo} onChange={handleInputChange} required
              className="w-full bg-black/50 border border-gray-700 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-[#00f6ff] focus:border-[#00f6ff] outline-none transition-all duration-300"
              placeholder="Ej: en 3,000 km o en 6 meses"
            />
          </div>
          <div className="pt-4 flex justify-end">
            <button type="submit" className="bg-[#00f6ff] hover:shadow-lg hover:shadow-[#00f6ff]/40 text-black font-bold py-2 px-6 rounded-lg transition-colors">
              Guardar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RemindersView;