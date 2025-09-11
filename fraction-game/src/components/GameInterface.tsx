import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Award, ShoppingCart, Settings, Home, Trophy } from 'lucide-react';
import { Problem, Player, GameStats, PowerUp } from '../types/game';
import { FractionDisplay } from './FractionDisplay';
import { generateProblem } from '../utils/problemGenerator';
import { fractionsEqual, simplifyFraction } from '../utils/fractionMath';
import { 
  updatePlayerStats, 
  updateGameStats, 
  getPlayerRank,
  checkAchievements,
  achievements
} from '../utils/gameLogic';
import { 
  getActivePowerUpEffects, 
  generateHint, 
  applyCoinBonus, 
  applyExperienceBonus 
} from '../utils/shopSystem';

interface GameInterfaceProps {
  player: Player;
  onPlayerUpdate: (player: Player) => void;
  onStatsUpdate: (stats: GameStats) => void;
  powerUps: PowerUp[];
  onPowerUpsUpdate: (powerUps: PowerUp[]) => void;
  currentTheme: string;
  onNavigate: (screen: string) => void;
}

const GameContainer = styled.div<{ $theme: string }>`
  min-height: 100vh;
  background: ${props => {
    switch (props.$theme) {
      case 'rainbow': return 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)';
      case 'star': return 'linear-gradient(135deg, #1e1b4b 0%, #3730a3 100%)';
      case 'ocean': return 'linear-gradient(135deg, #0891b2 0%, #1e40af 100%)';
      case 'forest': return 'linear-gradient(135deg, #064e3b 0%, #166534 100%)';
      default: return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  }};
  color: white;
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 1rem;
`;

const PlayerInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const PlayerName = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PlayerStats = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  opacity: 0.9;
`;

const NavigationButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const NavButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem;
  color: white;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  svg {
    width: 1.2rem;
    height: 1.2rem;
  }
`;

const GameArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
`;

const ProblemCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  min-width: 400px;
  text-align: center;
`;

const ProblemDisplay = styled.div`
  font-size: 2rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Operator = styled.span`
  font-size: 3rem;
  font-weight: bold;
  color: #6366f1;
`;

const AnswerSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
`;

const FractionInput = styled.input`
  width: 80px;
  padding: 0.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
  }
`;

const FractionLine = styled.div`
  width: 80px;
  height: 2px;
  background-color: #333;
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border: none;
  border-radius: 0.75rem;
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.05);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const PowerUpBar = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  justify-content: center;
`;

const PowerUpButton = styled.button<{ $active: boolean }>`
  background: ${props => props.$active ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255, 255, 255, 0.2)'};
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem;
  color: white;
  cursor: ${props => props.$active ? 'pointer' : 'not-allowed'};
  opacity: ${props => props.$active ? 1 : 0.5};
  transition: transform 0.2s;
  
  &:hover {
    transform: ${props => props.$active ? 'scale(1.05)' : 'none'};
  }
`;

const HintBox = styled(motion.div)`
  background: #fef3c7;
  color: #92400e;
  border-radius: 0.75rem;
  padding: 1rem;
  margin-top: 1rem;
  border-left: 4px solid #f59e0b;
`;

