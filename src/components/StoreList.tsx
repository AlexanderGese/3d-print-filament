import React from 'react';
import { Store } from '../types';

interface StoreListProps {
  stores: Store[];
}

export function StoreList({ stores }: StoreListProps) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {stores.map((store, index) => (
        <div key={index} className="p-6 rounded-lg bg-white/10 backdrop-blur-lg border border-purple-500/20">
          <h3 className="text-xl text-purple-200 mb-2">{store.name}</h3>
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
  );
}