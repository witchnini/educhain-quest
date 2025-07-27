
import React, { useState, useCallback, useMemo } from 'react';
import { GameState, View, Player, QuestStatus } from './types';
import { INITIAL_QUESTS, INITIAL_PLAYER_STATE } from './constants';
import * as clarityService from './services/clarityService';
import Header from './components/Header';
import QuestBoard from './components/QuestBoard';
import QuestRunner from './components/QuestRunner';
import Inventory from './components/Inventory';
import Ledger from './components/Ledger';
import SmartContract from './components/SmartContract';

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    player: INITIAL_PLAYER_STATE,
    quests: INITIAL_QUESTS,
    transactions: [],
    currentView: View.Quests,
    activeQuest: null,
    isWalletConnected: false,
  });

  const addTransaction = useCallback((description: string, tokens: number) => {
    setGameState(prev => ({
      ...prev,
      transactions: [...prev.transactions, {
        id: `0x${crypto.randomUUID().replace(/-/g, '')}`,
        description,
        tokens,
        timestamp: new Date().toISOString(),
      }]
    }));
  }, []);

  const handleStartQuest = useCallback((questId: string) => {
    const questToStart = gameState.quests.find(q => q.id === questId);
    if (questToStart && questToStart.status === 'Available') {
      setGameState(prev => ({
        ...prev,
        activeQuest: questToStart,
        currentView: View.Questing,
      }));
    }
  }, [gameState.quests]);

  const handleCompleteQuest = useCallback((questId: string, reward: { tokens: number; item?: string }) => {
    setGameState(prev => {
      const questTitle = prev.quests.find(q => q.id === questId)?.title || 'Unknown Quest';
      const newTransactions = [...prev.transactions, {
        id: `0x${crypto.randomUUID().replace(/-/g, '')}`,
        questId: questId,
        description: `Reward for '${questTitle}'`,
        tokens: reward.tokens,
        item: reward.item,
        timestamp: new Date().toISOString(),
      }];
      
      const newQuests = prev.quests.map(q => 
        q.id === questId ? { ...q, status: QuestStatus.Completed } : q
      );

      const newInventory = reward.item ? [...prev.player.inventory, reward.item] : prev.player.inventory;
      
      return {
        ...prev,
        player: {
          ...prev.player,
          tokens: prev.player.tokens + reward.tokens,
          xp: prev.player.xp + 100,
          inventory: newInventory,
        },
        quests: newQuests,
        transactions: newTransactions,
        activeQuest: null,
        currentView: View.Quests,
      };
    });
  }, []);
  
  const handleQuitQuest = useCallback(() => {
    setGameState(prev => ({ ...prev, activeQuest: null, currentView: View.Quests }));
  }, []);

  const handleNavigate = (view: View) => {
     if (gameState.currentView === View.Questing) return;
     setGameState(prev => ({ ...prev, currentView: view }));
  };
  
  const handleConnectWallet = useCallback(async () => {
    await clarityService.connectWallet();
    setGameState(prev => ({...prev, isWalletConnected: true}));
    addTransaction("Wallet Connected", 0);
  }, [addTransaction]);
  
  const handleStake = useCallback(async (amount: number) => {
    if (amount <= 0 || amount > gameState.player.tokens) return;
    
    try {
      await clarityService.stakeTokens(amount);
      setGameState(prev => ({
        ...prev,
        player: {
          ...prev.player,
          tokens: prev.player.tokens - amount,
        },
      }));
      addTransaction("Contract Stake", -amount);
    } catch (error) {
      console.error("Staking failed:", error);
      alert("Staking transaction failed. See console for details.");
    }
  }, [gameState.player.tokens, addTransaction]);

  const handleUnstake = useCallback(async (amount: number) => {
    try {
      await clarityService.unstakeTokens(amount);
      setGameState(prev => ({
        ...prev,
        player: {
          ...prev.player,
          tokens: prev.player.tokens + amount,
        },
      }));
      addTransaction("Contract Unstake", amount);
    } catch (error) {
      console.error("Unstaking failed:", error);
      alert("Unstaking transaction failed. See console for details.");
    }
  }, [addTransaction]);
  
  const handleClaimRewards = useCallback(async () => {
    try {
      const claimedAmount = await clarityService.claimRewards();
      setGameState(prev => ({
        ...prev,
        player: {
          ...prev.player,
          tokens: prev.player.tokens + claimedAmount,
        },
      }));
      addTransaction("Contract Claim Rewards", claimedAmount);
    } catch (error) {
      console.error("Claiming failed:", error);
      alert("Claiming rewards failed. See console for details.");
    }
  }, [addTransaction]);


  const currentViewComponent = useMemo(() => {
    switch (gameState.currentView) {
      case View.Inventory:
        return <Inventory items={gameState.player.inventory} />;
      case View.Ledger:
        return <Ledger transactions={gameState.transactions} />;
      case View.SmartContract:
        return <SmartContract 
          player={gameState.player}
          isWalletConnected={gameState.isWalletConnected}
          onConnectWallet={handleConnectWallet}
          onStake={handleStake}
          onUnstake={handleUnstake}
          onClaim={handleClaimRewards}
        />;
      case View.Questing:
        return gameState.activeQuest ? (
          <QuestRunner
            quest={gameState.activeQuest}
            onComplete={handleCompleteQuest}
            onQuit={handleQuitQuest}
          />
        ) : <QuestBoard quests={gameState.quests} onStartQuest={handleStartQuest} />;
      case View.Quests:
      default:
        return <QuestBoard quests={gameState.quests} onStartQuest={handleStartQuest} />;
    }
  }, [gameState, handleStartQuest, handleCompleteQuest, handleQuitQuest, handleConnectWallet, handleStake, handleUnstake, handleClaimRewards]);


  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-200 flex flex-col">
      <Header player={gameState.player} onNavigate={handleNavigate} currentView={gameState.currentView} />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        {currentViewComponent}
      </main>
      <footer className="text-center p-4 text-slate-500 text-xs border-t border-slate-800">
        EduChain Quest - Learning Gamified on a Simulated Blockchain
      </footer>
    </div>
  );
}
