// React関連のインポート
import React from 'react';
import { useState, useEffect } from 'react';

// サードパーティライブラリのインポート
import { RotateCcw, SkipForward } from 'lucide-react';

// 内部モジュールのインポート（共通ライブラリ）
import { Fraction } from '@/lib/fraction';
import { generatePuzzle, puzzleToString } from '@/lib/puzzle-generator';

// 型定義のインポート
import { GameState, Operator, TenPuzzleProps } from '@/types';

// ローカルコンポーネントのインポート
import { FractionDisplay } from './FractionDisplay';
import { ResultMessage } from './ResultMessage';

/**
 * 10パズルゲームコンポーネント
 */
export const TenPuzzle: React.FC<TenPuzzleProps> = ({ 
  className = ''
}) => {
  const [numbers, setNumbers] = useState<Fraction[]>([]);
  const [currentPuzzle, setCurrentPuzzle] = useState('');
  const [firstSelectedIndex, setFirstSelectedIndex] = useState<number | null>(null);
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [solvedCount, setSolvedCount] = useState(0);

  const operatorOptions: Operator[] = ['+', '-', '*', '/'];

  const startNewPuzzle = () => {
    const newNumbers = generatePuzzle();
    setNumbers(newNumbers);
    setCurrentPuzzle(puzzleToString(newNumbers));
    setFirstSelectedIndex(null);
    setSelectedOperator(null);
    setHistory([]);
    setGameState('playing');
  };

  useEffect(() => {
    startNewPuzzle();
  }, []);

  const resetPuzzle = () => {
    const initialNumbers = currentPuzzle.split('').map(n => new Fraction(parseInt(n)));
    setNumbers(initialNumbers);
    setFirstSelectedIndex(null);
    setSelectedOperator(null);
    setHistory([]);
    setGameState('playing');
  };

  const handleNumberClick = (index: number) => {
    if (gameState !== 'playing') return;
    
    if (selectedOperator === null) {
      setFirstSelectedIndex(index);
    } else if (firstSelectedIndex !== index) {
      calculateResult(index);
    }
  };

  const handleOperatorClick = (op: Operator) => {
    if (gameState !== 'playing' || firstSelectedIndex === null) return;
    setSelectedOperator(op);
  };

  const calculateResult = (secondIndex: number) => {
    const num1 = numbers[firstSelectedIndex!];
    const num2 = numbers[secondIndex];
    let result: Fraction;

    try {
      switch (selectedOperator) {
        case '+': result = num1.add(num2); break;
        case '-': result = num1.subtract(num2); break;
        case '*': result = num1.multiply(num2); break;
        case '/': result = num1.divide(num2); break;
        default: return;
      }

      const newNumbers = [...numbers];
      newNumbers.splice(firstSelectedIndex!, 1);
      newNumbers.splice(secondIndex > firstSelectedIndex! ? secondIndex - 1 : secondIndex, 1);
      newNumbers.splice(firstSelectedIndex!, 0, result);

      setHistory([...history, `${num1.toString()} ${selectedOperator} ${num2.toString()} = ${result.toString()}`]);
      setNumbers(newNumbers);
      
      const newIndex = Math.min(firstSelectedIndex!, newNumbers.length - 1);
      setFirstSelectedIndex(newIndex >= 0 ? newIndex : null);
      setSelectedOperator(null);

      // 残り1つになった時点で判定
      if (newNumbers.length === 1) {
        const finalNumber = newNumbers[0];
        if (finalNumber.equals(new Fraction(10))) {
          setGameState('won');
          setSolvedCount(prev => prev + 1);
          // 2秒後に新しい問題を開始
          setTimeout(startNewPuzzle, 2000);
        } else {
          setGameState('lost');
        }
      }

    } catch (error) {
      console.error('Calculation error:', error);
    }
  };

  return (
    <div className={`p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto ${className}`}>
      <div className="text-2xl font-bold mb-2 text-center">
        10パズル
      </div>
      <div className="text-center mb-4">
        <span className="text-sm text-gray-600">クリア数: {solvedCount}</span>
      </div>
      <div className="text-lg mb-6 text-center text-blue-600">
        問題: {currentPuzzle}
      </div>
      
      <ResultMessage gameState={gameState} />

      <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
        {numbers.map((num, i) => (
          <div
            key={i}
            onClick={() => handleNumberClick(i)}
            className={`
              w-16 h-16 
              rounded-lg 
              flex items-center justify-center 
              text-2xl font-bold 
              cursor-pointer 
              transition-all
              border-2
              ${firstSelectedIndex === i 
                ? 'bg-blue-200 border-blue-400' 
                : 'bg-blue-50 border-blue-200 hover:bg-blue-100'}
              ${selectedOperator && firstSelectedIndex !== i 
                ? 'hover:bg-green-100' 
                : ''}
              ${gameState !== 'playing' ? 'opacity-75' : ''}
            `}
          >
            <FractionDisplay fraction={num} />
          </div>
        ))}
      </div>

      <div className="border-t-2 border-gray-200 my-4" />

      <div className="flex justify-center gap-4 mb-6">
        {operatorOptions.map((op) => (
          <div
            key={op}
            onClick={() => handleOperatorClick(op)}
            className={`
              w-12 h-12 
              rounded-full 
              flex items-center justify-center 
              text-xl font-bold 
              transition-all
              border-2
              ${firstSelectedIndex === null || gameState !== 'playing'
                ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-50' 
                : 'bg-white border-gray-300 cursor-pointer hover:bg-gray-50'}
              ${selectedOperator === op 
                ? 'bg-blue-100 border-blue-400' 
                : ''}
            `}
          >
            {op}
          </div>
        ))}
      </div>

      {firstSelectedIndex !== null && gameState === 'playing' && (
        <div className="text-center mb-6 text-lg">
          {numbers[firstSelectedIndex].toString()}
          {selectedOperator ? ` ${selectedOperator} ?` : ' ___ ?'}
        </div>
      )}

      <div className="mb-6 space-y-1">
        {history.map((step, i) => (
          <div key={i} className="text-sm text-gray-600 text-center">
            {step}
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={startNewPuzzle}
          className="px-6 py-3 bg-orange-500 text-white rounded-lg flex items-center gap-2 hover:bg-orange-600 transition-colors"
        >
          <SkipForward size={20} />
          <span>パス</span>
        </button>
        <button
          onClick={resetPuzzle}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg flex items-center gap-2 hover:bg-gray-600 transition-colors"
        >
          <RotateCcw size={20} />
          <span>リセット</span>
        </button>
      </div>

      <div className="mt-8 text-sm text-gray-600 space-y-1">
        <p>• 最初の数字をクリック</p>
        <p>• 演算子を選択（いつでも変更可能）</p>
        <p>• 2つ目の数字をクリック</p>
        <p>• 最終的に10を作りましょう</p>
      </div>
    </div>
  );
};

export default TenPuzzle;