import React from 'react';
import styled from 'styled-components';
import { PlayerData, DailyMission } from '../GameApp';

interface MissionScreenProps {
  playerData: PlayerData;
  onNavigate: (screen: 'main' | 'game' | 'shop' | 'profile' | 'missions') => void;
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

const Title = styled.h1`
  font-size: 2.5rem;
  text-align: center;
  margin: 0;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const CoinsDisplay = styled.div`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
`;

const MissionList = styled.div`
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const MissionCard = styled.div<{ $completed: boolean }>`
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  border-radius: 1.5rem;
  padding: 2rem;
  transition: all 0.3s;
  border: 3px solid ${props => props.$completed ? '#10b981' : 'transparent'};
  opacity: ${props => props.$completed ? 0.8 : 1};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  }
`;

const MissionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const MissionInfo = styled.div`
  flex: 1;
`;

const MissionTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MissionDescription = styled.p`
  margin: 0;
  opacity: 0.7;
  font-size: 1rem;
`;

const MissionReward = styled.div<{ $completed: boolean }>`
  background: ${props => props.$completed ? '#10b981' : 'linear-gradient(135deg, #f59e0b, #d97706)'};
  color: white;
  border-radius: 1rem;
  padding: 0.75rem 1rem;
  font-weight: bold;
  font-size: 1.1rem;
  text-align: center;
  min-width: 100px;
`;

const ProgressContainer = styled.div`
  margin-top: 1rem;
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  opacity: 0.8;
`;

const ProgressBar = styled.div`
  background: #e5e7eb;
  border-radius: 1rem;
  height: 8px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $percentage: number }>`
  background: linear-gradient(135deg, #10b981, #059669);
  height: 100%;
  width: ${props => props.$percentage}%;
  transition: width 0.3s;
  border-radius: 1rem;
`;

const CompletedBadge = styled.div`
  background: #10b981;
  color: white;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InfoSection = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
  padding: 2rem;
  margin-top: 2rem;
  text-align: center;
`;

const InfoTitle = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const InfoCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
`;

const InfoIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const InfoText = styled.div`
  font-size: 0.9rem;
  line-height: 1.4;
`;

const getMissionIcon = (type: string): string => {
  switch (type) {
    case 'problems': return '📝';
    case 'streak': return '🔥';
    case 'accuracy': return '🎯';
    default: return '📋';
  }
};

export const MissionScreen: React.FC<MissionScreenProps> = ({ playerData, onNavigate }) => {
  const completedMissions = playerData.dailyMissions.filter(m => m.completed).length;
  const totalMissions = playerData.dailyMissions.length;

  return (
    <Container $backgroundSkin={playerData.backgroundSkin}>
      <Header>
        <BackButton onClick={() => onNavigate('main')}>
          ← 메인으로
        </BackButton>
        <Title>📋 일일 미션</Title>
        <CoinsDisplay>
          💰 {playerData.coins} 코인
        </CoinsDisplay>
      </Header>

      <div style={{
        textAlign: 'center',
        marginBottom: '2rem',
        fontSize: '1.2rem',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '1rem',
        padding: '1rem'
      }}>
        오늘의 미션 진행도: {completedMissions}/{totalMissions} 완료 🎯
      </div>

      <MissionList>
        {playerData.dailyMissions.map(mission => {
          const percentage = mission.target > 0 ? Math.min((mission.current / mission.target) * 100, 100) : 0;
          
          return (
            <MissionCard key={mission.id} $completed={mission.completed}>
              <MissionHeader>
                <MissionInfo>
                  <MissionTitle>
                    {getMissionIcon(mission.type)}
                    {mission.title}
                    {mission.completed && <CompletedBadge>✅ 완료!</CompletedBadge>}
                  </MissionTitle>
                  <MissionDescription>
                    {mission.description}
                  </MissionDescription>
                </MissionInfo>
                <MissionReward $completed={mission.completed}>
                  {mission.completed ? '획득!' : `${mission.reward} 코인`}
                </MissionReward>
              </MissionHeader>
              
              <ProgressContainer>
                <ProgressLabel>
                  <span>진행도</span>
                  <span>
                    {mission.type === 'accuracy' 
                      ? `${mission.current}%` 
                      : `${mission.current}/${mission.target}`
                    }
                  </span>
                </ProgressLabel>
                <ProgressBar>
                  <ProgressFill $percentage={percentage} />
                </ProgressBar>
              </ProgressContainer>
            </MissionCard>
          );
        })}
      </MissionList>

      <InfoSection>
        <InfoTitle>💡 미션 안내</InfoTitle>
        <p>매일 자정에 새로운 미션이 업데이트됩니다!</p>
        
        <InfoGrid>
          <InfoCard>
            <InfoIcon>🎮</InfoIcon>
            <InfoText>
              <strong>분수 계산하기</strong><br/>
              게임 화면에서 문제를 풀면<br/>
              미션이 자동으로 업데이트돼요!
            </InfoText>
          </InfoCard>
          <InfoCard>
            <InfoIcon>🏆</InfoIcon>
            <InfoText>
              <strong>보상 획득</strong><br/>
              미션을 완료하면 즉시<br/>
              코인이 지급됩니다!
            </InfoText>
          </InfoCard>
          <InfoCard>
            <InfoIcon>📈</InfoIcon>
            <InfoText>
              <strong>레벨업 효과</strong><br/>
              높은 정확도와 연속 정답으로<br/>
              더 빠르게 성장하세요!
            </InfoText>
          </InfoCard>
        </InfoGrid>
      </InfoSection>
    </Container>
  );
};