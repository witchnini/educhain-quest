export enum QuestStatus {
  Available = 'Available',
  Completed = 'Completed',
}

export enum QuestType {
  Quiz = 'Quiz',
  Coding = 'Coding Challenge',
}

export enum QuestDifficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  topic: string; // e.g., 'JavaScript', 'World History'
  difficulty: QuestDifficulty;
  status: QuestStatus;
  reward: {
    tokens: number;
    item?: string;
  };
}

export interface Player {
  name: string;
  level: number;
  xp: number;
  tokens: number;
  inventory: string[];
}

export interface Transaction {
  id: string;
  questId?: string;
  description: string;
  tokens: number;
  item?: string;
  timestamp: string;
}

export interface GameState {
  player: Player;
  quests: Quest[];
  transactions: Transaction[];
  currentView: View;
  activeQuest: Quest | null;
  isWalletConnected: boolean;
}

export enum View {
  Quests = 'Quests',
  Questing = 'Questing',
  Inventory = 'Inventory',
  Ledger = 'Ledger',
  SmartContract = 'SmartContract',
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}