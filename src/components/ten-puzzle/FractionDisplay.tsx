import React from 'react';
import { Fraction } from '@/lib/fraction';

interface FractionDisplayProps {
  /** 表示する分数 */
  fraction: Fraction;
  /** カスタムクラス名 */
  className?: string;
}

/**
 * 分数を表示するコンポーネント
 */
export const FractionDisplay: React.FC<FractionDisplayProps> = ({ 
  fraction,
  className = ''
}) => {
  if (fraction.denominator === 1) {
    return <span className={className}>{fraction.numerator}</span>;
  }

  return (
    <div className={`inline-flex flex-col items-center justify-center ${className}`}>
      <div className="border-b border-black">{fraction.numerator}</div>
      <div>{fraction.denominator}</div>
    </div>
  );
};