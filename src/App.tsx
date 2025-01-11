import React, { useState } from 'react';
import { Plus, Download, LogOut, Github, Coffee } from 'lucide-react';
import { FilamentTable } from './components/FilamentTable';
import { AddOrderModal } from './components/AddOrderModal';
import { StoreList } from './components/StoreList';
import { PreconfigList } from './components/PreconfigList';
import { FilamentItem, Store, PreconfigFilament, TabType } from './types';
import { useFirebaseData } from './hooks/useFirebaseData';

const GERMAN_STORES: Store[] = [
  {
    name: "3D-Jake",
    description: "Wide selection of 3D printing materials and accessories",
    link: "https://www.3djake.de"
  },
  {
    name: "Das Filament",
    description: "Premium quality filaments made in Germany",
    link: "https://dasfilament.de"
  },
  {
    name: "Filamentworld",
    description: "Extensive range of 3D printing materials",
    link: "https://www.filamentworld.de"
  }
];

const PRECONFIG_FILAMENTS: PreconfigFilament[] = [
  {
    id: "1",
    filament: "PLA Premium",
    type: "PLA",
    weight: 1000,
    price: 24.99,
    link: "https://dasfilament.de/filament-spulen/pla-1-75-mm/4/pla-filament-1-75-mm-schwarz",
    description: "High-quality PLA filament, perfect for general purpose printing"
  },
  {
    id: "2",
    filament: "PETG Crystal Clear",
    type: "PETG",
    weight: 750,
    price: 29.99,
    link: "https://www.3djake.de/3djake/petg-transparent",
    description: "Crystal clear PETG for transparent prints"
  },
  {
    id: "3",
    filament: "TPU Flex",
    type: "TPU",
    weight: 500,
    price: 34.99,
    link: "https://www.filamentworld.de/shop/tpu-95a-filament-1-75-mm/",
    description: "Flexible TPU filament for elastic prints"
  }
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentTab, setCurrentTab] = useState<TabType>('cart');
  
  const {
    cartItems,
    orderedItems,
    instockItems,
    addItem,
    moveItem,
    deleteItem
  } = useFirebaseData();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin') {
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
  };

  const handleAddItem = (item: Omit<FilamentItem, 'id'>) => {
    addItem(item);
  };

  const handleMove = (item: FilamentItem) => {
    if (currentTab === 'cart') {
      moveItem(item, 'cart', 'ordered');
    } else if (currentTab === 'ordered') {
      moveItem(item, 'ordered', 'instock');
    } else {
      moveItem(item, 'instock', 'cart');
    }
  };

  const handleDelete = (id: string) => {
    deleteItem(id, currentTab);
  };

  const exportTxt = () => {
    const content = cartItems.map(item => `${item.name}: ${item.link}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'filament-links.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 rounded-lg bg-white/10 backdrop-blur-lg border border-purple-500/20">
          <h1 className="text-2xl text-purple-200 mb-6 text-center">Filament Manager</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-2 bg-gray-800/50 border border-purple-500/20 rounded-lg 
                        text-gray-200 focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg 
                       transition-colors duration-200"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {['cart', 'ordered', 'instock', 'german-stores', 'preconfig'].map((tab) => (
              <button
                key={tab}
                onClick={() => setCurrentTab(tab as TabType)}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 
                          ${currentTab === tab 
                            ? 'bg-purple-600 text-white' 
                            : 'bg-white/10 text-purple-200 hover:bg-white/20'}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 
                     rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

        {currentTab === 'cart' && (
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 
                       text-white rounded-lg transition-colors duration-200"
            >
              <Plus size={20} /> Add Order
            </button>
            <button
              onClick={exportTxt}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 
                       text-purple-200 rounded-lg transition-colors duration-200"
            >
              <Download size={20} /> Export TXT
            </button>
          </div>
        )}

        {currentTab === 'german-stores' ? (
          <StoreList stores={GERMAN_STORES} />
        ) : currentTab === 'preconfig' ? (
          <PreconfigList preconfigs={PRECONFIG_FILAMENTS} onAddToCart={handleAddItem} />
        ) : (
          <FilamentTable
            items={
              currentTab === 'cart' ? cartItems :
              currentTab === 'ordered' ? orderedItems :
              instockItems
            }
            currentTab={currentTab as TabType}
            onMove={handleMove}
            onDelete={handleDelete}
          />
        )}

        <div className="fixed bottom-4 right-4 flex gap-2">
          <a
            href="https://github.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-white/10 hover:bg-white/20 text-purple-200 rounded-lg 
                     transition-colors duration-200"
          >
            <Github size={24} />
          </a>
          <a
            href="https://ko-fi.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-white/10 hover:bg-white/20 text-purple-200 rounded-lg 
                     transition-colors duration-200"
          >
            <Coffee size={24} />
          </a>
        </div>
      </div>

      {showAddModal && (
        <AddOrderModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddItem}
        />
      )}
    </div>
  );
}

export default App;