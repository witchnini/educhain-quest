
import React from 'react';
import { Quest } from '../types';
import { TokenIcon, CheckCircleIcon } from './icons';

interface RewardModalProps {
  quest: Quest;
  onClose: () => void;
}

const RewardModal: React.FC<RewardModalProps> = ({ quest, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-fade-in">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.5s ease-out forwards; }
      `}</style>
      <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-md p-8 text-center animate-slide-up">
        <div className="mx-auto w-20 h-20 flex items-center justify-center bg-green-500/20 rounded-full mb-4">
          <CheckCircleIcon className="w-12 h-12 text-green-400" />
        </div>
        <h2 className="text-3xl font-bold text-green-400">Quest Complete!</h2>
        <p className="text-slate-300 mt-2 mb-6">You have successfully completed "{quest.title}".</p>

        <div className="bg-slate-900/50 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-slate-200">Rewards Claimed:</h3>
          <div className="flex items-center justify-center space-x-3 bg-slate-700/50 p-3 rounded-lg">
            <TokenIcon className="w-8 h-8 text-amber-300" />
            <span className="text-2xl font-bold text-amber-400">{quest.reward.tokens} Tokens</span>
          </div>
          {quest.reward.item && (
            <div className="flex items-center justify-center space-x-3 bg-slate-700/50 p-3 rounded-lg">
              <span className="text-2xl font-bold text-purple-400">{quest.reward.item}</span>
            </div>
          )}
        </div>

        <p className="text-xs text-slate-500 mt-6">
          This transaction has been recorded on the EduChain ledger.
        </p>

        <button
          onClick={onClose}
          className="w-full mt-4 px-6 py-3 font-bold rounded-lg bg-sky-600 text-white hover:bg-sky-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default RewardModal;
