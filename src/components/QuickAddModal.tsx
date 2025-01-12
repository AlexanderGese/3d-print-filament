import React, { useState } from 'react';
    import { X } from 'lucide-react';
    import { FilamentItem } from '../types';

    interface QuickAddModalProps {
      onClose: () => void;
      onSave: (item: Omit<FilamentItem, 'id'>) => void;
    }

    export function QuickAddModal({ onClose, onSave }: QuickAddModalProps) {
      const [formData, setFormData] = useState({
        name: '',
        filament: 'Generic',
        type: 'PLA',
        weight: 1000,
        price: 20,
        link: '',
        color: 'black'
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 modal-animated">
          <div className="bg-black/90 backdrop-blur-lg p-6 rounded-lg w-full max-w-md border border-purple-500/20 neon-border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-purple-400 neon-text">Quick Add Filament</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-purple-400 mb-1 capitalize">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-black/50 border border-purple-500/20 rounded-lg 
                            text-gray-200 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg 
                         transition-colors duration-200 btn-animated neon-button"
              >
                Add to Cart
              </button>
            </form>
          </div>
        </div>
      );
    }
