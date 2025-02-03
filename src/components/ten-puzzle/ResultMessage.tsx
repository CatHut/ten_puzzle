import React from 'react';
import { GameState } from '@/types';

interface ResultMessageProps {
  /** ゲームの状態 */
  gameState: GameState;
}

/**
 * ゲーム結果を表示するコンポーネント
 */
export const ResultMessage: React.FC<ResultMessageProps> = ({ gameState }) => {
  if (gameState === 'playing') return null;
  
  return (
    <div 
      className={`
        text-center p-4 mb-6 rounded-lg 
        ${gameState === 'won' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
        }
      `}
    >
      {gameState === 'won' 
        ? '正解！🎉 おめでとうございます！' 
        : '残念！10になっていません。もう一度チャレンジしてみましょう！'
      }
    </div>
  );
};