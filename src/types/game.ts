/**
 * ゲームの状態を表す型
 */
export type GameState = 'playing' | 'won' | 'lost';

/**
 * 演算子の型
 */
export type Operator = '+' | '-' | '*' | '/';

/**
 * ゲーム画面のプロップス型
 */
export interface TenPuzzleProps {
  /** カスタムクラス名 */
  className?: string;
}