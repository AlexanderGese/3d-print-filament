import React from 'react';
    import { X } from 'lucide-react';

    interface TutorialModalProps {
      onClose: () => void;
    }

    export function TutorialModal({ onClose }: TutorialModalProps) {
      return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 modal-animated">
          <div className="bg-black/90 backdrop-blur-lg p-6 rounded-lg w-full max-w-2xl border border-purple-500/20 neon-border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-purple-400 neon-text">Tutorial</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>
                Welcome to the Filament Manager! This tool helps you manage your 3D printing filament inventory.
              </p>
              <h3 className="text-lg text-purple-400 neon-text">Tabs</h3>
              <p>
                Use the tabs at the top to navigate between different sections:
              </p>
              <ul>
                <li>
                  <b>Cart:</b> View and manage filaments you want to order.
                </li>
                <li>
                  <b>Ordered:</b> See filaments that have been ordered.
                </li>
                <li>
                  <b>Instock:</b> Track filaments that are currently in stock.
                </li>
                <li>
                  <b>German Stores:</b> Browse a list of popular German filament stores.
                </li>
                <li>
                  <b>Preconfig:</b> Add preconfigured filaments to your cart.
                </li>
              </ul>
              <h3 className="text-lg text-purple-400 neon-text">Table Interactions</h3>
              <p>
                In the cart, ordered, and instock tabs:
              </p>
              <ul>
                <li>
                  Double-click a row to edit the filament details.
                </li>
                <li>
                  Click the arrow button to move a filament to the next stage.
                </li>
                <li>
                  Click the trash icon to delete a filament.
                </li>
              </ul>
              <h3 className="text-lg text-purple-400 neon-text">Adding Orders</h3>
              <p>
                In the cart tab, click "Add Order" to add a new filament to your cart.
              </p>
              <h3 className="text-lg text-purple-400 neon-text">Exporting</h3>
              <p>
                In the cart tab, click "Export TXT" to export a list of filament links.
              </p>
            </div>
          </div>
        </div>
      );
    }
