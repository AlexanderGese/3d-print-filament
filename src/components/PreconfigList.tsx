import React, { useState, useMemo } from 'react';
    import { Plus, Search } from 'lucide-react';
    import { PreconfigFilament, FilamentItem } from '../types';
    import { useFirebaseData } from '../hooks/useFirebaseData';

    interface PreconfigListProps {
      onAddToCart: (item: Omit<FilamentItem, 'id'>) => void;
    }

    export function PreconfigList({ onAddToCart }: PreconfigListProps) {
      const [name, setName] = useState('');
      const [selectedId, setSelectedId] = useState<string | null>(null);
      const [searchQuery, setSearchQuery] = useState('');
      const { preconfigs } = useFirebaseData();

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
          name: name,
          color: preconfig.color
        });

        setName('');
        setSelectedId(null);
      };

      const filteredPreconfigs = useMemo(() => {
        return preconfigs?.filter(preconfig =>
          Object.values(preconfig).some(value =>
            String(value).toLowerCase().includes(searchQuery.toLowerCase())
          )
        ) || [];
      }, [preconfigs, searchQuery]);

      const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
      };

      return (
        <div>
          <div className="relative flex-1 mb-4">
            <input
              type="text"
              placeholder="Search preconfigs..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-3 py-2 bg-black/50 border border-purple-500/20 rounded-lg 
                        text-gray-200 focus:outline-none focus:border-purple-500"
            />
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
          </div>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredPreconfigs.map((preconfig) => (
              <div 
                key={preconfig.id} 
                className="p-6 rounded-lg bg-black/10 hover:bg-black/20 backdrop-blur-lg 
                         border border-purple-500/10 hover:border-purple-500/20 
                         transition-all duration-300"
              >
                <h3 className="text-xl text-purple-400 mb-2 neon-text">{preconfig.filament}</h3>
                <img 
                  src="https://source.unsplash.com/200x100/?filament" 
                  alt={preconfig.filament} 
                  className="w-full h-auto mb-4 rounded-md" 
                />
                <p className="text-gray-400 mb-4">{preconfig.description}</p>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>Type: {preconfig.type}</p>
                  <p>Weight: {preconfig.weight}g</p>
                  <p>Price: €{preconfig.price.toFixed(2)}</p>
                  <p>Color: {preconfig.color}</p>
                </div>
                {selectedId === preconfig.id ? (
                  <div className="mt-4 space-y-2">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full px-3 py-2 bg-black/50 border border-purple-500/20 
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
        </div>
      );
    }
