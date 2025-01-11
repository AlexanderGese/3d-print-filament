import React, { useState } from 'react';
import { X } from 'lucide-react';
import { FilamentItem } from '../types';

interface AddOrderModalProps {
  onClose: () => void;
  onSave: (item: Omit<FilamentItem, 'id'>) => void;
}

export function AddOrderModal({ onClose, onSave }: AddOrderModalProps) {
  const [formData, setFormData] = useState({
    filament: '',
    type: '',
    weight: '',
    price: '',
    link: '',
    name: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      weight: Number(formData.weight),
      price: Number(formData.price)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900/90 backdrop-blur-lg p-6 rounded-lg w-full max-w-md border border-purple-500/20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-purple-200">Add New Order</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.keys(formData).map((field) => (
            <div key={field}>
              <label className="block text-sm text-purple-200 mb-1 capitalize">
                {field}
              </label>
              <input
                type={field === 'weight' || field === 'price' ? 'number' : 'text'}
                step={field === 'price' ? '0.01' : '1'}
                value={formData[field as keyof typeof formData]}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  [field]: e.target.value
                }))}
                className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/20 rounded-lg 
                          text-gray-200 focus:outline-none focus:border-purple-500"
                required
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg 
                     transition-colors duration-200"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}