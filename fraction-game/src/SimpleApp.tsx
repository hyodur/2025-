import React, { useState } from 'react';
import styled from 'styled-components';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  font-family: 'Segoe UI', sans-serif;
  padding: 2rem;
`;

const GameCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  border-radius: 2rem;
  padding: 3rem;
  max-width: 700px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
`;

const ProblemDisplay = styled.div`
  font-size: 2.5rem;
  margin: 2rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

const FractionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
`;

const FractionLine = styled.div`
  width: 50px;
  height: 3px;
  background-color: #333;
  margin: 3px 0;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
`;

const AnswerModeToggle = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ModeButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  border: 2px solid #6366f1;
  border-radius: 0.5rem;
  background: ${props => props.$active ? '#6366f1' : 'white'};
  color: ${props => props.$active ? 'white' : '#6366f1'};
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
`;

const ImproperFractionInput = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const MixedNumberInput = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const FractionInput = styled.input`
  width: 80px;
  padding: 0.75rem;
  border: 3px solid #e5e7eb;
  border-radius: 0.75rem;
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

const WholeNumberInput = styled.input`
  width: 60px;
  padding: 0.75rem;
  border: 3px solid #e5e7eb;
  border-radius: 0.75rem;
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  border-radius: 1rem;
  padding: 1rem 2.5rem;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(16, 185, 129, 0.4);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 1rem;
  gap: 1rem;
`;

const Stat = styled.div`
  text-align: center;
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #6366f1;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.7;
  margin-top: 0.25rem;
`;

const ResultMessage = styled.div<{ $isCorrect: boolean }>`
  font-size: 1.3rem;
  font-weight: bold;
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 0.75rem;
  background: ${props => props.$isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  color: ${props => props.$isCorrect ? '#059669' : '#dc2626'};
  border: 2px solid ${props => props.$isCorrect ? '#10b981' : '#ef4444'};
`;

const EncouragementMessages = {
  correct: [
    '정답이에요! 🎉 정말 잘했어요!',
    '맞았어요! 👏 분수 계산을 잘하네요!',
    '훌륭해요! ⭐ 계속 이런 식으로 해보세요!',
    '완벽해요! 🌟 분수 마스터가 되어가고 있어요!',
    '정답! 🎊 수학 실력이 늘고 있어요!'
  ],
  incorrect: [
    '아쉬워요! 😊 다시 한 번 도전해보세요!',
    '틀렸지만 괜찮아요! 💪 계속 연습하면 잘할 수 있어요!',
    '거의 다 왔어요! 🌈 한 번 더 생각해보세요!',
    '실수는 배움의 기회예요! 📚 다음엔 더 잘할 거예요!'
  ]
};

interface Fraction {
  numerator: number;
  denominator: number;
}

interface Problem {
  fraction1: Fraction;
  fraction2: Fraction;
  operation: '+' | '-';
  answer: Fraction;
}

// 최대공약수 계산
function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

// 분수 기약분수로 만들기
function simplifyFraction(fraction: Fraction): Fraction {
  if (fraction.numerator === 0) {
    return { numerator: 0, denominator: 1 };
  }
  
  const commonDivisor = gcd(fraction.numerator, fraction.denominator);
  let numerator = fraction.numerator / commonDivisor;
  let denominator = fraction.denominator / commonDivisor;
  
  if (denominator < 0) {
    numerator = -numerator;
    denominator = -denominator;
  }
  
  return { numerator, denominator };
}

// 대분수를 가분수로 변환
function mixedToImproper(whole: number, numerator: number, denominator: number): Fraction {
  return {
    numerator: whole * denominator + numerator,
    denominator: denominator
  };
}

// 분수 덧셈 (같은 분모)
function addSameDenominator(f1: Fraction, f2: Fraction): Fraction {
  const numerator = f1.numerator + f2.numerator;
  return simplifyFraction({ numerator, denominator: f1.denominator });
}

// 분수 뺄셈 (같은 분모)
function subtractSameDenominator(f1: Fraction, f2: Fraction): Fraction {
  const numerator = f1.numerator - f2.numerator;
  return simplifyFraction({ numerator, denominator: f1.denominator });
}

// 분수 계산
function calculateFraction(f1: Fraction, f2: Fraction, operation: '+' | '-'): Fraction {
  switch (operation) {
    case '+': return addSameDenominator(f1, f2);
    case '-': return subtractSameDenominator(f1, f2);
  }
}

// 분수 비교
function fractionsEqual(f1: Fraction, f2: Fraction): boolean {
  const s1 = simplifyFraction(f1);
  const s2 = simplifyFraction(f2);
  return s1.numerator === s2.numerator && s1.denominator === s2.denominator;
}

