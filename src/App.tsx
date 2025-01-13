import React, { useState, useEffect, useRef } from 'react';
    import { Plus, Download, LogOut, Github, Coffee, Globe, Settings, HelpCircle, Bolt } from 'lucide-react';
    import { FilamentTable } from './components/FilamentTable';
    import { AddOrderModal } from './components/AddOrderModal';
    import { StoreList } from './components/StoreList';
    import { PreconfigList } from './components/PreconfigList';
    import { FilamentItem, Store, PreconfigFilament, TabType } from './types';
    import { useFirebaseData } from './hooks/useFirebaseData';
    import { CMS } from './components/CMS';
    import { TutorialModal } from './components/TutorialModal';

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
        description: "High-quality PLA filament, perfect for general purpose printing",
        color: "black"
      },
      {
        id: "2",
        filament: "PETG Crystal Clear",
        type: "PETG",
        weight: 750,
        price: 29.99,
        link: "https://www.3djake.de/3djake/petg-transparent",
        description: "Crystal clear PETG for transparent prints",
        color: "transparent"
      },
      {
        id: "3",
        filament: "TPU Flex",
        type: "TPU",
        weight: 500,
        price: 34.99,
        link: "https://www.filamentworld.de/shop/tpu-95a-filament-1-75-mm/",
        description: "Flexible TPU filament for elastic prints",
        color: "red"
      }
    ];

    function App() {
      const [isAuthenticated, setIsAuthenticated] = useState(false);
      const [password, setPassword] = useState('');
      const [showAddModal, setShowAddModal] = useState(false);
      const [currentTab, setCurrentTab] = useState<TabType>('cart');
      const [showCMS, setShowCMS] = useState(false);
      const [showRickRoll, setShowRickRoll] = useState(false);
      const videoRef = useRef<HTMLVideoElement | null>(null);
      const [loading, setLoading] = useState(false);
      const [userName, setUserName] = useState('');
      const [showTutorial, setShowTutorial] = useState(false);
      
      const {
        cartItems,
        orderedItems,
        instockItems,
        addItem,
        moveItem,
        deleteItem
      } = useFirebaseData();

      useEffect(() => {
        document.body.classList.add('tokyo-midnight');
        return () => {
          document.body.classList.remove('tokyo-midnight');
        };
      }, []);

      const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
          if (password === 'sabaton3d') {
            setIsAuthenticated(true);
            setUserName('User');
          } else if (password === 'cms') {
            setShowCMS(true);
            setUserName('CMS User');
          } else {
            setShowRickRoll(true);
            if (videoRef.current) {
              videoRef.current.play();
            }
          }
          setLoading(false);
        }, 500);
      };

      const handleLogout = () => {
        setIsAuthenticated(false);
        setPassword('');
        setShowCMS(false);
        setShowRickRoll(false);
        setUserName('');
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      };

      const handleRickRollEnd = () => {
        setShowRickRoll(false);
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
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
        const groupedLinks = cartItems.reduce((acc, item) => {
          try {
            const url = new URL(item.link);
            const domain = url.hostname;
            acc[domain] = acc[domain] || [];
            acc[domain].push(`${item.name}: ${item.link}`);
          } catch (e) {
            acc['unknown'] = acc['unknown'] || [];
            acc['unknown'].push(`${item.name}: ${item.link}`);
          }
          return acc;
        }, {} as { [domain: string]: string[] });

        const content = Object.entries(groupedLinks)
          .map(([domain, links]) => `\n--- ${domain} ---\n${links.join('\n')}`)
          .join('\n');

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'filament-links.txt';
        a.click();
        URL.revokeObjectURL(url);
      };

      const handleTabChange = (tab: TabType) => {
        setLoading(true);
        setTimeout(() => {
          setCurrentTab(tab);
          setLoading(false);
        }, 300);
      };

      if (!isAuthenticated && !showCMS && !showRickRoll) {
        return (
          <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md p-8 rounded-lg bg-black/20 backdrop-blur-lg border border-purple-500/20 neon-border">
              <h1 className="text-2xl text-purple-400 mb-6 text-center neon-text">Filament Manager</h1>
              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-2 bg-black/50 border border-purple-500/20 rounded-lg 
                            text-gray-200 focus:outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg 
                           transition-colors duration-200 btn-animated neon-button"
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        );
      }

      if (showCMS) {
        return <CMS onClose={handleLogout} />;
      }

      if (showRickRoll) {
        window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
        return null;
      }
      

      return (
        <div className="min-h-screen bg-gray-900 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                {['cart', 'ordered', 'instock', 'german-stores', 'preconfig'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleTabChange(tab as TabType)}
                    className={`px-4 py-2 rounded-lg transition-colors duration-200 tab-button
                              ${currentTab === tab 
                                ? 'bg-purple-600 text-white active' 
                                : 'bg-black/20 text-purple-400 hover:bg-black/30'} btn-animated neon-button`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    <span></span>
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowTutorial(true)}
                  className="px-4 py-2 bg-black/20 hover:bg-black/30 text-purple-400 
                           rounded-lg transition-colors duration-200 flex items-center gap-2 btn-animated neon-button"
                >
                  <HelpCircle size={18} /> Tutorial
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white
                           rounded-lg transition-colors duration-200 flex items-center gap-2 btn-animated neon-button"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </div>
            {userName && (
              <div className="text-purple-400 text-xl mb-4 neon-text">
                Welcome, {userName}!
              </div>
            )}

            {currentTab === 'cart' && (
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 
                           text-white rounded-lg transition-colors duration-200 btn-animated neon-button"
                >
                  <Plus size={20} /> Add Order
                </button>
                <button
                  onClick={exportTxt}
                  className="flex items-center gap-2 px-4 py-2 bg-black/20 hover:bg-black/30 
                           text-purple-400 rounded-lg transition-colors duration-200 btn-animated neon-button"
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
                href="https://github.com/AlexanderGese"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-black/20 hover:bg-black/30 text-purple-400 rounded-lg 
                         transition-colors duration-200 btn-animated neon-button"
              >
                <Github size={24} />
              </a>
              <a
                href="https://alexander-gese.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-black/20 hover:bg-black/30 text-purple-400 rounded-lg 
                         transition-colors duration-200 btn-animated neon-button"
              >
                <Globe size={24} />
              </a>
              <a
                href="https://ko-fi.com/alexandergese"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-black/20 hover:bg-black/30 text-purple-400 rounded-lg 
                         transition-colors duration-200 btn-animated neon-button"
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
          {showTutorial && (
            <TutorialModal onClose={() => setShowTutorial(false)} />
          )}
          {loading && (
            <div className="loading-indicator">
              <div className="loading-spinner"></div>
            </div>
          )}
        </div>
      );
    }

    export default App;
