import React from 'react';
import styled from 'styled-components';
import { PlayerData } from '../GameApp';

interface ProfileScreenProps {
  playerData: PlayerData;
  onSkinChange: (type: 'character' | 'background', skinId: string) => void;
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

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProfileSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  border-radius: 2rem;
  padding: 2rem;
  text-align: center;
`;

const PlayerAvatar = styled.div<{ $characterSkin: string }>`
  font-size: 6rem;
  margin-bottom: 1rem;
  
  &::before {
    content: '${props => {
      switch (props.$characterSkin) {
        case 'cat': return '🐱';
        case 'dog': return '🐶';
        case 'panda': return '🐼';
        case 'lion': return '🦁';
        case 'unicorn': return '🦄';
        case 'robot': return '🤖';
        default: return '🧮';
      }
    }}';
  }
`;

const PlayerName = styled.h2`
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
`;

const PlayerLevel = styled.div`
  font-size: 1.5rem;
  color: #6366f1;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const ExpBar = styled.div`
  background: #e5e7eb;
  border-radius: 1rem;
  height: 12px;
  overflow: hidden;
  margin: 1rem 0;
`;

const ExpFill = styled.div<{ $percentage: number }>`
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  height: 100%;
  width: ${props => props.$percentage}%;
  transition: width 0.3s;
`;

const ExpText = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
`;

const StatsSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  border-radius: 2rem;
  padding: 2rem;
`;

const SectionTitle = styled.h3`
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  text-align: center;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const StatCard = styled.div`
  background: #f8fafc;
  border-radius: 1rem;
  padding: 1.5rem;
  text-align: center;
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

const CustomizationSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  border-radius: 2rem;
  padding: 2rem;
  grid-column: 1 / -1;
`;

const CustomizationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-top: 1.5rem;
`;

const SkinCategory = styled.div``;

const SkinGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const SkinButton = styled.button<{ $active: boolean; $owned: boolean }>`
  width: 80px;
  height: 80px;
  border-radius: 1rem;
  border: 3px solid ${props => props.$active ? '#6366f1' : props.$owned ? '#10b981' : '#e5e7eb'};
  background: ${props => props.$active ? '#f0f9ff' : props.$owned ? '#f0fdf4' : '#f8fafc'};
  font-size: 2rem;
  cursor: ${props => props.$owned ? 'pointer' : 'not-allowed'};
  opacity: ${props => props.$owned ? 1 : 0.4};
  transition: all 0.2s;
  
  &:hover {
    transform: ${props => props.$owned ? 'scale(1.05)' : 'none'};
  }
`;

const AchievementSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  border-radius: 2rem;
  padding: 2rem;
  grid-column: 1 / -1;
`;

const AchievementGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
`;

const AchievementCard = styled.div<{ $unlocked: boolean }>`
  background: ${props => props.$unlocked ? '#f0fdf4' : '#f8fafc'};
  border: 2px solid ${props => props.$unlocked ? '#10b981' : '#e5e7eb'};
  border-radius: 1rem;
  padding: 1rem;
  text-align: center;
  opacity: ${props => props.$unlocked ? 1 : 0.6};
`;

const AchievementIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const AchievementName = styled.div`
  font-weight: bold;
  margin-bottom: 0.25rem;
`;

const AchievementDesc = styled.div`
  font-size: 0.8rem;
  opacity: 0.7;