// 4학년용 분수 생성 (반드시 분수 형태가 되도록)
function generateFraction(denominator: number, allowImproper: boolean = true): Fraction {
  let numerator: number;
  
  if (allowImproper) {
    // 1부터 denominator * 2.5까지 (적당한 대분수)
    numerator = Math.floor(Math.random() * (Math.floor(denominator * 2.5))) + 1;
  } else {
    // 1부터 denominator - 1까지 (진분수만)
    numerator = Math.floor(Math.random() * (denominator - 1)) + 1;
  }
  
  return { numerator, denominator };
}

// 4학년용 문제 생성 (분모가 같은 덧셈/뺄셈만, 반드시 분수 형태)
function generateProblem(): Problem {
  // 4학년 적합한 분모들 (2, 3, 4, 5, 6, 8, 10, 12)
  const denominators = [2, 3, 4, 5, 6, 8, 10, 12];
  const denominator = denominators[Math.floor(Math.random() * denominators.length)];
  
  // 덧셈과 뺄셈만
  const operations: ('+' | '-')[] = ['+', '-'];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  
  let fraction1: Fraction;
  let fraction2: Fraction;
  
  // 반드시 하나 이상은 진분수가 아닌 형태가 되도록 (분수 연습을 위해)
  do {
    fraction1 = generateFraction(denominator, true);
    fraction2 = generateFraction(denominator, true);
    
    // 둘 다 자연수가 되는 경우 방지 (분모와 분자가 같은 경우)
    if (fraction1.numerator % fraction1.denominator === 0 && 
        fraction2.numerator % fraction2.denominator === 0) {
      continue;
    }
    
    break;
  } while (true);
  
  // 뺄셈의 경우 첫 번째 분수가 더 큰지 확인 (음수 결과 방지)
  if (operation === '-' && fraction1.numerator < fraction2.numerator) {
    [fraction1, fraction2] = [fraction2, fraction1];
  }
  
  const answer = calculateFraction(fraction1, fraction2, operation);
  
  return { fraction1, fraction2, operation, answer };
}

// 분수를 문자열로 표시 (대분수 형태 포함)
function formatFraction(fraction: Fraction): string {
  if (fraction.denominator === 1) {
    return fraction.numerator.toString();
  }
  
  if (fraction.numerator >= fraction.denominator) {
    const whole = Math.floor(fraction.numerator / fraction.denominator);
    const remainder = fraction.numerator % fraction.denominator;
    
    if (remainder === 0) {
      return whole.toString();
    }
    
    return `${whole} ${remainder}/${fraction.denominator}`;
  }
  
  return `${fraction.numerator}/${fraction.denominator}`;
}

const FractionDisplay: React.FC<{ fraction: Fraction }> = ({ fraction }) => {
  // 대분수인경우 분리해서 표시
  if (fraction.numerator >= fraction.denominator && fraction.denominator !== 1) {
    const whole = Math.floor(fraction.numerator / fraction.denominator);
    const remainder = fraction.numerator % fraction.denominator;
    
    if (remainder === 0) {
      return <span style={{ fontSize: '2.5rem' }}>{whole}</span>;
    }
    
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '2.5rem' }}>{whole}</span>
        <FractionContainer>
          <div>{remainder}</div>
          <FractionLine />
          <div>{fraction.denominator}</div>
        </FractionContainer>
      </div>
    );
  }
  
  if (fraction.denominator === 1) {
    return <span style={{ fontSize: '2.5rem' }}>{fraction.numerator}</span>;
  }
  
  return (
    <FractionContainer>
      <div>{fraction.numerator}</div>
      <FractionLine />
      <div>{fraction.denominator}</div>
    </FractionContainer>
  );
};

