
import React, { useState, useEffect } from 'react';
import { Player } from '../types';
import { TokenIcon, SmartContractIcon, SpinnerIcon } from './icons';
import * as clarityService from '../services/clarityService';
import { StakingContractCode } from '../contracts/staking-contract';

interface SmartContractProps {
  player: Player;
  isWalletConnected: boolean;
  onConnectWallet: () => void;
  onStake: (amount: number) => Promise<void>;
  onUnstake: (amount: number) => Promise<void>;
  onClaim: () => Promise<void>;
}

interface ContractData {
  staked: number;
  rewards: number;
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-slate-900/50 p-4 rounded-lg flex items-center space-x-4">
        {icon}
        <div>
            <p className="text-sm text-slate-400">{title}</p>
            <p className="text-xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const ActionPanel: React.FC<{
    title: string;
    buttonText: string;
    balance: number;
    onAction: (amount: number) => Promise<void>;
    placeholder: string;
    disabled?: boolean;
}> = ({ title, buttonText, balance, onAction, placeholder, disabled = false }) => {
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAction = async () => {
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) return;
        
        setIsLoading(true);
        try {
            await onAction(numericAmount);
            setAmount('');
        } catch(e) {
            // Error is handled in App.tsx
        } finally {
            setIsLoading(false);
        }
    };
    
    const numericAmount = parseFloat(amount) || 0;

    return (
        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">{title}</h3>
            <p className="text-xs text-slate-500 mb-2">Available: {balance.toFixed(4)} Tokens</p>
            <div className="flex space-x-2">
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={placeholder}
                    className="flex-grow bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    disabled={isLoading || disabled}
                />
                <button
                    onClick={handleAction}
                    disabled={isLoading || disabled || numericAmount <= 0 || numericAmount > balance}
                    className="w-28 px-5 py-2 font-semibold rounded-md bg-sky-600 text-white hover:bg-sky-500 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed flex justify-center items-center"
                >
                    {isLoading ? <SpinnerIcon className="w-5 h-5" /> : buttonText}
                </button>
            </div>
        </div>
    );
};

const SmartContract: React.FC<SmartContractProps> = ({ player, isWalletConnected, onConnectWallet, onStake, onUnstake, onClaim }) => {
  const [contractData, setContractData] = useState<ContractData>({ staked: 0, rewards: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    if (!isWalletConnected) return;

    const fetchData = async () => {
        setIsLoading(true);
        const [staked, rewards] = await Promise.all([
            clarityService.fetchStakedBalance(),
            clarityService.fetchRewardBalance(),
        ]);
        setContractData({ staked, rewards });
        setIsLoading(false);
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Poll for new data every 5 seconds
    return () => clearInterval(interval);
  }, [isWalletConnected]);
  
  const handleClaim = async () => {
    setIsClaiming(true);
    try {
        await onClaim();
    } finally {
        setIsClaiming(false);
    }
  };
  
  if (!isWalletConnected) {
    return (
        <div className="max-w-2xl mx-auto text-center bg-slate-800/50 p-10 rounded-lg border border-dashed border-slate-700">
            <SmartContractIcon className="w-16 h-16 mx-auto text-sky-400 mb-4" />
            <h2 className="text-2xl font-bold text-slate-100">Interact with the Staking Contract</h2>
            <p className="text-slate-400 mt-2 mb-6">Connect your wallet to stake tokens and earn rewards from the Clarity smart contract.</p>
            <button
                onClick={onConnectWallet}
                className="px-8 py-3 font-bold rounded-lg bg-sky-600 text-white hover:bg-sky-500 transition-colors"
            >
                Connect Simulated Wallet
            </button>
        </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-sky-400">Clarity Staking Contract</h2>
        <p className="text-slate-400">Stake your tokens to earn passive rewards. All interactions are simulated on-chain.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Your Tokens Staked" 
            value={isLoading ? '...' : contractData.staked.toFixed(4)}
            icon={<SmartContractIcon className="w-8 h-8 text-sky-400"/>}
          />
          <StatCard 
            title="Claimable Rewards" 
            value={isLoading ? '...' : contractData.rewards.toFixed(4)}
            icon={<TokenIcon className="w-8 h-8 text-amber-400"/>}
          />
          <div className="bg-slate-900/50 p-4 rounded-lg flex flex-col justify-center items-center">
             <p className="text-sm text-slate-400">Your Wallet Balance</p>
             <p className="text-xl font-bold text-green-400">{player.tokens.toFixed(4)}</p>
          </div>
      </div>

      <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 mb-6 flex justify-between items-center">
        <div>
            <h3 className="text-lg font-semibold text-slate-200">Claim Your Rewards</h3>
            <p className="text-slate-400 text-sm">Transfer your earned rewards to your main wallet balance.</p>
        </div>
        <button
            onClick={handleClaim}
            disabled={isClaiming || contractData.rewards <= 0}
            className="w-48 px-6 py-3 font-bold rounded-lg bg-green-600 text-white disabled:bg-slate-600 disabled:cursor-not-allowed hover:bg-green-500 transition-colors flex justify-center items-center"
        >
            {isClaiming ? <SpinnerIcon className="w-6 h-6"/> : `Claim ${contractData.rewards.toFixed(2)} Tokens`}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActionPanel
            title="Stake Tokens"
            buttonText="Stake"
            balance={player.tokens}
            onAction={onStake}
            placeholder="Amount to stake"
            disabled={isLoading}
        />
        <ActionPanel
            title="Unstake Tokens"
            buttonText="Unstake"
            balance={contractData.staked}
            onAction={onUnstake}
            placeholder="Amount to unstake"
            disabled={isLoading}
        />
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-center mb-4 text-slate-300">Clarity Smart Contract Code</h3>
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-700 max-h-60 overflow-auto">
            <pre className="text-xs text-slate-400 whitespace-pre-wrap"><code>{StakingContractCode}</code></pre>
        </div>
      </div>
    </div>
  );
};

export default SmartContract;
