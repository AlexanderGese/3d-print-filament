import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { PreconfigFilament, FilamentItem } from '../types';

interface PreconfigListProps {
  preconfigs: PreconfigFilament[];
  onAddToCart: (item: Omit<FilamentItem, 'id'>) => void;
}

export function PreconfigList({ preconfigs, onAddToCart }: PreconfigListProps) {
  const [name, setName] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleAddToCart = (preconfig: PreconfigFilament) => {
    if (!name) {
      setSelectedId(preconfig.id);
      return;
    }

    onAddToCart({
      filament: preconfig.filament,
      type: preconfig.type,
      weight: preconfig.weight,
      price: preconfig.price,
      link: preconfig.link,
      name: name
    });

    setName('');
    setSelectedId(null);
  };

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {preconfigs.map((preconfig) => (
        <div 
          key={preconfig.id} 
          className="p-6 rounded-lg bg-white/5 hover:bg-white/10 backdrop-blur-lg 
                   border border-purple-500/10 hover:border-purple-500/20 
                   transition-all duration-300"
        >
          <h3 className="text-xl text-purple-200 mb-2">{preconfig.filament}</h3>
          <p className="text-gray-400 mb-4">{preconfig.description}</p>
          <div className="space-y-2 text-sm text-gray-300">
            <p>Type: {preconfig.type}</p>
            <p>Weight: {preconfig.weight}g</p>
            <p>Price: €{preconfig.price.toFixed(2)}</p>
          </div>
          {selectedId === preconfig.id ? (
            <div className="mt-4 space-y-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/20 
                         rounded-lg text-gray-200 focus:outline-none focus:border-purple-500"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleAddToCart(preconfig)}
                  disabled={!name}
                  className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white 
                           rounded-lg transition-colors duration-200 disabled:opacity-50"
                >
                  Confirm
                </button>
                <button
                  onClick={() => {
                    setSelectedId(null);
                    setName('');
                  }}
                  className="flex-1 py-2 bg-gray-700/50 hover:bg-gray-700 text-white 
                           rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => handleAddToCart(preconfig)}
              className="mt-4 w-full py-2 bg-purple-600/80 hover:bg-purple-600 
                       text-white rounded-lg transition-colors duration-200 
                       flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Add to Cart
            </button>
          )}
        </div>
      ))}
    </div>
  );
}