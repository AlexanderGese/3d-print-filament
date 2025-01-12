import React, { useState, useMemo } from 'react';
    import { Store } from '../types';
    import { Search } from 'lucide-react';
    import { useFirebaseData } from '../hooks/useFirebaseData';

    interface StoreListProps {
    }

    export function StoreList() {
      const [searchQuery, setSearchQuery] = useState('');
      const { stores } = useFirebaseData();

      const filteredStores = useMemo(() => {
        return stores?.filter(store =>
          Object.values(store).some(value =>
            String(value).toLowerCase().includes(searchQuery.toLowerCase())
          )
        ) || [];
      }, [stores, searchQuery]);

      const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
      };

      return (
        <div>
          <div className="relative flex-1 mb-4">
            <input
              type="text"
              placeholder="Search stores..."
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
            {filteredStores.map((store) => (
              <div key={store.id} className="p-6 rounded-lg bg-black/20 backdrop-blur-lg border border-purple-500/20 neon-border">
                <h3 className="text-xl text-purple-400 mb-2 neon-text">{store.name}</h3>
                <p className="text-gray-300 mb-4">{store.description}</p>
                <a
                  href={store.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300"
                >
                  Visit Store →
                </a>
              </div>
            ))}
          </div>
        </div>
      );
    }
