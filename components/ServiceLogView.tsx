import React, { useState } from 'react';
import { Motorcycle, ServiceLog } from '../types';
import Modal from './Modal';
import { PlusIcon, WrenchIcon } from './icons';

interface ServiceLogViewProps {
  selectedMotorcycle: Motorcycle | undefined;
  serviceLogs: ServiceLog[];
  addServiceLog: (log: Omit<ServiceLog, 'id'>) => void;
}

const FormInput = ({ label, name, type, value, onChange, required = true }: any) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
    <input
      type={type} id={name} name={name} value={value} onChange={onChange} required={required}
      className="w-full bg-black/50 border border-gray-700 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-[#00f6ff] focus:border-[#00f6ff] outline-none transition-all duration-300"
    />
  </div>
);

const ServiceLogView: React.FC<ServiceLogViewProps> = ({ selectedMotorcycle, serviceLogs, addServiceLog }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLog, setNewLog] = useState({
    date: new Date().toISOString().split('T')[0],
    mileage: 0,
    serviceType: '',
    partsUsed: '',
    partsCost: 0,
    laborCost: 0,
    notes: '',
  });

  if (!selectedMotorcycle) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <WrenchIcon className="w-16 h-16 text-gray-600 mb-4" />
        <h3 className="text-xl font-semibold text-gray-400">Selecciona una moto</h3>
        <p className="text-gray-500">Elige una moto para ver su bitácora de servicios.</p>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isNumber = type === 'number';
    setNewLog(prev => ({...prev, [name]: isNumber ? parseFloat(value) || 0 : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(newLog.serviceType && newLog.mileage > 0) {
      addServiceLog({ ...newLog, motorcycleId: selectedMotorcycle.id });
      setIsModalOpen(false);
      setNewLog({
        date: new Date().toISOString().split('T')[0], mileage: 0, serviceType: '',
        partsUsed: '', partsCost: 0, laborCost: 0, notes: '',
      });
    }
  }
  
  const totalCost = (log: ServiceLog) => log.partsCost + log.laborCost;

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="hidden md:block text-3xl font-bold text-white">Bitácora: <span className="text-[#00f6ff]">{selectedMotorcycle.nickname}</span></h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-[#00f6ff] hover:shadow-lg hover:shadow-[#00f6ff]/40 text-black font-bold py-2 px-4 rounded-lg flex items-center transition-all transform hover:scale-105 shadow-md">
          <PlusIcon className="w-5 h-5 mr-2" />
          Agregar Servicio
        </button>
      </div>

      {serviceLogs.length === 0 ? (
        <div className="text-center py-20 bg-[#1a1a1a] rounded-lg border-2 border-dashed border-gray-700">
          <WrenchIcon className="w-16 h-16 mx-auto text-gray-500" />
          <p className="mt-4 text-lg text-gray-400">No hay registros para esta moto.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {serviceLogs.map((log) => (
            <div key={log.id} className="bg-[#1a1a1a] p-4 rounded-lg border border-white/10 shadow-sm transition-colors hover:border-[#00f6ff]/50">
              <div className="flex justify-between items-start">
                  <div>
                      <p className="text-lg font-bold text-[#00f6ff]">{log.serviceType}</p>
                      <p className="text-sm text-gray-500">{new Date(log.date).toLocaleDateString()} - {log.mileage.toLocaleString()} km</p>
                  </div>
                  <p className="text-lg font-semibold text-gray-200">${totalCost(log).toFixed(2)}</p>
              </div>
              <div className="mt-3 pt-3 border-t border-white/10 text-sm text-gray-300">
                  <p><strong className="font-semibold text-gray-400">Repuestos:</strong> {log.partsUsed || 'N/A'} (${log.partsCost.toFixed(2)})</p>
                  <p><strong className="font-semibold text-gray-400">Mano de Obra:</strong> ${log.laborCost.toFixed(2)}</p>
                  {log.notes && <p className="mt-2 bg-black/50 p-2 rounded"><strong className="font-semibold text-gray-400">Notas:</strong> {log.notes}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registrar Nuevo Servicio">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Fecha" name="date" type="date" value={newLog.date} onChange={handleInputChange} />
            <FormInput label="Kilometraje" name="mileage" type="number" value={newLog.mileage} onChange={handleInputChange} />
          </div>
          <FormInput label="Tipo de Servicio" name="serviceType" type="text" value={newLog.serviceType} onChange={handleInputChange} />
          <div>
            <label htmlFor="partsUsed" className="block text-sm font-medium text-gray-400 mb-1">Repuestos Usados</label>
            <textarea id="partsUsed" name="partsUsed" value={newLog.partsUsed} onChange={handleInputChange} rows={2} className="w-full bg-black/50 border border-gray-700 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-[#00f6ff] focus:border-[#00f6ff] outline-none transition-all duration-300"></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Costo de Repuestos ($)" name="partsCost" type="number" value={newLog.partsCost} onChange={handleInputChange} />
            <FormInput label="Costo Mano de Obra ($)" name="laborCost" type="number" value={newLog.laborCost} onChange={handleInputChange} />
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-400 mb-1">Notas Adicionales</label>
            <textarea id="notes" name="notes" value={newLog.notes} onChange={handleInputChange} rows={3} className="w-full bg-black/50 border border-gray-700 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-[#00f6ff] focus:border-[#00f6ff] outline-none transition-all duration-300"></textarea>
          </div>
          <div className="pt-4 flex justify-end">
            <button type="submit" className="bg-[#00f6ff] hover:shadow-lg hover:shadow-[#00f6ff]/40 text-black font-bold py-2 px-6 rounded-lg transition-colors">
              Guardar Registro
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ServiceLogView;