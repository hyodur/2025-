import { Fraction, Problem } from '../types/game';
import { calculateFraction, simplifyFraction } from './fractionMath';

// 난이도별 분수 생성 범위
const DIFFICULTY_RANGES = {
  1: { numerator: [1, 5], denominator: [2, 6] }, // 쉬운 분수 (1/2, 2/3 등)
  2: { numerator: [1, 8], denominator: [2, 8] }, // 조금 더 복잡한 분수
  3: { numerator: [1, 12], denominator: [2, 12] }, // 중간 난이도
  4: { numerator: [1, 15], denominator: [2, 15] }, // 어려운 분수
  5: { numerator: [1, 20], denominator: [2, 20] }, // 매우 어려운 분수
};

// 연산자별 가중치 (난이도에 따라)
const OPERATION_WEIGHTS = {
  1: { '+': 0.5, '-': 0.3, '*': 0.15, '/': 0.05 },
  2: { '+': 0.4, '-': 0.4, '*': 0.15, '/': 0.05 },
  3: { '+': 0.3, '-': 0.3, '*': 0.25, '/': 0.15 },
  4: { '+': 0.25, '-': 0.25, '*': 0.25, '/': 0.25 },
  5: { '+': 0.25, '-': 0.25, '*': 0.25, '/': 0.25 },
};

// 랜덤 정수 생성
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 가중치에 따른 연산자 선택
function selectOperation(difficulty: 1 | 2 | 3 | 4 | 5): '+' | '-' | '*' | '/' {
  const weights = OPERATION_WEIGHTS[difficulty];
  const random = Math.random();
  let cumulative = 0;
  
  for (const [op, weight] of Object.entries(weights)) {
    cumulative += weight;
    if (random <= cumulative) {
      return op as '+' | '-' | '*' | '/';
    }
  }
  
  return '+'; // fallback
}

// 난이도에 따른 분수 생성
function generateFraction(difficulty: 1 | 2 | 3 | 4 | 5): Fraction {
  const range = DIFFICULTY_RANGES[difficulty];
  const numerator = randomInt(range.numerator[0], range.numerator[1]);
  const denominator = randomInt(range.denominator[0], range.denominator[1]);
  
  // 기약분수로 만들어서 반환
  return simplifyFraction({ numerator, denominator });
}

// 4학년 수준에 맞는 분수 생성 (진분수 위주)
function generateAppropiateFraction(difficulty: 1 | 2 | 3 | 4 | 5, forceProper: boolean = true): Fraction {
  let fraction: Fraction;
  let attempts = 0;
  const maxAttempts = 20;
  
  do {
    fraction = generateFraction(difficulty);
    attempts++;
    
    // 진분수가 필요하고, 분자가 분모보다 크거나 같으면 다시 생성
    if (forceProper && fraction.numerator >= fraction.denominator && attempts < maxAttempts) {
      continue;
    }
    
    // 너무 복잡한 분수는 피함 (분모가 너무 크거나)
    if (fraction.denominator > 15 && attempts < maxAttempts) {
      continue;
    }
    
    break;
  } while (attempts < maxAttempts);
  
  return fraction;
}

// 문제 검증 (답이 너무 복잡하지 않은지 확인)
function isAnswerAppropriate(answer: Fraction): boolean {
  // 분모가 너무 크면 부적절
  if (answer.denominator > 30) return false;
  
  // 분자의 절댓값이 너무 크면 부적절
  if (Math.abs(answer.numerator) > 50) return false;
  
  // 음수 답은 뺄셈에서만 허용 (4학년 수준 고려)
  return true;
}

