
import React from 'react';
import { Quest, QuestStatus, QuestDifficulty } from '../types';
import { CheckCircleIcon, LockIcon, TokenIcon } from './icons';

interface QuestCardProps {
  quest: Quest;
  onStart: (id: string) => void;
}

const difficultyStyles: Record<QuestDifficulty, string> = {
  [QuestDifficulty.Easy]: 'bg-green-500/20 text-green-400 border-green-500/30',
  [QuestDifficulty.Medium]: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  [QuestDifficulty.Hard]: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const QuestCard: React.FC<QuestCardProps> = ({ quest, onStart }) => {
  const isCompleted = quest.status === QuestStatus.Completed;

  return (
    <div className={`
      bg-slate-800/50 border border-slate-700 rounded-lg shadow-lg
      transition-all duration-300 hover:shadow-sky-500/20 hover:border-slate-600
      flex flex-col
      ${isCompleted ? 'opacity-50' : ''}
    `}>
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-slate-100">{quest.title}</h3>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${difficultyStyles[quest.difficulty]}`}>
            {quest.difficulty}
          </span>
        </div>
        <p className="mt-2 text-sm text-slate-400">{quest.description}</p>
      </div>
      <div className="bg-slate-900/50 px-5 py-3 rounded-b-lg flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 text-amber-400">
            <TokenIcon />
            <span className="font-semibold">{quest.reward.tokens}</span>
          </div>
          {quest.reward.item && (
             <div className="text-sm text-purple-400 font-medium">
               + {quest.reward.item}
             </div>
          )}
        </div>
        <button
          onClick={() => onStart(quest.id)}
          disabled={isCompleted}
          className={`
            px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200
            flex items-center space-x-2
            ${isCompleted
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-sky-600 text-white hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500'
            }
          `}
        >
          {isCompleted ? <CheckCircleIcon /> : <span />}
          <span>{isCompleted ? 'Completed' : 'Start Quest'}</span>
        </button>
      </div>
    </div>
  );
};

interface QuestBoardProps {
  quests: Quest[];
  onStartQuest: (id: string) => void;
}

const QuestBoard: React.FC<QuestBoardProps> = ({ quests, onStartQuest }) => {
  return (
    <div>
        <h2 className="text-3xl font-bold text-center mb-2 text-sky-400">Available Quests</h2>
        <p className="text-center text-slate-400 mb-8">Select a quest to test your knowledge and earn rewards.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quests.map(quest => (
                <QuestCard key={quest.id} quest={quest} onStart={onStartQuest} />
            ))}
        </div>
    </div>
  );
};

export default QuestBoard;
