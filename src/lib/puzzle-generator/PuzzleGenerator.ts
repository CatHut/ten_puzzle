import { Fraction } from '@/lib/fraction';
import { Operator } from '@/types';

/**
 * 問題の解のチェック結果
 */
interface SolutionCheck {
  hasSolution: boolean;
  solution?: string[];
}

/**
 * パズルの生成と検証を行うクラス
 */
export class PuzzleGenerator {
  private static operators: Operator[] = ['+', '-', '*', '/'];

  /**
   * 新しいパズルを生成
   * @returns 解が存在する4つの数字の配列
   */
  static generate(): Fraction[] {
    let attempts = 0;
    const maxAttempts = 100;

    while (attempts < maxAttempts) {
      const numbers = this.generateRandomNumbers();
      const check = this.checkSolution(numbers);
      
      if (check.hasSolution) {
        console.log('Found solution:', check.solution);
        return numbers;
      }
      
      attempts++;
    }

    // フォールバック: 確実に解ける問題を返す
    return this.generateFallbackPuzzle();
  }

  /**
   * ランダムな4つの数字を生成
   */
  private static generateRandomNumbers(): Fraction[] {
    const numbers: number[] = [];
    while (numbers.length < 4) {
      const num = Math.floor(Math.random() * 9) + 1;
      if (!numbers.includes(num)) {
        numbers.push(num);
      }
    }
    return numbers.map(n => new Fraction(n));
  }

  /**
   * 解の存在をチェック
   */
  private static checkSolution(numbers: Fraction[]): SolutionCheck {
    const solutions: string[] = [];
    
    const checkRecursive = (nums: Fraction[], history: string[] = []): boolean => {
      if (nums.length === 1) {
        if (nums[0].equals(new Fraction(10))) {
          solutions.push(...history);
          return true;
        }
        return false;
      }

      for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
          const num1 = nums[i];
          const num2 = nums[j];
          const remainingNums = nums.filter((_, index) => index !== i && index !== j);

          for (const op of this.operators) {
            try {
              let result: Fraction;
              switch (op) {
                case '+': result = num1.add(num2); break;
                case '-': result = num1.subtract(num2); break;
                case '*': result = num1.multiply(num2); break;
                case '/': result = num1.divide(num2); break;
                default: continue;
              }

              const step = `${num1.toString()} ${op} ${num2.toString()} = ${result.toString()}`;
              if (checkRecursive([result, ...remainingNums], [...history, step])) {
                return true;
              }

              // 演算の順序を変えてもチェック
              if (op === '+' || op === '*') continue; // 交換法則が成り立つ場合はスキップ
              
              switch (op) {
                case '-': result = num2.subtract(num1); break;
                case '/': result = num2.divide(num1); break;
                default: continue;
              }

              const reverseStep = `${num2.toString()} ${op} ${num1.toString()} = ${result.toString()}`;
              if (checkRecursive([result, ...remainingNums], [...history, reverseStep])) {
                return true;
              }
            } catch (e) {
              // 0による除算などの無効な演算はスキップ
              continue;
            }
          }
        }
      }

      return false;
    };

    const hasSolution = checkRecursive(numbers);
    return { hasSolution, solution: hasSolution ? solutions : undefined };
  }

  /**
   * 確実に解ける問題を生成
   */
  private static generateFallbackPuzzle(): Fraction[] {
    // 例: 2, 2, 3, 3 → (2 + 2) * (3 - 3/3) = 10
    return [
      new Fraction(2),
      new Fraction(2),
      new Fraction(3),
      new Fraction(3)
    ];
  }

  /**
   * 数字配列を文字列化
   */
  static puzzleToString(numbers: Fraction[]): string {
    return numbers.map(n => n.toString()).join('');
  }
}

// エクスポートする関数
export const generatePuzzle = (): Fraction[] => {
  return PuzzleGenerator.generate();
};

export const puzzleToString = (numbers: Fraction[]): string => {
  return PuzzleGenerator.puzzleToString(numbers);
};