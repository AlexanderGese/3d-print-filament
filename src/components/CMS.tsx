import React, { useState } from 'react';
    import { X, Trash2, Edit } from 'lucide-react';
    import { Store, PreconfigFilament } from '../types';
    import { useFirebaseData } from '../hooks/useFirebaseData';

    interface CMSProps {
      onClose: () => void;
    }

    export function CMS({ onClose }: CMSProps) {
      const [newStore, setNewStore] = useState<Omit<Store, 'id'>>({
        name: '',
        description: '',
        link: ''
      });
      const [newPreconfig, setNewPreconfig] = useState<Omit<PreconfigFilament, 'id'>>({
        filament: '',
        type: '',
        weight: 0,
        price: 0,
        link: '',
        description: '',
        color: ''
      });
      const {
        stores,
        preconfigs,
        addStore,
        addPreconfig,
        deleteStore,
        deletePreconfig
      } = useFirebaseData();

      const handleAddStore = async () => {
        await addStore(newStore);
        setNewStore({ name: '', description: '', link: '' });
      };

      const handleAddPreconfig = async () => {
        await addPreconfig(newPreconfig);
        setNewPreconfig({ filament: '', type: '', weight: 0, price: 0, link: '', description: '', color: '' });
      };

      return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 modal-animated">
          <div className="bg-black/90 backdrop-blur-lg p-6 rounded-lg w-full max-w-4xl border border-purple-500/20 overflow-y-auto neon-border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-purple-400 neon-text">Content Management System</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg text-purple-400 mb-2 neon-text">Add New Store</h3>
                <div className="space-y-2">
                  {Object.keys(newStore).map((key) => (
                    <div key={key}>
                      <label className="block text-sm text-purple-400 mb-1 capitalize">
                        {key}
                      </label>
                      <input
                        type="text"
                        value={newStore[key as keyof typeof newStore]}
                        onChange={(e) => setNewStore({ ...newStore, [key]: e.target.value })}
                        className="w-full px-3 py-2 bg-black/50 border border-purple-500/20 rounded-lg 
                                  text-gray-200 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  ))}
                  <button
                    onClick={handleAddStore}
                    className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg 
                             transition-colors duration-200 btn-animated neon-button"
                  >
                    Add Store
                  </button>
                </div>
                <h3 className="text-lg text-purple-400 mt-4 mb-2 neon-text">Current Stores</h3>
                <ul>
                  {stores && stores.map((store) => (
                    <li key={store.id} className="text-gray-300 flex items-center justify-between">
                      {store.name}
                      <div className="flex gap-2">
                        <button onClick={() => console.log('edit store', store)} className="p-1 hover:bg-purple-500/20 rounded">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => deleteStore(store.id)} className="p-1 hover:bg-red-500/20 rounded">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg text-purple-400 mb-2 neon-text">Add New Preconfig</h3>
                <div className="space-y-2">
                  {Object.keys(newPreconfig).map((key) => (
                    <div key={key}>
                      <label className="block text-sm text-purple-400 mb-1 capitalize">
                        {key}
                      </label>
                      <input
                        type={key === 'weight' || key === 'price' ? 'number' : 'text'}
                        step={key === 'price' ? '0.01' : '1'}
                        value={newPreconfig[key as keyof typeof newPreconfig]}
                        onChange={(e) => setNewPreconfig({ ...newPreconfig, [key]: key === 'weight' || key === 'price' ? Number(e.target.value) : e.target.value })}
                        className="w-full px-3 py-2 bg-black/50 border border-purple-500/20 rounded-lg 
                                  text-gray-200 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  ))}
                  <button
                    onClick={handleAddPreconfig}
                    className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg 
                             transition-colors duration-200 btn-animated neon-button"
                  >
                    Add Preconfig
                  </button>
                </div>
                <h3 className="text-lg text-purple-400 mt-4 mb-2 neon-text">Current Preconfigs</h3>
                <ul>
                  {preconfigs && preconfigs.map((preconfig) => (
                    <li key={preconfig.id} className="text-gray-300 flex items-center justify-between">
                      {preconfig.filament}
                      <div className="flex gap-2">
                        <button onClick={() => console.log('edit preconfig', preconfig)} className="p-1 hover:bg-purple-500/20 rounded">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => deletePreconfig(preconfig.id)} className="p-1 hover:bg-red-500/20 rounded">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      );
    }