export default function SimpleApp() {
  const [problem, setProblem] = useState<Problem>(generateProblem());
  const [answerMode, setAnswerMode] = useState<'improper' | 'mixed'>('improper');
  
  // 가분수 입력 모드
  const [numeratorInput, setNumeratorInput] = useState('');
  const [denominatorInput, setDenominatorInput] = useState('');
  
  // 대분수 입력 모드
  const [wholeInput, setWholeInput] = useState('');
  const [mixedNumeratorInput, setMixedNumeratorInput] = useState('');
  const [mixedDenominatorInput, setMixedDenominatorInput] = useState('');
  
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [message, setMessage] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    let userAnswer: Fraction;
    
    if (answerMode === 'improper') {
      // 가분수로 입력
      if (!numeratorInput || !denominatorInput) return;
      userAnswer = simplifyFraction({
        numerator: parseInt(numeratorInput),
        denominator: parseInt(denominatorInput)
      });
    } else {
      // 대분수로 입력
      if (!mixedDenominatorInput) return;
      
      const whole = wholeInput ? parseInt(wholeInput) : 0;
      const numerator = mixedNumeratorInput ? parseInt(mixedNumeratorInput) : 0;
      const denominator = parseInt(mixedDenominatorInput);
      
      if (whole === 0 && numerator === 0) return;
      
      userAnswer = simplifyFraction(mixedToImproper(whole, numerator, denominator));
    }
    
    const correct = fractionsEqual(userAnswer, problem.answer);
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
      const messages = EncouragementMessages.correct;
      setMessage(messages[Math.floor(Math.random() * messages.length)]);
    } else {
      const messages = EncouragementMessages.incorrect;
      const encouragement = messages[Math.floor(Math.random() * messages.length)];
      setMessage(`${encouragement}\n정답: ${formatFraction(problem.answer)}`);
    }
    
    setTotalQuestions(totalQuestions + 1);
    
    // 3초 후 다음 문제
    setTimeout(() => {
      setProblem(generateProblem());
      setNumeratorInput('');
      setDenominatorInput('');
      setWholeInput('');
      setMixedNumeratorInput('');
      setMixedDenominatorInput('');
      setMessage('');
    }, 3000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const isSubmitEnabled = () => {
    if (answerMode === 'improper') {
      return numeratorInput && denominatorInput;
    } else {
      return mixedDenominatorInput && (wholeInput || mixedNumeratorInput);
    }
  };

  const accuracy = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  return (
    <AppContainer>
      <GameCard>
        <Title>분수 마스터 🧮</Title>
        <Subtitle>
          4학년 분수 학습 - 분모가 같은 분수의 덧셈과 뺄셈을 연습해요!
        </Subtitle>
        
        <ProblemDisplay>
          <FractionDisplay fraction={problem.fraction1} />
          <span style={{ fontSize: '3rem', color: '#6366f1', fontWeight: 'bold' }}>
            {problem.operation}
          </span>
          <FractionDisplay fraction={problem.fraction2} />
          <span style={{ fontSize: '3rem', color: '#6366f1', fontWeight: 'bold' }}>=</span>
          <span style={{ fontSize: '3rem', color: '#6366f1', fontWeight: 'bold' }}>?</span>
        </ProblemDisplay>
        
        <InputContainer>
          <AnswerModeToggle>
            <ModeButton 
              $active={answerMode === 'improper'}
              onClick={() => setAnswerMode('improper')}
            >
              가분수로 답하기
            </ModeButton>
            <ModeButton 
              $active={answerMode === 'mixed'}
              onClick={() => setAnswerMode('mixed')}
            >
              대분수로 답하기
            </ModeButton>
          </AnswerModeToggle>
          
          {answerMode === 'improper' ? (
            <ImproperFractionInput>
              <FractionInput
                type="number"
                value={numeratorInput}
                onChange={(e) => setNumeratorInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="분자"
              />
              <FractionLine />
              <FractionInput
                type="number"
                value={denominatorInput}
                onChange={(e) => setDenominatorInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="분모"
              />
            </ImproperFractionInput>
          ) : (
            <MixedNumberInput>
              <WholeNumberInput
                type="number"
                value={wholeInput}
                onChange={(e) => setWholeInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="자연수"
                min="0"
              />
              <ImproperFractionInput>
                <FractionInput
                  type="number"
                  value={mixedNumeratorInput}
                  onChange={(e) => setMixedNumeratorInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="분자"
                  min="0"
                />
                <FractionLine />
                <FractionInput
                  type="number"
                  value={mixedDenominatorInput}
                  onChange={(e) => setMixedDenominatorInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="분모"
                  min="1"
                />
              </ImproperFractionInput>
            </MixedNumberInput>
          )}
        </InputContainer>
        
        <Button 
          onClick={handleSubmit}
          disabled={!isSubmitEnabled() || !!message}
        >
          답 확인하기! ✨
        </Button>
        
        {message && (
          <ResultMessage $isCorrect={isCorrect}>
            {message}
          </ResultMessage>
        )}
        
        <StatsContainer>
          <Stat>
            <StatValue>{score}</StatValue>
            <StatLabel>맞힌 문제</StatLabel>
          </Stat>
          <Stat>
            <StatValue>{totalQuestions}</StatValue>
            <StatLabel>총 문제</StatLabel>
          </Stat>
          <Stat>
            <StatValue>{accuracy}%</StatValue>
            <StatLabel>정확도</StatLabel>
          </Stat>
        </StatsContainer>
        
        <div style={{ 
          marginTop: '1.5rem', 
          fontSize: '0.9rem', 
          color: '#666',
          lineHeight: 1.6
        }}>
          💡 <strong>팁:</strong> 분모가 같은 분수는 분자끼리만 더하거나 빼면 돼요!<br/>
          📝 <strong>입력 방법:</strong> 가분수(7/3) 또는 대분수(2 1/3) 형태로 답할 수 있어요!
        </div>
      </GameCard>
    </AppContainer>
  );
}