
import React from 'react';
import { Transaction } from '../types';
import { TokenIcon } from './icons';

interface LedgerProps {
  transactions: Transaction[];
}

const Ledger: React.FC<LedgerProps> = ({ transactions }) => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-2 text-green-400">Transaction Ledger</h2>
      <p className="text-center text-slate-400 mb-8">A transparent and immutable record of all your rewards.</p>
      
      <div className="bg-slate-800/50 rounded-lg border border-slate-700 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-900/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Transaction ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Description</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Reward</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-slate-500">No transactions yet.</td>
                </tr>
              ) : (
                [...transactions].reverse().map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/70 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-500">{tx.id.substring(0, 16)}...</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{tx.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1 text-amber-400">
                                <TokenIcon className="w-4 h-4" />
                                <span>{tx.tokens}</span>
                            </div>
                            {tx.item && (
                                <span className="text-purple-400">{tx.item}</span>
                            )}
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{new Date(tx.timestamp).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Ledger;
