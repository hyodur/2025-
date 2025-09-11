import React from 'react';
import styled from 'styled-components';
import { PlayerData } from '../GameApp';

interface MainScreenProps {
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
`;

const Header = styled.div`
  position: absolute;
  top: 2rem;
  right: 2rem;
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const PlayerInfo = styled.div`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const PlayerName = styled.h3`
  margin: 0;
  font-size: 1.1rem;
`;

const PlayerStats = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
`;

const MainContent = styled.div`
  text-align: center;
  max-width: 600px;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 4rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.p`
  font-size: 1.3rem;
  margin-bottom: 3rem;
  opacity: 0.9;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
`;

const Character = styled.div<{ $characterSkin: string }>`
  font-size: 6rem;
  margin: 2rem 0;
  filter: drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.3));
  
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

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;
  max-width: 500px;
  width: 100%;
`;

const MenuButton = styled.button`
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  border: none;
  border-radius: 1.5rem;
  padding: 2rem 1rem;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-height: 120px;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    background: rgba(255, 255, 255, 1);
  }
`;

const MenuIcon = styled.div`
  font-size: 2.5rem;
`;

const MenuText = styled.div`
  font-size: 1.1rem;
`;

const MenuSubText = styled.div`
  font-size: 0.8rem;
  opacity: 0.7;
  margin-top: 0.25rem;
`;

const DailyMissionNotification = styled.div`
  position: absolute;
  top: 2rem;
  left: 2rem;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  font-weight: bold;
  font-size: 0.9rem;
  backdrop-filter: blur(10px);
`;

export const MainScreen: React.FC<MainScreenProps> = ({ playerData, onNavigate }) => {
  const incompleteMissions = playerData.dailyMissions.filter(m => !m.completed).length;
  const accuracy = playerData.totalProblems > 0 
    ? Math.round((playerData.correctProblems / playerData.totalProblems) * 100)
    : 0;

  return (
    <Container $backgroundSkin={playerData.backgroundSkin}>
      {incompleteMissions > 0 && (
        <DailyMissionNotification>
          📋 {incompleteMissions}개의 일일 미션이 있어요!
        </DailyMissionNotification>
      )}
      
      <Header>
        <PlayerInfo>
          <PlayerName>Lv.{playerData.level} {playerData.name}</PlayerName>
          <PlayerStats>
            <span>⭐ {playerData.exp}/{playerData.expToNext}</span>
            <span>💰 {playerData.coins}</span>
            <span>📊 {accuracy}%</span>
          </PlayerStats>
        </PlayerInfo>
      </Header>

      <MainContent>
        <Title>분수 마스터</Title>
        <Subtitle>재미있는 분수 학습으로 레벨업하세요!</Subtitle>
        
        <Character $characterSkin={playerData.characterSkin} />
        
        <MenuGrid>
          <MenuButton onClick={() => onNavigate('game')}>
            <MenuIcon>🎮</MenuIcon>
            <MenuText>분수 계산하기</MenuText>
            <MenuSubText>경험치와 코인을 얻어보세요</MenuSubText>
          </MenuButton>
          
          <MenuButton onClick={() => onNavigate('missions')}>
            <MenuIcon>📋</MenuIcon>
            <MenuText>일일 미션</MenuText>
            <MenuSubText>{incompleteMissions}개의 미션 대기중</MenuSubText>
          </MenuButton>
          
          <MenuButton onClick={() => onNavigate('shop')}>
            <MenuIcon>🛍️</MenuIcon>
            <MenuText>상점</MenuText>
            <MenuSubText>캐릭터와 배경을 구매하세요</MenuSubText>
          </MenuButton>
          
          <MenuButton onClick={() => onNavigate('profile')}>
            <MenuIcon>👤</MenuIcon>
            <MenuText>프로필</MenuText>
            <MenuSubText>내 정보와 성취를 확인하세요</MenuSubText>
          </MenuButton>
        </MenuGrid>
      </MainContent>
    </Container>
  );
};