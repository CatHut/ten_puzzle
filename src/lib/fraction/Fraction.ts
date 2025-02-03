/**
 * 分数を扱うクラス
 */
export class Fraction {
  /**
   * 分数を作成
   * @param numerator 分子
   * @param denominator 分母（デフォルト: 1）
   */
  constructor(public numerator: number, public denominator: number = 1) {
    if (denominator === 0) throw new Error('Denominator cannot be zero');
    this.simplify();
  }

  /**
   * 分数を約分する
   */
  private simplify(): void {
    const gcd = this.calculateGCD(Math.abs(this.numerator), Math.abs(this.denominator));
    this.numerator = this.numerator / gcd;
    this.denominator = this.denominator / gcd;
    if (this.denominator < 0) {
      this.numerator = -this.numerator;
      this.denominator = -this.denominator;
    }
  }

  /**
   * 最大公約数を計算
   */
  private calculateGCD(a: number, b: number): number {
    return b === 0 ? a : this.calculateGCD(b, a % b);
  }

  /**
   * 分数の加算
   */
  add(other: Fraction): Fraction {
    return new Fraction(
      this.numerator * other.denominator + other.numerator * this.denominator,
      this.denominator * other.denominator
    );
  }

  /**
   * 分数の減算
   */
  subtract(other: Fraction): Fraction {
    return new Fraction(
      this.numerator * other.denominator - other.numerator * this.denominator,
      this.denominator * other.denominator
    );
  }

  /**
   * 分数の乗算
   */
  multiply(other: Fraction): Fraction {
    return new Fraction(
      this.numerator * other.numerator,
      this.denominator * other.denominator
    );
  }

  /**
   * 分数の除算
   */
  divide(other: Fraction): Fraction {
    if (other.numerator === 0) throw new Error('Division by zero');
    return new Fraction(
      this.numerator * other.denominator,
      this.denominator * other.numerator
    );
  }

  /**
   * 分数の等価性チェック
   */
  equals(other: Fraction): boolean {
    return this.numerator * other.denominator === other.numerator * this.denominator;
  }

  /**
   * 分数の文字列表現を取得
   */
  toString(): string {
    if (this.denominator === 1) return this.numerator.toString();
    return `${this.numerator}/${this.denominator}`;
  }

  /**
   * 分数の数値表現を取得
   */
  toNumber(): number {
    return this.numerator / this.denominator;
  }
}