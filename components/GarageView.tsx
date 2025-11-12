import React, { useState, useEffect } from 'react';
import { Motorcycle } from '../types';
import Modal from './Modal';
import { PlusIcon, MotorcycleIcon } from './icons';

interface GarageViewProps {
  motorcycles: Motorcycle[];
  addMotorcycle: (motoData: Omit<Motorcycle, 'id' | 'photo'>, photoFile: File | null) => Promise<void>;
}

const FormInput = ({ label, name, type, value, onChange, required = true }: any) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full bg-black/50 border border-gray-700 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-[#00f6ff] focus:border-[#00f6ff] outline-none transition-all duration-300"
    />
  </div>
);

const GarageView: React.FC<GarageViewProps> = ({ motorcycles, addMotorcycle }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newMoto, setNewMoto] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    nickname: '',
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMoto(prev => ({ ...prev, [name]: name === 'year' ? parseInt(value) : value }));
  };
  
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("La imagen es muy grande. El tamaño máximo es 5MB.");
        e.target.value = '';
        return;
      }
      setPhotoFile(file);
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setNewMoto({
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      nickname: '',
    });
    setPhotoFile(null);
    if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
    }
    setPhotoPreview(null);
    const fileInput = document.getElementById('photo') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMoto.brand || !newMoto.model || !newMoto.nickname || !newMoto.year) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      await addMotorcycle(newMoto, photoFile);
      resetForm();
    } catch (error) {
      console.error("Failed to add motorcycle:", error);
      alert("No se pudo guardar la moto. Por favor, inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="hidden md:block text-3xl font-bold text-white">Mi Garage</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#00f6ff] hover:shadow-lg hover:shadow-[#00f6ff]/40 text-black font-bold py-2 px-4 rounded-lg flex items-center transition-all transform hover:scale-105 shadow-md"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Agregar Moto
        </button>
      </div>

      {motorcycles.length === 0 ? (
        <div className="text-center py-20 bg-[#1a1a1a] rounded-lg border-2 border-dashed border-gray-700">
          <MotorcycleIcon className="w-16 h-16 mx-auto text-gray-500" />
          <p className="mt-4 text-lg text-gray-400">Aún no tienes motos en tu garage.</p>
          <p className="text-gray-500">¡Haz clic en "Agregar Moto" para empezar!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {motorcycles.map((moto) => (
            <div key={moto.id} className="bg-[#1a1a1a] rounded-lg shadow-md overflow-hidden border border-white/10 transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:shadow-[#00f6ff]/20 hover:border-[#00f6ff]/50">
              <img 
                src={moto.photo || `https://source.unsplash.com/random/400x250/?motorcycle&sig=${moto.id}`}
                alt={moto.nickname} 
                className="w-full h-48 object-cover" 
              />
              <div className="p-4">
                <h3 className="text-xl font-bold text-[#00f6ff]">{moto.nickname}</h3>
                <p className="text-gray-300">{moto.brand} {moto.model}</p>
                <p className="text-sm text-gray-500">{moto.year}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={resetForm} title="Agregar Nueva Moto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput label="Marca" name="brand" type="text" value={newMoto.brand} onChange={handleInputChange} />
          <FormInput label="Modelo" name="model" type="text" value={newMoto.model} onChange={handleInputChange} />
          <FormInput label="Año" name="year" type="number" value={newMoto.year} onChange={handleInputChange} />
          <FormInput label="Apodo" name="nickname" type="text" value={newMoto.nickname} onChange={handleInputChange} />
          <div>
            <label htmlFor="photo" className="block text-sm font-medium text-gray-400 mb-1">Foto</label>
            <input
              type="file"
              id="photo"
              name="photo"
              accept="image/*"
              onChange={handlePhotoChange}
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#00f6ff]/20 file:text-[#00f6ff] hover:file:bg-[#00f6ff]/30 cursor-pointer"
            />
            {photoPreview && <img src={photoPreview} alt="Preview" className="mt-4 rounded-lg max-h-40 object-contain" />}
          </div>
          <div className="pt-4 flex justify-end">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-[#00f6ff] hover:shadow-lg hover:shadow-[#00f6ff]/40 text-black font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-wait"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Moto'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default GarageView;