`;

const characterSkins = [
  { id: 'default', icon: '🧮', name: '기본' },
  { id: 'cat', icon: '🐱', name: '고양이' },
  { id: 'dog', icon: '🐶', name: '강아지' },
  { id: 'panda', icon: '🐼', name: '판다' },
  { id: 'lion', icon: '🦁', name: '사자' },
  { id: 'unicorn', icon: '🦄', name: '유니콘' },
  { id: 'robot', icon: '🤖', name: '로봇' }
];

const backgroundSkins = [
  { id: 'default', icon: '💜', name: '기본' },
  { id: 'rainbow', icon: '🌈', name: '무지개' },
  { id: 'ocean', icon: '🌊', name: '바다' },
  { id: 'forest', icon: '🌲', name: '숲' },
  { id: 'sunset', icon: '🌅', name: '노을' },
  { id: 'space', icon: '🌌', name: '우주' }
];

const achievements = [
  { id: 'first_problem', name: '첫 걸음', desc: '첫 번째 문제 완료', icon: '🎯', requirement: (p: PlayerData) => p.totalProblems >= 1 },
  { id: 'streak_5', name: '연속 달성', desc: '5개 연속 정답', icon: '🔥', requirement: (p: PlayerData) => p.maxStreak >= 5 },
  { id: 'level_5', name: '성장하는 마음', desc: '5레벨 달성', icon: '⭐', requirement: (p: PlayerData) => p.level >= 5 },
  { id: 'problems_50', name: '열심히 공부', desc: '50문제 완료', icon: '📚', requirement: (p: PlayerData) => p.totalProblems >= 50 },
  { id: 'accuracy_80', name: '정확도 마스터', desc: '80% 이상 정확도', icon: '🎖️', requirement: (p: PlayerData) => p.totalProblems >= 10 && (p.correctProblems / p.totalProblems) >= 0.8 },
  { id: 'coins_500', name: '부자가 되었다', desc: '500코인 획득', icon: '💰', requirement: (p: PlayerData) => p.coins >= 500 }
];

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ 
  playerData, 
  onSkinChange, 
  onNavigate 
}) => {
  const accuracy = playerData.totalProblems > 0 
    ? Math.round((playerData.correctProblems / playerData.totalProblems) * 100)
    : 0;
    
  const expPercentage = playerData.expToNext > 0 
    ? (playerData.exp / playerData.expToNext) * 100
    : 0;

  return (
    <Container $backgroundSkin={playerData.backgroundSkin}>
      <Header>
        <BackButton onClick={() => onNavigate('main')}>
          ← 메인으로
        </BackButton>
        <Title>👤 프로필</Title>
        <CoinsDisplay>
          💰 {playerData.coins} 코인
        </CoinsDisplay>
      </Header>

      <ContentGrid>
        <ProfileSection>
          <PlayerAvatar $characterSkin={playerData.characterSkin} />
          <PlayerName>{playerData.name}</PlayerName>
          <PlayerLevel>
            레벨 {playerData.level} {playerData.level >= 25 ? '(최대 레벨)' : ''}
          </PlayerLevel>
          {playerData.level < 25 ? (
            <>
              <ExpBar>
                <ExpFill $percentage={expPercentage} />
              </ExpBar>
              <ExpText>
                경험치: {playerData.exp} / {playerData.expToNext}
              </ExpText>
            </>
          ) : (
            <ExpText style={{ color: '#f59e0b', fontWeight: 'bold', fontSize: '1.1rem' }}>
              🏆 최대 레벨에 도달했습니다! 🏆
            </ExpText>
          )}
        </ProfileSection>

        <StatsSection>
          <SectionTitle>📊 게임 통계</SectionTitle>
          <StatsGrid>
            <StatCard>
              <StatValue>{playerData.totalProblems}</StatValue>
              <StatLabel>총 문제 수</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{playerData.correctProblems}</StatValue>
              <StatLabel>맞힌 문제</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{accuracy}%</StatValue>
              <StatLabel>정확도</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{playerData.maxStreak}</StatValue>
              <StatLabel>최대 연속</StatLabel>
            </StatCard>
          </StatsGrid>
        </StatsSection>
      </ContentGrid>

      <CustomizationSection>
        <SectionTitle>🎨 스킨 변경</SectionTitle>
        <CustomizationGrid>
          <SkinCategory>
            <h4>👥 캐릭터</h4>
            <SkinGrid>
              {characterSkins.map(skin => (
                <SkinButton
                  key={skin.id}
                  $active={playerData.characterSkin === skin.id}
                  $owned={playerData.ownedCharacters.includes(skin.id)}
                  onClick={() => {
                    if (playerData.ownedCharacters.includes(skin.id)) {
                      onSkinChange('character', skin.id);
                    }
                  }}
                  title={skin.name}
                >
                  {skin.icon}
                </SkinButton>
              ))}
            </SkinGrid>
          </SkinCategory>

          <SkinCategory>
            <h4>🎨 배경</h4>
            <SkinGrid>
              {backgroundSkins.map(skin => (
                <SkinButton
                  key={skin.id}
                  $active={playerData.backgroundSkin === skin.id}
                  $owned={playerData.ownedBackgrounds.includes(skin.id)}
                  onClick={() => {
                    if (playerData.ownedBackgrounds.includes(skin.id)) {
                      onSkinChange('background', skin.id);
                    }
                  }}
                  title={skin.name}
                >
                  {skin.icon}
                </SkinButton>
              ))}
            </SkinGrid>
          </SkinCategory>
        </CustomizationGrid>
      </CustomizationSection>

      <AchievementSection>
        <SectionTitle>🏆 성취</SectionTitle>
        <AchievementGrid>
          {achievements.map(achievement => {
            const unlocked = achievement.requirement(playerData);
            
            return (
              <AchievementCard key={achievement.id} $unlocked={unlocked}>
                <AchievementIcon>{achievement.icon}</AchievementIcon>
                <AchievementName>{achievement.name}</AchievementName>
                <AchievementDesc>{achievement.desc}</AchievementDesc>
              </AchievementCard>
            );
          })}
        </AchievementGrid>
      </AchievementSection>
    </Container>
  );
};
