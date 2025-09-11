import React, { useState } from 'react';
import styled from 'styled-components';
import { PlayerData } from '../GameApp';

interface ShopScreenProps {
  playerData: PlayerData;
  onPurchase: (itemType: 'character' | 'background', itemId: string, price: number) => boolean;
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

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
`;

const Tab = styled.button<{ $active: boolean }>`
  background: ${props => props.$active ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.2)'};
  color: ${props => props.$active ? '#333' : 'white'};
  border: none;
  border-radius: 1rem;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.$active ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.3)'};
  }
`;

const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const ItemCard = styled.div<{ $owned: boolean }>`
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  border-radius: 1.5rem;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s;
  border: 3px solid ${props => props.$owned ? '#10b981' : 'transparent'};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  }
`;

const ItemIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const ItemName = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
`;

const ItemDescription = styled.p`
  margin: 0 0 1rem 0;
  opacity: 0.7;
  font-size: 0.9rem;
`;

const ItemPrice = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #f59e0b;
  margin-bottom: 1rem;
`;

const PurchaseButton = styled.button<{ $canAfford: boolean; $owned: boolean }>`
  background: ${props => {
    if (props.$owned) return '#10b981';
    if (props.$canAfford) return 'linear-gradient(135deg, #6366f1, #8b5cf6)';
    return '#9ca3af';
  }};
  color: white;
  border: none;
  border-radius: 0.75rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: ${props => (props.$owned || !props.$canAfford) ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  
  &:hover {
    transform: ${props => (props.$owned || !props.$canAfford) ? 'none' : 'scale(1.05)'};
  }
`;

const OwnedBadge = styled.div`
  background: #10b981;
  color: white;
  border-radius: 0.5rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
}

const characterItems: ShopItem[] = [
  { id: 'cat', name: '고양이', description: '귀여운 고양이 친구', price: 100, icon: '🐱' },
  { id: 'dog', name: '강아지', description: '충실한 강아지 친구', price: 100, icon: '🐶' },
  { id: 'panda', name: '판다', description: '사랑스러운 판다', price: 150, icon: '🐼' },
  { id: 'lion', name: '사자', description: '용감한 사자', price: 200, icon: '🦁' },
  { id: 'unicorn', name: '유니콘', description: '마법의 유니콘', price: 300, icon: '🦄' },
  { id: 'robot', name: '로봇', description: '미래의 로봇', price: 250, icon: '🤖' }
];

const backgroundItems: ShopItem[] = [
  { id: 'rainbow', name: '무지개', description: '화려한 무지개 배경', price: 80, icon: '🌈' },
  { id: 'ocean', name: '바다', description: '시원한 바다 배경', price: 80, icon: '🌊' },
  { id: 'forest', name: '숲', description: '푸른 숲 배경', price: 100, icon: '🌲' },
  { id: 'sunset', name: '노을', description: '아름다운 노을 배경', price: 120, icon: '🌅' },
  { id: 'space', name: '우주', description: '신비한 우주 배경', price: 150, icon: '🌌' }
];

export const ShopScreen: React.FC<ShopScreenProps> = ({ playerData, onPurchase, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'character' | 'background'>('character');
  const [purchaseMessage, setPurchaseMessage] = useState('');

  const handlePurchase = (itemType: 'character' | 'background', itemId: string, price: number) => {
    const success = onPurchase(itemType, itemId, price);
    
    if (success) {
      setPurchaseMessage(`구매 완료! ${itemType === 'character' ? '캐릭터' : '배경'}이 적용되었어요! 🎉`);
    } else {
      setPurchaseMessage('코인이 부족해요! 더 많은 문제를 풀어서 코인을 모아보세요! 💰');
    }
    
    setTimeout(() => {
      setPurchaseMessage('');
    }, 3000);
  };

  const currentItems = activeTab === 'character' ? characterItems : backgroundItems;
  const ownedItems = activeTab === 'character' ? playerData.ownedCharacters : playerData.ownedBackgrounds;

  return (
    <Container $backgroundSkin={playerData.backgroundSkin}>
      <Header>
        <BackButton onClick={() => onNavigate('main')}>
          ← 메인으로
        </BackButton>
        <Title>🛍️ 상점</Title>
        <CoinsDisplay>
          💰 {playerData.coins} 코인
        </CoinsDisplay>
      </Header>

      {purchaseMessage && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          color: '#333',
          padding: '1rem',
          borderRadius: '1rem',
          textAlign: 'center',
          marginBottom: '2rem',
          fontWeight: 'bold'
        }}>
          {purchaseMessage}
        </div>
      )}

      <TabContainer>
        <Tab 
          $active={activeTab === 'character'}
          onClick={() => setActiveTab('character')}
        >
          👥 캐릭터
        </Tab>
        <Tab 
          $active={activeTab === 'background'}
          onClick={() => setActiveTab('background')}
        >
          🎨 배경
        </Tab>
      </TabContainer>

      <ItemGrid>
        {currentItems.map(item => {
          const isOwned = ownedItems.includes(item.id);
          const canAfford = playerData.coins >= item.price;
          
          return (
            <ItemCard key={item.id} $owned={isOwned}>
              {isOwned && <OwnedBadge>보유중</OwnedBadge>}
              <ItemIcon>{item.icon}</ItemIcon>
              <ItemName>{item.name}</ItemName>
              <ItemDescription>{item.description}</ItemDescription>
              <ItemPrice>{item.price} 코인</ItemPrice>
              <PurchaseButton
                $canAfford={canAfford}
                $owned={isOwned}
                onClick={() => !isOwned && canAfford && handlePurchase(activeTab, item.id, item.price)}
              >
                {isOwned ? '보유중' : canAfford ? '구매하기' : '코인 부족'}
              </PurchaseButton>
            </ItemCard>
          );
        })}
      </ItemGrid>

      <div style={{
        marginTop: '3rem',
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '1rem',
        padding: '2rem',
        maxWidth: '600px',
        margin: '3rem auto 0'
      }}>
        <h3 style={{ marginTop: 0 }}>💡 코인을 얻는 방법</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>✅</div>
            <div>문제를 맞힐 때마다<br/>5 + 연속 보너스</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📈</div>
            <div>레벨업 할 때마다<br/>레벨 × 10 코인</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📋</div>
            <div>일일 미션 완료시<br/>20~40 코인</div>
          </div>
        </div>
      </div>
    </Container>
  );
};