import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MainScreen } from './screens/MainScreen';
import { GamePlayScreen } from './screens/GamePlayScreen';
import { ShopScreen } from './screens/ShopScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { MissionScreen } from './screens/MissionScreen';

const AppContainer = styled.div`
  min-height: 100vh;
  font-family: 'Segoe UI', sans-serif;
`;

export interface PlayerData {
  name: string;
  level: number;
  exp: number;
  expToNext: number;
  coins: number;
  totalProblems: number;
  correctProblems: number;
  streak: number;
  maxStreak: number;
  characterSkin: string;
  backgroundSkin: string;
  ownedCharacters: string[];
  ownedBackgrounds: string[];
  dailyMissions: DailyMission[];
  lastMissionReset: string;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  reward: number;
  completed: boolean;
  type: 'problems' | 'correct' | 'streak' | 'accuracy';
}

type Screen = 'main' | 'game' | 'shop' | 'profile' | 'missions';

// 기본 플레이어 데이터
const createDefaultPlayer = (): PlayerData => ({
  name: '플레이어',
  level: 1,
  exp: 0,
  expToNext: 100,
  coins: 50,
  totalProblems: 0,
  correctProblems: 0,
  streak: 0,
  maxStreak: 0,
  characterSkin: 'default',
  backgroundSkin: 'default',
  ownedCharacters: ['default'],
  ownedBackgrounds: ['default'],
  dailyMissions: [],
  lastMissionReset: new Date().toDateString()
});

// 최대 레벨 설정
const MAX_LEVEL = 10;

// 레벨업 경험치 계산
const getExpForLevel = (level: number): number => {
  if (level >= MAX_LEVEL) return 999999; // 최대 레벨에서는 더 이상 레벨업 안됨
  return Math.floor(100 * Math.pow(1.3, level - 1)); // 조금 더 빠르게 증가
};

// 일일 미션 생성
const generateDailyMissions = (): DailyMission[] => {
  const missions = [
    {
      id: 'daily_problems',
      title: '오늘의 분수 연습',
      description: '문제를 5개 풀어보세요',
      target: 5,
      current: 0,
      reward: 20,
      completed: false,
      type: 'problems' as const
    },
    {
      id: 'daily_correct',
      title: '정답 마스터',
      description: '3문제를 연속으로 맞혀보세요',
      target: 3,
      current: 0,
      reward: 30,
      completed: false,
      type: 'streak' as const
    },
    {
      id: 'daily_accuracy',
      title: '정확도 챌린지',
      description: '10문제 중 8문제 이상 맞혀보세요 (80% 이상)',
      target: 80,
      current: 0,
      reward: 40,
      completed: false,
      type: 'accuracy' as const
    }
  ];
  
  return missions;
};

