
import React, { useState, useEffect, useCallback } from 'react';
import { Quest, QuestType, QuizQuestion } from '../types';
import { generateQuizQuestion } from '../services/geminiService';
import RewardModal from './RewardModal';
import { SpinnerIcon } from './icons';

interface QuestRunnerProps {
  quest: Quest;
  onComplete: (questId: string, reward: { tokens: number; item?: string }) => void;
  onQuit: () => void;
}

const QuizView: React.FC<{
  quest: Quest;
  onCorrectAnswer: () => void;
}> = ({ quest, onCorrectAnswer }) => {
  const [quizData, setQuizData] = useState<QuizQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    const fetchQuestion = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await generateQuizQuestion(quest.topic);
        setQuizData(data);
      } catch (err) {
        setError('Failed to load the quiz. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [quest.topic]);

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null) return;
    setIsAnswered(true);
    if (selectedAnswer === quizData?.correctAnswerIndex) {
      setTimeout(() => {
        onCorrectAnswer();
      }, 1500); // Wait for user to see the result
    }
  };
  
  const getButtonClass = (index: number) => {
    if (!isAnswered) {
        return selectedAnswer === index 
            ? 'bg-sky-600 border-sky-500' 
            : 'bg-slate-700 border-slate-600 hover:bg-slate-600';
    }
    if (index === quizData?.correctAnswerIndex) {
        return 'bg-green-600 border-green-500 animate-pulse';
    }
    if (index === selectedAnswer) {
        return 'bg-red-600 border-red-500';
    }
    return 'bg-slate-800 border-slate-700 opacity-60';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <SpinnerIcon className="w-12 h-12 mb-4" />
        <p className="text-lg text-slate-300">Generating your quest...</p>
        <p className="text-sm text-slate-400">Our AI is crafting the perfect challenge for you on "{quest.topic}".</p>
      </div>
    );
  }

  if (error || !quizData) {
    return <div className="text-center text-red-400 p-8">{error}</div>;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h3 className="text-2xl font-bold text-center text-slate-100 mb-6">{quizData.question}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quizData.options.map((option, index) => (
          <button
            key={index}
            onClick={() => !isAnswered && setSelectedAnswer(index)}
            disabled={isAnswered}
            className={`w-full p-4 rounded-lg border text-left transition-all duration-200 ${getButtonClass(index)}`}
          >
            <span className="font-semibold">{option}</span>
          </button>
        ))}
      </div>
      {!isAnswered && (
          <div className="mt-8 flex justify-center">
            <button
                onClick={handleAnswerSubmit}
                disabled={selectedAnswer === null}
                className="px-8 py-3 font-bold rounded-lg bg-green-600 text-white disabled:bg-slate-600 disabled:cursor-not-allowed hover:bg-green-500 transition-colors"
            >
                Submit Answer
            </button>
        </div>
      )}
    </div>
  );
};


const QuestRunner: React.FC<QuestRunnerProps> = ({ quest, onComplete, onQuit }) => {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleCorrectAnswer = useCallback(() => {
    setIsCompleted(true);
  }, []);

  const handleCloseRewardModal = () => {
      onComplete(quest.id, quest.reward);
  }

  return (
    <div className="max-w-4xl mx-auto bg-slate-800 rounded-xl shadow-2xl shadow-slate-900/50 border border-slate-700">
      <div className="p-5 bg-slate-900/50 rounded-t-xl border-b border-slate-700 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-sky-400">{quest.title}</h2>
          <p className="text-sm text-slate-400">{quest.type}</p>
        </div>
        <button onClick={onQuit} className="px-3 py-1.5 text-sm font-semibold rounded-md bg-red-600 text-white hover:bg-red-500 transition-colors">
          Quit
        </button>
      </div>
      
      {isCompleted ? (
        <RewardModal
          quest={quest}
          onClose={handleCloseRewardModal}
        />
      ) : (
        quest.type === QuestType.Quiz ? (
          <QuizView quest={quest} onCorrectAnswer={handleCorrectAnswer} />
        ) : (
          <div className="p-8 text-center text-slate-400">
            This quest type is not yet implemented.
          </div>
        )
      )}
    </div>
  );
};

export default QuestRunner;
