
import React from 'react';
import { ItemIcon } from './icons';

interface InventoryProps {
  items: string[];
}

const Inventory: React.FC<InventoryProps> = ({ items }) => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-2 text-purple-400">My Inventory</h2>
      <p className="text-center text-slate-400 mb-8">Unique items earned from completing quests.</p>
      
      {items.length === 0 ? (
        <div className="text-center bg-slate-800/50 p-10 rounded-lg border border-dashed border-slate-700">
          <p className="text-slate-400">Your inventory is empty.</p>
          <p className="text-slate-500 text-sm">Complete quests to earn special items!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map((item, index) => (
            <div key={index} className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex flex-col items-center justify-center aspect-square transition-all hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10">
              <ItemIcon className="w-12 h-12 text-purple-400 mb-2"/>
              <p className="text-sm font-semibold text-center text-slate-300">{item}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Inventory;
