import React from 'react';
import { ArrowRight, Trash2, ShoppingCart } from 'lucide-react';
import { FilamentItem, TabType } from '../types';

interface FilamentTableProps {
  items: FilamentItem[];
  currentTab: TabType;
  onMove: (item: FilamentItem) => void;
  onDelete: (id: string) => void;
}

export function FilamentTable({ items, currentTab, onMove, onDelete }: FilamentTableProps) {
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-lg bg-white/10 backdrop-blur-lg border border-purple-500/20">
        <table className="min-w-full divide-y divide-purple-500/20">
          <thead>
            <tr className="text-purple-200">
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Filament</th>
              <th className="px-6 py-3 text-left">Type</th>
              <th className="px-6 py-3 text-left">Weight (g)</th>
              <th className="px-6 py-3 text-left">Price (€)</th>
              <th className="px-6 py-3 text-left">Link</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-500/20">
            {items.map((item) => (
              <tr key={item.id} className="text-gray-300 hover:bg-purple-900/20">
                <td className="px-6 py-4">{item.name}</td>
                <td className="px-6 py-4">{item.filament}</td>
                <td className="px-6 py-4">{item.type}</td>
                <td className="px-6 py-4">{item.weight}</td>
                <td className="px-6 py-4">{item.price.toFixed(2)}</td>
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
        <div className="mt-4 text-right text-purple-200">
          <p className="text-lg">Total: €{total.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}