// 문제 생성
export function generateProblem(difficulty: 1 | 2 | 3 | 4 | 5): Problem {
  let problem: Problem;
  let attempts = 0;
  const maxAttempts = 50;
  
  do {
    const operation = selectOperation(difficulty);
    let fraction1: Fraction;
    let fraction2: Fraction;
    
    // 연산에 따라 분수 생성 전략 조정
    switch (operation) {
      case '+':
      case '*':
        // 덧셈과 곱셈은 진분수 사용
        fraction1 = generateAppropiateFraction(difficulty, true);
        fraction2 = generateAppropiateFraction(difficulty, true);
        break;
        
      case '-':
        // 뺄셈은 첫 번째가 더 큰 분수가 되도록 조정
        fraction1 = generateAppropiateFraction(difficulty, false);
        fraction2 = generateAppropiateFraction(difficulty, true);
        
        // 첫 번째 분수가 두 번째보다 작으면 바꿈
        if (fraction1.numerator / fraction1.denominator < fraction2.numerator / fraction2.denominator) {
          [fraction1, fraction2] = [fraction2, fraction1];
        }
        break;
        
      case '/':
        // 나눗셈은 적절한 크기의 분수 사용
        fraction1 = generateAppropiateFraction(difficulty, false);
        fraction2 = generateAppropiateFraction(difficulty, true);
        
        // 0으로 나누기 방지
        while (fraction2.numerator === 0) {
          fraction2 = generateAppropiateFraction(difficulty, true);
        }
        break;
        
      default:
        fraction1 = generateAppropiateFraction(difficulty, true);
        fraction2 = generateAppropiateFraction(difficulty, true);
    }
    
    try {
      const answer = calculateFraction(fraction1, fraction2, operation);
      
      if (isAnswerAppropriate(answer)) {
        problem = {
          id: `problem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          fraction1,
          fraction2,
          operation,
          answer,
          difficulty
        };
        break;
      }
    } catch (error) {
      // 계산 오류 시 다시 시도
    }
    
    attempts++;
  } while (attempts < maxAttempts);
  
  // 최대 시도 횟수 초과 시 간단한 문제 반환
  if (attempts >= maxAttempts) {
    const fraction1 = { numerator: 1, denominator: 2 };
    const fraction2 = { numerator: 1, denominator: 3 };
    const answer = calculateFraction(fraction1, fraction2, '+');
    
    problem = {
      id: `fallback_${Date.now()}`,
      fraction1,
      fraction2,
      operation: '+',
      answer,
      difficulty: 1
    };
  }
  
  return problem!;
}

// 연습 문제 세트 생성
export function generateProblemSet(difficulty: 1 | 2 | 3 | 4 | 5, count: number = 10): Problem[] {
  const problems: Problem[] = [];
  
  for (let i = 0; i < count; i++) {
    problems.push(generateProblem(difficulty));
  }
  
  return problems;
}

// 특정 연산에 대한 문제 생성
export function generateSpecificOperationProblem(
  operation: '+' | '-' | '*' | '/', 
  difficulty: 1 | 2 | 3 | 4 | 5
): Problem {
  let attempts = 0;
  const maxAttempts = 30;
  
  while (attempts < maxAttempts) {
    let fraction1: Fraction;
    let fraction2: Fraction;
    
    switch (operation) {
      case '+':
      case '*':
        fraction1 = generateAppropiateFraction(difficulty, true);
        fraction2 = generateAppropiateFraction(difficulty, true);
        break;
        
      case '-':
        fraction1 = generateAppropiateFraction(difficulty, false);
        fraction2 = generateAppropiateFraction(difficulty, true);
        if (fraction1.numerator / fraction1.denominator < fraction2.numerator / fraction2.denominator) {
          [fraction1, fraction2] = [fraction2, fraction1];
        }
        break;
        
      case '/':
        fraction1 = generateAppropiateFraction(difficulty, false);
        fraction2 = generateAppropiateFraction(difficulty, true);
        while (fraction2.numerator === 0) {
          fraction2 = generateAppropiateFraction(difficulty, true);
        }
        break;
    }
    
    try {
      const answer = calculateFraction(fraction1, fraction2, operation);
      
      if (isAnswerAppropriate(answer)) {
        return {
          id: `specific_${operation}_${Date.now()}_${attempts}`,
          fraction1,
          fraction2,
          operation,
          answer,
          difficulty
        };
      }
    } catch (error) {
      // 계산 오류 시 다시 시도
    }
    
    attempts++;
  }
  
  // 실패 시 간단한 기본 문제 반환
  const fraction1 = { numerator: 1, denominator: 2 };
  const fraction2 = { numerator: 1, denominator: 3 };
  const answer = calculateFraction(fraction1, fraction2, '+');
  
  return {
    id: `fallback_specific_${operation}`,
    fraction1,
    fraction2,
    operation: '+',
    answer,
    difficulty: 1
  };
}