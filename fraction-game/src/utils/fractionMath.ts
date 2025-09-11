import { Fraction } from '../types/game';

// 최대공약수 계산 (유클리드 호제법)
export function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

// 최소공배수 계산
export function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

// 분수 기약분수로 만들기
export function simplifyFraction(fraction: Fraction): Fraction {
  if (fraction.numerator === 0) {
    return { numerator: 0, denominator: 1 };
  }
  
  const commonDivisor = gcd(fraction.numerator, fraction.denominator);
  let numerator = fraction.numerator / commonDivisor;
  let denominator = fraction.denominator / commonDivisor;
  
  // 분모가 음수면 분자로 음수 이동
  if (denominator < 0) {
    numerator = -numerator;
    denominator = -denominator;
  }
  
  return { numerator, denominator };
}

// 분수 덧셈
export function addFractions(f1: Fraction, f2: Fraction): Fraction {
  const commonDenom = lcm(f1.denominator, f2.denominator);
  const numerator = (f1.numerator * (commonDenom / f1.denominator)) + 
                   (f2.numerator * (commonDenom / f2.denominator));
  
  return simplifyFraction({ numerator, denominator: commonDenom });
}

// 분수 뺄셈
export function subtractFractions(f1: Fraction, f2: Fraction): Fraction {
  const commonDenom = lcm(f1.denominator, f2.denominator);
  const numerator = (f1.numerator * (commonDenom / f1.denominator)) - 
                   (f2.numerator * (commonDenom / f2.denominator));
  
  return simplifyFraction({ numerator, denominator: commonDenom });
}

// 분수 곱셈
export function multiplyFractions(f1: Fraction, f2: Fraction): Fraction {
  const numerator = f1.numerator * f2.numerator;
  const denominator = f1.denominator * f2.denominator;
  
  return simplifyFraction({ numerator, denominator });
}

// 분수 나눗셈
export function divideFractions(f1: Fraction, f2: Fraction): Fraction {
  if (f2.numerator === 0) {
    throw new Error('Cannot divide by zero');
  }
  
  // 나눗셈은 두 번째 분수의 역수를 곱하는 것과 같음
  const reciprocal = { numerator: f2.denominator, denominator: f2.numerator };
  return multiplyFractions(f1, reciprocal);
}

// 분수 계산 수행
export function calculateFraction(f1: Fraction, f2: Fraction, operation: '+' | '-' | '*' | '/'): Fraction {
  switch (operation) {
    case '+':
      return addFractions(f1, f2);
    case '-':
      return subtractFractions(f1, f2);
    case '*':
      return multiplyFractions(f1, f2);
    case '/':
      return divideFractions(f1, f2);
    default:
      throw new Error('Invalid operation');
  }
}

// 분수 비교 (같은지 확인)
export function fractionsEqual(f1: Fraction, f2: Fraction): boolean {
  const simplified1 = simplifyFraction(f1);
  const simplified2 = simplifyFraction(f2);
  
  return simplified1.numerator === simplified2.numerator && 
         simplified1.denominator === simplified2.denominator;
}

// 분수를 소수로 변환
export function fractionToDecimal(fraction: Fraction): number {
  return fraction.numerator / fraction.denominator;
}

// 분수 문자열 표현
export function fractionToString(fraction: Fraction): string {
  if (fraction.denominator === 1) {
    return fraction.numerator.toString();
  }
  
  if (Math.abs(fraction.numerator) > fraction.denominator) {
    const wholeNumber = Math.floor(Math.abs(fraction.numerator) / fraction.denominator);
    const remainder = Math.abs(fraction.numerator) % fraction.denominator;
    const sign = fraction.numerator < 0 ? '-' : '';
    
    if (remainder === 0) {
      return `${sign}${wholeNumber}`;
    }
    
    return `${sign}${wholeNumber} ${remainder}/${fraction.denominator}`;
  }
  
  return `${fraction.numerator}/${fraction.denominator}`;
}