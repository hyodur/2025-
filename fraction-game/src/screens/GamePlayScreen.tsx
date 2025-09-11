import React, { useState } from 'react';
import styled from 'styled-components';
import { PlayerData } from '../GameApp';

interface GamePlayScreenProps {
  playerData: PlayerData;
  onGameResult: (correct: boolean, streakCount: number) => void;
  onNavigate: (screen: 'main' | 'game' | 'shop' | 'profile' | 'missions') => void;
}

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

const Container = styled.div<{ $backgroundSkin: string }>`
  min-height: 100vh;
  background: ${props => {
    switch (props.$backgroundSkin) {
      case 'rainbow': return 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)';
      case 'ocean': return 'linear-gradient(135deg, #0891b2 0%, #1e40af 100%)';
      case 'forest': return 'linear-gradient(135deg, #064e3b 0%, #166534 100%)';
      case 'sunset': return 'linear-gradient(135deg, #f97316 0%, #dc2626 100%)';
      case 'space': return 'linear-gradient(135deg, #1e1b4b 0%, #581c87 100%)';
      default: return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  }};
  color: white;
  display: flex;
  flex-direction: column;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 0.75rem;
  color: white;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const GameStats = styled.div`
  display: flex;
  gap: 2rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 1rem;
  font-size: 1.1rem;
