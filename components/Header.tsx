import React from 'react';
import { Player, View } from '../types';
import { TokenIcon, XPLogIcon, InventoryIcon, QuestIcon, LedgerIcon, SmartContractIcon } from './icons';

interface HeaderProps {
  player: Player;
  onNavigate: (view: View) => void;
  currentView: View;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'bg-sky-500 text-white shadow-md'
        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
    }`}
  >
    {icon}
    <span className="hidden md:inline">{label}</span>
  </button>
);

const Header: React.FC<HeaderProps> = ({ player, onNavigate, currentView }) => {
  const xpPercentage = (player.xp % 1000) / 10; // Assuming 1000 XP per level

  return (
    <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-sky-400">EduChain Quest</h1>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <nav className="flex items-center space-x-1 sm:space-x-2 bg-slate-900 p-1 rounded-lg">
                <NavItem label="Quests" icon={<QuestIcon />} isActive={currentView === View.Quests} onClick={() => onNavigate(View.Quests)} />
                <NavItem label="Inventory" icon={<InventoryIcon />} isActive={currentView === View.Inventory} onClick={() => onNavigate(View.Inventory)} />
                <NavItem label="Ledger" icon={<LedgerIcon />} isActive={currentView === View.Ledger} onClick={() => onNavigate(View.Ledger)} />
                <NavItem label="Contract" icon={<SmartContractIcon />} isActive={currentView === View.SmartContract} onClick={() => onNavigate(View.SmartContract)} />
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-slate-700/50 px-3 py-1.5 rounded-full">
              <TokenIcon />
              <span className="font-semibold text-amber-400">{player.tokens.toFixed(2)}</span>
            </div>
            <div className="flex items-center space-x-2">
                <div className="w-24 bg-slate-700 rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${xpPercentage}%` }}></div>
                </div>
                 <span className="text-sm font-semibold text-green-400">Lvl {player.level}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