const ResultModal = styled(motion.div)<{ $isCorrect: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ResultCard = styled(motion.div)<{ $isCorrect: boolean }>`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  color: #333;
  max-width: 400px;
  
  h3 {
    color: ${props => props.$isCorrect ? '#10b981' : '#ef4444'};
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
  }
`;

const NextButton = styled.button`
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
  
  &:hover {
    transform: scale(1.05);
  }
`;

export const GameInterface: React.FC<GameInterfaceProps> = ({
  player,
  onPlayerUpdate,
  onStatsUpdate,
  powerUps,
  onPowerUpsUpdate,
  currentTheme,
  onNavigate
}) => {
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [numeratorInput, setNumeratorInput] = useState('');
  const [denominatorInput, setDenominatorInput] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [gameStats, setGameStats] = useState({
    correctAnswers: 0,
    totalAnswers: 0,
    currentStreak: 0,
    maxStreak: 0,
    coinsEarned: 0,
    experienceGained: 0
  });

  // 새 문제 생성
  const generateNewProblem = useCallback(() => {
    const difficulty = Math.min(Math.floor(player.level / 5) + 1, 5) as 1 | 2 | 3 | 4 | 5;
    const problem = generateProblem(difficulty);
    setCurrentProblem(problem);
    setNumeratorInput('');
    setDenominatorInput('');
    setShowHint(false);
  }, [player.level]);

  // 게임 시작 시 첫 문제 생성
  useEffect(() => {
    if (!currentProblem) {
      generateNewProblem();
    }
  }, [generateNewProblem, currentProblem]);

  // 답안 제출
  const handleSubmit = () => {
    if (!currentProblem || !numeratorInput || !denominatorInput) return;

    const userAnswer = simplifyFraction({
      numerator: parseInt(numeratorInput),
      denominator: parseInt(denominatorInput)
    });

    const correct = fractionsEqual(userAnswer, currentProblem.answer);
    setIsCorrect(correct);
    
    // 플레이어 통계 업데이트
    const updatedPlayer = updatePlayerStats(player, currentProblem, correct, 0);
    const updatedStats = updateGameStats(gameStats, currentProblem, correct, 0);
    
    // 파워업 효과 적용
    const effects = getActivePowerUpEffects(powerUps);
    if (correct) {
      const baseCoins = updatedPlayer.coins - player.coins;
      const baseExp = updatedPlayer.experience - player.experience;
      
      updatedPlayer.coins = player.coins + applyCoinBonus(baseCoins, powerUps);
      updatedPlayer.experience = player.experience + applyExperienceBonus(baseExp, powerUps);
    }

    onPlayerUpdate(updatedPlayer);
    setGameStats(updatedStats);
    onStatsUpdate(updatedStats);
    
    // 성취 확인
    const newAchievements = checkAchievements(updatedPlayer, updatedStats, achievements);
    
    setShowResult(true);
  };

  // 다음 문제로
  const handleNext = () => {
    setShowResult(false);
    generateNewProblem();
  };

  // 힌트 보기
  const handleHint = () => {
    const effects = getActivePowerUpEffects(powerUps);
    if (effects.hintAvailable && currentProblem) {
      setShowHint(true);
      // 힌트 사용 처리 로직 추가
    }
  };

  // 문제 건너뛰기
  const handleSkip = () => {
    const effects = getActivePowerUpEffects(powerUps);
    if (effects.skipAvailable) {
      generateNewProblem();
      // 건너뛰기 사용 처리 로직 추가
    }
  };

  if (!currentProblem) {
    return <div>문제를 생성하는 중...</div>;
  }

  const effects = getActivePowerUpEffects(powerUps);

  return (
    <GameContainer $theme={currentTheme}>
      <Header>
        <PlayerInfo>
          <PlayerName>
            {player.name}
            <Trophy size={20} />
            <span style={{ fontSize: '0.8rem' }}>Lv.{player.level}</span>
          </PlayerName>
          <PlayerStats>
            <span>⭐ {player.experience} XP</span>
            <span>💰 {player.coins} 코인</span>
            <span>🔥 {player.streak} 연속</span>
            <span>{getPlayerRank(player.level)}</span>
          </PlayerStats>
        </PlayerInfo>
        
        <NavigationButtons>
          <NavButton onClick={() => onNavigate('home')}>
            <Home />
          </NavButton>
          <NavButton onClick={() => onNavigate('shop')}>
            <ShoppingCart />
          </NavButton>
          <NavButton onClick={() => onNavigate('achievements')}>
            <Award />
          </NavButton>
          <NavButton onClick={() => onNavigate('settings')}>
            <Settings />
          </NavButton>
        </NavigationButtons>
      </Header>

      <GameArea>
        <PowerUpBar>
          <PowerUpButton 
            $active={effects.hintAvailable} 
            onClick={handleHint}
            title="힌트 보기"
          >
            💡
          </PowerUpButton>
          <PowerUpButton 
            $active={effects.skipAvailable} 
            onClick={handleSkip}
            title="문제 건너뛰기"
          >
            ⏭️
          </PowerUpButton>
        </PowerUpBar>

        <ProblemCard
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <ProblemDisplay>
            <FractionDisplay fraction={currentProblem.fraction1} size="large" />
            <Operator>{currentProblem.operation}</Operator>
            <FractionDisplay fraction={currentProblem.fraction2} size="large" />
            <Operator>=</Operator>
            <span style={{ color: '#6366f1' }}>?</span>
          </ProblemDisplay>

          <AnswerSection>
            <InputRow>
              <FractionInput
                type="number"
                value={numeratorInput}
                onChange={(e) => setNumeratorInput(e.target.value)}
                placeholder="분자"
              />
            </InputRow>
            <FractionLine />
            <InputRow>
              <FractionInput
                type="number"
                value={denominatorInput}
                onChange={(e) => setDenominatorInput(e.target.value)}
                placeholder="분모"
              />
            </InputRow>
            <SubmitButton 
              onClick={handleSubmit}
              disabled={!numeratorInput || !denominatorInput}
            >
              답 확인하기!
            </SubmitButton>
          </AnswerSection>

          <AnimatePresence>
            {showHint && currentProblem && (
              <HintBox
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                💡 힌트: {generateHint(currentProblem)}
              </HintBox>
            )}
          </AnimatePresence>
        </ProblemCard>
      </GameArea>

      <AnimatePresence>
        {showResult && (
          <ResultModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ResultCard
              $isCorrect={isCorrect}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              <h3>{isCorrect ? '정답입니다! 🎉' : '틀렸어요 😅'}</h3>
              {!isCorrect && (
                <div>
                  정답: <FractionDisplay fraction={currentProblem.answer} />
                </div>
              )}
              {isCorrect && (
                <div style={{ marginBottom: '1rem' }}>
                  <p>+{gameStats.coinsEarned} 코인</p>
                  <p>+{gameStats.experienceGained} 경험치</p>
                </div>
              )}
              <NextButton onClick={handleNext}>
                다음 문제 →
              </NextButton>
            </ResultCard>
          </ResultModal>
        )}
      </AnimatePresence>
    </GameContainer>
  );
};