`;

const GameArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

// 게임 로직 함수들은 SimpleApp.tsx에서 가져온 것과 동일
function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

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

function mixedToImproper(whole: number, numerator: number, denominator: number): Fraction {
  return {
    numerator: whole * denominator + numerator,
    denominator: denominator
  };
}

function addSameDenominator(f1: Fraction, f2: Fraction): Fraction {
  const numerator = f1.numerator + f2.numerator;
  return simplifyFraction({ numerator, denominator: f1.denominator });
}

function subtractSameDenominator(f1: Fraction, f2: Fraction): Fraction {
  const numerator = f1.numerator - f2.numerator;
  return simplifyFraction({ numerator, denominator: f1.denominator });
}

function calculateFraction(f1: Fraction, f2: Fraction, operation: '+' | '-'): Fraction {
  switch (operation) {
    case '+': return addSameDenominator(f1, f2);
    case '-': return subtractSameDenominator(f1, f2);
  }
}

function fractionsEqual(f1: Fraction, f2: Fraction): boolean {
  const s1 = simplifyFraction(f1);
  const s2 = simplifyFraction(f2);
  return s1.numerator === s2.numerator && s1.denominator === s2.denominator;
}

function generateFraction(denominator: number, allowImproper: boolean = true): Fraction {
  let numerator: number;
  
  if (allowImproper) {
    numerator = Math.floor(Math.random() * (Math.floor(denominator * 2.5))) + 1;
  } else {
    numerator = Math.floor(Math.random() * (denominator - 1)) + 1;
  }
  
  return { numerator, denominator };
}

function generateProblem(): Problem {
  const denominators = [2, 3, 4, 5, 6, 8, 10, 12];
  const denominator = denominators[Math.floor(Math.random() * denominators.length)];
  
  const operations: ('+' | '-')[] = ['+', '-'];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  
  let fraction1: Fraction;
  let fraction2: Fraction;
  
  do {
    fraction1 = generateFraction(denominator, true);
    fraction2 = generateFraction(denominator, true);
    
    if (fraction1.numerator % fraction1.denominator === 0 && 
        fraction2.numerator % fraction2.denominator === 0) {
      continue;
    }
    
    break;
  } while (true);
  
  if (operation === '-' && fraction1.numerator < fraction2.numerator) {
    [fraction1, fraction2] = [fraction2, fraction1];
  }
  
  const answer = calculateFraction(fraction1, fraction2, operation);
  
  return { fraction1, fraction2, operation, answer };
}

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

export const GamePlayScreen: React.FC<GamePlayScreenProps> = ({ 
  playerData, 
  onGameResult, 
  onNavigate 
}) => {
  const [problem, setProblem] = useState<Problem>(generateProblem());
  const [answerMode, setAnswerMode] = useState<'improper' | 'mixed'>('improper');
  const [numeratorInput, setNumeratorInput] = useState('');
  const [denominatorInput, setDenominatorInput] = useState('');
  const [wholeInput, setWholeInput] = useState('');
  const [mixedNumeratorInput, setMixedNumeratorInput] = useState('');
  const [mixedDenominatorInput, setMixedDenominatorInput] = useState('');
  const [sessionStats, setSessionStats] = useState({
    problems: 0,
    correct: 0,
    streak: 0
  });
  const [message, setMessage] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    let userAnswer: Fraction;
    
    if (answerMode === 'improper') {
      if (!numeratorInput || !denominatorInput) return;
      userAnswer = simplifyFraction({
        numerator: parseInt(numeratorInput),
        denominator: parseInt(denominatorInput)
      });
    } else {
      const whole = wholeInput ? parseInt(wholeInput) : 0;
      const numerator = mixedNumeratorInput ? parseInt(mixedNumeratorInput) : 0;
      const denominator = mixedDenominatorInput ? parseInt(mixedDenominatorInput) : 1;
      
      // If only whole number is entered, treat as a whole number (denominator = 1)
      if (wholeInput && !mixedNumeratorInput && !mixedDenominatorInput) {
        userAnswer = simplifyFraction({ numerator: whole, denominator: 1 });
      } else {
        // Regular mixed number handling
        if (!mixedDenominatorInput) return;
        if (whole === 0 && numerator === 0) return;
        
        // 대분수에서는 분수 부분이 진분수여야 함 (분자 < 분모)
        if (numerator >= denominator) {
          setMessage('대분수에서 분수 부분은 진분수여야 해요! (분자 < 분모) 🤔');
          setIsCorrect(false);
          setTimeout(() => {
            setMessage('');
          }, 3000);
          return;
        }
        
        userAnswer = simplifyFraction(mixedToImproper(whole, numerator, denominator));
      }
    }
    
    const correct = fractionsEqual(userAnswer, problem.answer);
    setIsCorrect(correct);
    
    let newStats = { ...sessionStats };
    newStats.problems++;
    
    if (correct) {
      newStats.correct++;
      newStats.streak++;
      setMessage(`정답입니다! 🎉 연속 ${newStats.streak}개 맞혔어요!`);
    } else {
      newStats.streak = 0;
      setMessage(`아쉬워요! 😊 정답: ${formatFraction(problem.answer)}`);
    }
    
    setSessionStats(newStats);
    onGameResult(correct, newStats.streak);
    
    setTimeout(() => {
      setProblem(generateProblem());
      setNumeratorInput('');
      setDenominatorInput('');
      setWholeInput('');
      setMixedNumeratorInput('');
      setMixedDenominatorInput('');
      setMessage('');
    }, 2500);
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
      // Allow submission if only whole number is entered (for whole number answers)
      // or if both denominator and at least one of whole/numerator is entered
      return wholeInput || (mixedDenominatorInput && mixedNumeratorInput);
    }
  };

  return (
    <Container $backgroundSkin={playerData.backgroundSkin}>
      <Header>
        <BackButton onClick={() => onNavigate('main')}>
          ← 메인으로
        </BackButton>
        <GameStats>
          <span>📊 {sessionStats.problems}문제</span>
          <span>✅ {sessionStats.correct}개 맞음</span>
          <span>🔥 {sessionStats.streak} 연속</span>
          <span>💰 Lv.{playerData.level}</span>
        </GameStats>
      </Header>

      <GameArea>
        <GameCard>
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
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
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
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FractionInput
                  type="number"
                  value={wholeInput}
                  onChange={(e) => setWholeInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="자연수"
                  min="0"
                  style={{ width: '60px' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
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
                </div>
              </div>
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
        </GameCard>
      </GameArea>
    </Container>
  );
};