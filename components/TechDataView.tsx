import React, { useState } from 'react';
import { Motorcycle, TechData } from '../types';
import Modal from './Modal';
import { PlusIcon, ClipboardIcon, XMarkIcon } from './icons';

interface TechDataViewProps {
  selectedMotorcycle: Motorcycle | undefined;
  techData: TechData[];
  addTechData: (data: Omit<TechData, 'id'>) => void;
  deleteTechData: (id: string) => void;
}

const TechDataView: React.FC<TechDataViewProps> = ({ selectedMotorcycle, techData, addTechData, deleteTechData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTechData, setNewTechData] = useState({ dataType: '', value: '' });

  if (!selectedMotorcycle) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <ClipboardIcon className="w-16 h-16 text-gray-600 mb-4" />
        <h3 className="text-xl font-semibold text-gray-400">Selecciona una moto</h3>
        <p className="text-gray-500">Elige una moto para ver sus datos técnicos.</p>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTechData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTechData.dataType && newTechData.value) {
        addTechData({ ...newTechData, motorcycleId: selectedMotorcycle.id });
        setIsModalOpen(false);
        setNewTechData({ dataType: '', value: '' });
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="hidden md:block text-3xl font-bold text-white">Datos Técnicos: <span className="text-[#00f6ff]">{selectedMotorcycle.nickname}</span></h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-[#00f6ff] hover:shadow-lg hover:shadow-[#00f6ff]/40 text-black font-bold py-2 px-4 rounded-lg flex items-center transition-all transform hover:scale-105 shadow-md">
          <PlusIcon className="w-5 h-5 mr-2" />
          Agregar Dato
        </button>
      </div>

      {techData.length === 0 ? (
        <div className="text-center py-20 bg-[#1a1a1a] rounded-lg border-2 border-dashed border-gray-700">
          <ClipboardIcon className="w-16 h-16 mx-auto text-gray-500" />
          <p className="mt-4 text-lg text-gray-400">No hay datos técnicos para esta moto.</p>
        </div>
      ) : (
        <div className="bg-[#1a1a1a] rounded-lg border border-white/10 overflow-hidden shadow-md">
          <table className="w-full text-left">
            <thead className="bg-white/5">
              <tr>
                <th className="p-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Dato Técnico</th>
                <th className="p-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Valor</th>
                <th className="p-4 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {techData.map((data) => (
                <tr key={data.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 text-gray-300">{data.dataType}</td>
                  <td className="p-4 text-[#00f6ff] font-mono">{data.value}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => deleteTechData(data.id)} className="text-gray-500 hover:text-red-500">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Agregar Dato Técnico">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="dataType" className="block text-sm font-medium text-gray-400 mb-1">Tipo de Dato</label>
            <input
              type="text" id="dataType" name="dataType" value={newTechData.dataType} onChange={handleInputChange} required
              className="w-full bg-black/50 border border-gray-700 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-[#00f6ff] focus:border-[#00f6ff] outline-none transition-all duration-300"
              placeholder="Ej: Torque tornillo cárter"
            />
          </div>
          <div>
            <label htmlFor="value" className="block text-sm font-medium text-gray-400 mb-1">Valor</label>
            <input
              type="text" id="value" name="value" value={newTechData.value} onChange={handleInputChange} required
              className="w-full bg-black/50 border border-gray-700 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-[#00f6ff] focus:border-[#00f6ff] outline-none transition-all duration-300"
              placeholder="Ej: 25 Nm"
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

export default TechDataView;