export default function GameApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('main');
  const [playerData, setPlayerData] = useState<PlayerData>(createDefaultPlayer());
  const [isLoading, setIsLoading] = useState(true);

  // 로컬 스토리지에서 데이터 로드
  useEffect(() => {
    const savedData = localStorage.getItem('fractionGameData');
    console.log('저장된 데이터 확인:', savedData ? '데이터 있음' : '데이터 없음');
    
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        console.log('로드된 데이터:', { level: parsed.level, coins: parsed.coins, exp: parsed.exp });
        
        // 일일 미션 리셋 확인
        const today = new Date().toDateString();
        if (parsed.lastMissionReset !== today) {
          parsed.dailyMissions = generateDailyMissions();
          parsed.lastMissionReset = today;
        }
        
        setPlayerData(parsed);
      } catch (error) {
        console.error('데이터 로드 실패:', error);
        // 기본 데이터로 시작하되 일일 미션은 생성
        const defaultData = createDefaultPlayer();
        defaultData.dailyMissions = generateDailyMissions();
        setPlayerData(defaultData);
      }
    } else {
      console.log('새 사용자 - 기본 데이터로 시작');
      // 새 사용자: 일일 미션 생성
      const defaultData = createDefaultPlayer();
      defaultData.dailyMissions = generateDailyMissions();
      setPlayerData(defaultData);
    }
    
    setIsLoading(false);
  }, []);

  // 페이지 언로드 시 데이터 저장
  useEffect(() => {
    const handleBeforeUnload = () => {
      try {
        localStorage.setItem('fractionGameData', JSON.stringify(playerData));
        console.log('페이지 종료 시 데이터 저장');
      } catch (error) {
        console.error('페이지 종료 시 저장 실패:', error);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [playerData]);

  // 데이터 저장
  const savePlayerData = (data: PlayerData) => {
    try {
      const dataToSave = JSON.stringify(data);
      localStorage.setItem('fractionGameData', dataToSave);
      console.log('게임 데이터 저장 완료:', { level: data.level, coins: data.coins, exp: data.exp });
      setPlayerData(data);
    } catch (error) {
      console.error('데이터 저장 실패:', error);
    }
  };

  // 레벨업 처리
  const checkLevelUp = (data: PlayerData): PlayerData => {
    let newData = { ...data };
    
    while (newData.exp >= newData.expToNext && newData.level < MAX_LEVEL) {
      newData.exp -= newData.expToNext;
      newData.level++;
      
      // 최대 레벨 도달 시
      if (newData.level >= MAX_LEVEL) {
        newData.level = MAX_LEVEL;
        newData.exp = 0;
        newData.expToNext = 0;
        newData.coins += MAX_LEVEL * 20; // 최대 레벨 달성 보너스
        break;
      } else {
        newData.expToNext = getExpForLevel(newData.level + 1);
        // 레벨업 보너스 코인
        newData.coins += newData.level * 10;
      }
    }
    
    // 최대 레벨에서는 경험치 누적 방지
    if (newData.level >= MAX_LEVEL) {
      newData.exp = 0;
      newData.expToNext = 0;
    }
    
    return newData;
  };

  // 게임 결과 처리
  const handleGameResult = (correct: boolean, streakCount: number) => {
    let newData = { ...playerData };
    
    // 기본 통계 업데이트
    newData.totalProblems++;
    if (correct) {
      newData.correctProblems++;
      newData.streak = streakCount;
      newData.maxStreak = Math.max(newData.maxStreak, streakCount);
      
      // 경험치와 코인 획득
      const baseExp = 10;
      const streakBonus = Math.min(streakCount * 2, 50);
      newData.exp += baseExp + streakBonus;
      newData.coins += 5 + Math.min(streakCount, 10);
    } else {
      newData.streak = 0;
    }
    
    // 일일 미션 업데이트
    newData.dailyMissions = newData.dailyMissions.map(mission => {
      if (mission.completed) return mission;
      
      switch (mission.type) {
        case 'problems':
          if (mission.current < mission.target) {
            mission.current++;
            if (mission.current >= mission.target) {
              mission.completed = true;
              newData.coins += mission.reward;
            }
          }
          break;
          
        case 'streak':
          mission.current = Math.max(mission.current, streakCount);
          if (mission.current >= mission.target) {
            mission.completed = true;
            newData.coins += mission.reward;
          }
          break;
          
        case 'accuracy':
          const accuracy = Math.round((newData.correctProblems / newData.totalProblems) * 100);
          mission.current = accuracy;
          if (newData.totalProblems >= 10 && accuracy >= mission.target) {
            mission.completed = true;
            newData.coins += mission.reward;
          }
          break;
      }
      
      return mission;
    });
    
    // 레벨업 확인
    newData = checkLevelUp(newData);
    
    savePlayerData(newData);
  };

  // 상점 구매 처리
  const handlePurchase = (itemType: 'character' | 'background', itemId: string, price: number) => {
    if (playerData.coins < price) return false;
    
    const newData = { ...playerData };
    newData.coins -= price;
    
    if (itemType === 'character') {
      newData.ownedCharacters.push(itemId);
      newData.characterSkin = itemId;
    } else {
      newData.ownedBackgrounds.push(itemId);
      newData.backgroundSkin = itemId;
    }
    
    savePlayerData(newData);
    return true;
  };

  // 스킨 변경
  const handleSkinChange = (type: 'character' | 'background', skinId: string) => {
    const newData = { ...playerData };
    
    if (type === 'character') {
      newData.characterSkin = skinId;
    } else {
      newData.backgroundSkin = skinId;
    }
    
    savePlayerData(newData);
  };

  if (isLoading) {
    return (
      <AppContainer style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧮</div>
          <div style={{ fontSize: '1.5rem' }}>분수 마스터 로딩 중...</div>
        </div>
      </AppContainer>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'main':
        return (
          <MainScreen 
            playerData={playerData}
            onNavigate={setCurrentScreen}
          />
        );
      case 'game':
        return (
          <GamePlayScreen 
            playerData={playerData}
            onGameResult={handleGameResult}
            onNavigate={setCurrentScreen}
          />
        );
      case 'shop':
        return (
          <ShopScreen 
            playerData={playerData}
            onPurchase={handlePurchase}
            onSkinChange={handleSkinChange}
            onNavigate={setCurrentScreen}
          />
        );
      case 'profile':
        return (
          <ProfileScreen 
            playerData={playerData}
            onSkinChange={handleSkinChange}
            onNavigate={setCurrentScreen}
          />
        );
      case 'missions':
        return (
          <MissionScreen 
            playerData={playerData}
            onNavigate={setCurrentScreen}
          />
        );
      default:
        return (
          <MainScreen 
            playerData={playerData}
            onNavigate={setCurrentScreen}
          />
        );
    }
  };

  return (
    <AppContainer>
      {renderScreen()}
    </AppContainer>
  );
}