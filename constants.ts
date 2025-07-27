import { Player, Quest, QuestStatus, QuestType, QuestDifficulty } from './types';

export const INITIAL_PLAYER_STATE: Player = {
  name: 'EduExplorer',
  level: 1,
  xp: 0,
  tokens: 50,
  inventory: [],
};

export const INITIAL_QUESTS: Quest[] = [
  {
    id: 'q1',
    title: 'JavaScript Basics Quiz',
    description: 'Test your knowledge of fundamental JavaScript concepts.',
    type: QuestType.Quiz,
    topic: 'JavaScript fundamentals',
    difficulty: QuestDifficulty.Easy,
    status: QuestStatus.Available,
    reward: {
      tokens: 10,
      item: 'Scroll of JS Wisdom',
    },
  },
  {
    id: 'q2',
    title: 'World History Challenge',
    description: 'How well do you know major world events? Find out!',
    type: QuestType.Quiz,
    topic: 'World War II',
    difficulty: QuestDifficulty.Easy,
    status: QuestStatus.Available,
    reward: {
      tokens: 10,
    },
  },
  {
    id: 'q3',
    title: 'React Hooks Puzzle',
    description: 'A tricky quiz about the rules of React Hooks.',
    type: QuestType.Quiz,
    topic: 'React Hooks',
    difficulty: QuestDifficulty.Medium,
    status: QuestStatus.Available,
    reward: {
      tokens: 25,
      item: 'Hook of Reusability',
    },
  },
  {
    id: 'q4',
    title: 'Python Syntax Quiz',
    description: 'A quiz on the syntax of the Python programming language.',
    type: QuestType.Quiz,
    topic: 'Python syntax',
    difficulty: QuestDifficulty.Medium,
    status: QuestStatus.Available,
    reward: {
      tokens: 25,
    },
  },
    {
    id: 'q5',
    title: 'Advanced CSS Conundrum',
    description: 'Flex your CSS knowledge with this advanced quiz.',
    type: QuestType.Quiz,
    topic: 'Advanced CSS Selectors',
    difficulty: QuestDifficulty.Hard,
    status: QuestStatus.Available,
    reward: {
      tokens: 50,
      item: 'Amulet of Styling',
    },
  },
];