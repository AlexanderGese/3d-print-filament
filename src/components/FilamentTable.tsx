import React, { useState, useMemo } from 'react';
    import { ArrowRight, Trash2, ShoppingCart, Search, CheckCircle, CheckCircle2 } from 'lucide-react';
    import { FilamentItem, TabType } from '../types';
    import { EditOrderModal } from './EditOrderModal';

    interface FilamentTableProps {
      items: FilamentItem[];
      currentTab: TabType;
      onMove: (item: FilamentItem) => void;
      onDelete: (id: string) => void;
    }

    export function FilamentTable({ items, currentTab, onMove, onDelete }: FilamentTableProps) {
      const total = items.reduce((sum, item) => sum + item.price, 0);
      const [showEditModal, setShowEditModal] = useState(false);
      const [editItem, setEditItem] = useState<FilamentItem | null>(null);
      const [searchQuery, setSearchQuery] = useState('');
      const [sortConfig, setSortConfig] = useState<{ key: keyof FilamentItem | null, direction: 'ascending' | 'descending' | null }>({ key: null, direction: null });
      const [currentPage, setCurrentPage] = useState(1);
      const itemsPerPage = 5;
      const [selectedItems, setSelectedItems] = useState<string[]>([]);

      const handleDoubleClick = (item: FilamentItem) => {
        setEditItem(item);
        setShowEditModal(true);
      };

      const handleSaveEdit = (editedItem: FilamentItem) => {
        // Here you would typically make an API call to update the item
        // For now, we'll just log the edited item
        console.log('Saving:', editedItem);
        setShowEditModal(false);
        setEditItem(null);
      };

      const handleCancelEdit = () => {
        setShowEditModal(false);
        setEditItem(null);
      };

      const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
      };

      const handleSort = (key: keyof FilamentItem) => {
        let direction: 'ascending' | 'descending' | null = 'ascending';
        if (sortConfig.key === key) {
          direction = sortConfig.direction === 'ascending' ? 'descending' : null;
        }
        setSortConfig({ key, direction });
      };

      const filteredItems = useMemo(() => {
        return items.filter(item =>
          Object.values(item).some(value =>
            String(value).toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      }, [items, searchQuery]);

      const sortedItems = useMemo(() => {
        if (!sortConfig.key || !sortConfig.direction) {
          return filteredItems;
        }
        return [...filteredItems].sort((a, b) => {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
          return 0;
        });
      }, [filteredItems, sortConfig]);

      const paginatedItems = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return sortedItems.slice(startIndex, endIndex);
      }, [sortedItems, currentPage]);

      const totalPages = useMemo(() => Math.ceil(sortedItems.length / itemsPerPage), [sortedItems, itemsPerPage]);

      const handlePageChange = (page: number) => {
        setCurrentPage(page);
      };

      const handleSelect = (id: string) => {
        setSelectedItems(prev => {
          if (prev.includes(id)) {
            return prev.filter(item => item !== id);
          } else {
            return [...prev, id];
          }
        });
      };

      const handleBulkMove = () => {
        selectedItems.forEach(id => {
          const item = items.find(item => item.id === id);
          if (item) {
            onMove(item);
          }
        });
        setSelectedItems([]);
      };

      const handleBulkDelete = () => {
        selectedItems.forEach(id => {
          onDelete(id);
        });
        setSelectedItems([]);
      };

      const isItemSelected = (id: string) => selectedItems.includes(id);

      return (
        <div className="w-full">
          <div className="flex items-center justify-between mb-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-3 py-2 bg-black/50 border border-purple-500/20 rounded-lg 
                          text-gray-200 focus:outline-none focus:border-purple-500"
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
            </div>
            {selectedItems.length > 0 && (
              <div className="flex gap-2">
                <button onClick={handleBulkMove} className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 btn-animated neon-button">
                  Move Selected
                </button>
                <button onClick={handleBulkDelete} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 btn-animated neon-button">
                  Delete Selected
                </button>
              </div>
            )}
          </div>
          <div className="overflow-x-auto rounded-lg bg-black/20 backdrop-blur-lg border border-purple-500/20 neon-border">
            <table className="min-w-full divide-y divide-purple-500/20">
              <thead>
                <tr className="text-purple-400 neon-text">
                  <th className="px-6 py-3 text-left cursor-pointer" onClick={() => handleSort('name')}>
                    Name
                  </th>
                  <th className="px-6 py-3 text-left cursor-pointer" onClick={() => handleSort('filament')}>
                    Filament
                  </th>
                  <th className="px-6 py-3 text-left cursor-pointer" onClick={() => handleSort('type')}>
                    Type
                  </th>
                  <th className="px-6 py-3 text-left cursor-pointer" onClick={() => handleSort('weight')}>
                    Weight (g)
                  </th>
                  <th className="px-6 py-3 text-left cursor-pointer" onClick={() => handleSort('price')}>
                    Price (€)
                  </th>
                  <th className="px-6 py-3 text-left">Color</th>
                  <th className="px-6 py-3 text-left">Link</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/20">
                {paginatedItems.map((item) => (
                  <tr
                    key={item.id}
                    className={`text-gray-300 hover:bg-black/30 table-row-animated ${isItemSelected(item.id) ? 'bg-purple-900/30' : ''}`}
                    onDoubleClick={() => handleDoubleClick(item)}
                  >
                    <td className="px-6 py-4">
                      <button onClick={() => handleSelect(item.id)} className="flex items-center">
                        {isItemSelected(item.id) ? <CheckCircle2 size={18} className="text-purple-400" /> : <CheckCircle size={18} className="text-gray-400" />}
                        <span className="ml-2">{item.name}</span>
                      </button>
                    </td>
                    <td className="px-6 py-4">{item.filament}</td>
                    <td className="px-6 py-4">{item.type}</td>
                    <td className="px-6 py-4">{item.weight}</td>
                    <td className="px-6 py-4">{item.price.toFixed(2)}</td>
                    <td className="px-6 py-4">{item.color}</td>
                    <td className="px-6 py-4">
                      <a href={item.link} target="_blank" rel="noopener noreferrer" 
                         className="text-purple-400 hover:text-purple-300">Link</a>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => onMove(item)}
                          className="p-1 hover:bg-purple-500/20 rounded"
                        >
                          {currentTab === 'instock' ? <ShoppingCart size={18} /> : <ArrowRight size={18} />}
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          className="p-1 hover:bg-red-500/20 rounded"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {currentTab === 'cart' && (
            <div className="mt-4 text-right text-purple-400 neon-text">
              <p className="text-lg">Total: €{total.toFixed(2)}</p>
            </div>
          )}
          {showEditModal && editItem && (
            <EditOrderModal
              item={editItem}
              onClose={handleCancelEdit}
              onSave={handleSaveEdit}
            />
          )}
          {sortedItems.length > itemsPerPage && (
            <div className="flex justify-center mt-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 mx-1 rounded-md ${currentPage === page ? 'bg-purple-600 text-white' : 'bg-black/20 text-purple-400 hover:bg-black/30'} neon-button`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }
