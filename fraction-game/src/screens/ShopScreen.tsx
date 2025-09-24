import React, { useState } from 'react';
import styled from 'styled-components';
import { PlayerData } from '../GameApp';

interface ShopScreenProps {
  playerData: PlayerData;
  onPurchase: (itemType: 'character' | 'background', itemId: string, price: number) => boolean;
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
  margin-bottom: 0.5rem;
`;

const ItemRequirement = styled.div<{ $canUnlock: boolean }>`
  font-size: 0.9rem;
  color: ${props => props.$canUnlock ? '#10b981' : '#ef4444'};
  font-weight: bold;
  margin-bottom: 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const PurchaseButton = styled.button<{ $canAfford: boolean; $owned: boolean; $canUnlock: boolean }>`
  background: ${props => {
    if (props.$owned) return '#10b981';
    if (!props.$canUnlock) return '#9ca3af';
    if (props.$canAfford) return 'linear-gradient(135deg, #6366f1, #8b5cf6)';
    return '#9ca3af';
  }};
  color: white;
  border: none;
  border-radius: 0.75rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: ${props => (props.$owned || !props.$canAfford || !props.$canUnlock) ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  flex: 1;
  min-width: 80px;
`;

const EquipButton = styled.button<{ $isEquipped: boolean }>`
  background: ${props => props.$isEquipped ? '#ef4444' : '#f59e0b'};
  color: white;
  border: none;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  min-width: 60px;
  
  &:hover {
    background: ${props => props.$isEquipped ? '#dc2626' : '#d97706'};
  }
  
  &:hover {
    transform: ${props => (props.$owned || !props.$canAfford || !props.$canUnlock) ? 'none' : 'scale(1.05)'};
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
  requiredLevel: number;
}

const characterItems: ShopItem[] = [
  { id: 'default', name: '계산기', description: '기본 계산기 친구 (무료)', price: 0, icon: '🧮', requiredLevel: 1 },
  { id: 'cat', name: '고양이', description: '귀여운 고양이 친구', price: 80, icon: '🐱', requiredLevel: 2 },
  { id: 'dog', name: '강아지', description: '충실한 강아지 친구', price: 100, icon: '🐶', requiredLevel: 3 },
  { id: 'panda', name: '판다', description: '사랑스러운 판다', price: 120, icon: '🐼', requiredLevel: 4 },
  { id: 'lion', name: '사자', description: '용감한 사자', price: 150, icon: '🦁', requiredLevel: 6 },
  { id: 'robot', name: '로봇', description: '미래의 로봇', price: 180, icon: '🤖', requiredLevel: 7 },
 { id: 'unicorn', name: '유니콘', description: '마법의 유니콘', price: 200, icon: '🦄', requiredLevel: 8 },
  // 레전드리 등급 (10레벨+)
  { id: 'dragon', name: '드래곤', description: '🔥 전설의 수학 드래곤', price: 300, icon: '🐲', requiredLevel: 12, rarity: 'legendary' },
  { id: 'wizard', name: '마법사', description: '✨ 분수를 다루는 마법사', price: 400, icon: '🧙‍♀️', requiredLevel: 15, rarity: 'legendary' },
  { id: 'alien', name: '외계인', description: '👽 수학 천재 외계인', price: 350, icon: '👽', requiredLevel: 13, rarity: 'legendary' },
  { id: 'superhero', name: '슈퍼히어로', description: '🦸 수학 슈퍼히어로', price: 450, icon: '🦸‍♂️', requiredLevel: 18, rarity: 'legendary' },
  { id: 'king', name: '분수 왕', description: '👑 분수 왕국의 왕', price: 500, icon: '👑', requiredLevel: 20, rarity: 'legendary' }
];

const backgroundItems: ShopItem[] = [
  { id: 'default', name: '클래식', description: '깔끔한 기본 배경 (무료)', price: 0, icon: '📚', requiredLevel: 1 },
  { id: 'rainbow', name: '무지개', description: '화려한 무지개 배경', price: 60, icon: '🌈', requiredLevel: 2 },
  { id: 'ocean', name: '바다', description: '시원한 바다 배경', price: 80, icon: '🌊', requiredLevel: 3 },
  { id: 'forest', name: '숲', description: '푸른 숲 배경', price: 100, icon: '🌲', requiredLevel: 5 },
  { id: 'sunset', name: '노을', description: '아름다운 노을 배경', price: 120, icon: '🌅', requiredLevel: 7 },
  { id: 'space', name: '우주', description: '신비한 우주 배경', price: 150, icon: '🌌', requiredLevel: 10 },
  // 레전드리 등급 (10레벨+)
  { id: 'castle', name: '마법성', description: '🏰 마법사의 신비한 성', price: 250, icon: '🏰', requiredLevel: 12, rarity: 'legendary' },
  { id: 'volcano', name: '화산', description: '🌋 활활 타오르는 화산', price: 300, icon: '🌋', requiredLevel: 15, rarity: 'legendary' },
  { id: 'underwater', name: '해저도시', description: '🐠 신비한 해저 도시', price: 280, icon: '🏙️', requiredLevel: 13, rarity: 'legendary' },
  { id: 'circus', name: '서커스', description: '🎪 신나는 서커스장', price: 320, icon: '🎪', requiredLevel: 17, rarity: 'legendary' },
  { id: 'temple', name: '수학신전', description: '🏛️ 고대 수학의 신전', price: 400, icon: '🏛️', requiredLevel: 20, rarity: 'legendary' }
];

export const ShopScreen: React.FC<ShopScreenProps> = ({ playerData, onPurchase, onSkinChange, onNavigate }) => {
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
          const canAfford = item.price === 0 || playerData.coins >= item.price;
          const canUnlock = playerData.level >= item.requiredLevel;
          
          return (
            <ItemCard key={item.id} $owned={isOwned}>
              {isOwned && <OwnedBadge>보유중</OwnedBadge>}
              <ItemIcon style={{ opacity: canUnlock ? 1 : 0.4 }}>{item.icon}</ItemIcon>
              <ItemName>{item.name}</ItemName>
              <ItemDescription>{item.description}</ItemDescription>
              <ItemPrice>{item.price === 0 ? '무료! 🎁' : `${item.price} 코인`}</ItemPrice>
              <ItemRequirement $canUnlock={canUnlock}>
                {canUnlock ? `✅ 레벨 ${item.requiredLevel} 달성` : `🔒 레벨 ${item.requiredLevel} 필요`}
              </ItemRequirement>
              {isOwned ? (
                <ButtonContainer>
                  <PurchaseButton
                    $canAfford={true}
                    $owned={true}
                    $canUnlock={true}
                    onClick={() => {}}
                  >
                    보유중
                  </PurchaseButton>
                  <EquipButton
                    $isEquipped={
                      activeTab === 'character' 
                        ? playerData.characterSkin === item.id 
                        : playerData.backgroundSkin === item.id
                    }
                    onClick={() => {
                      onSkinChange(activeTab, item.id);
                      setPurchaseMessage(
                        activeTab === 'character' 
                          ? `${item.name} 캐릭터를 착용했어요! 🎭` 
                          : `${item.name} 배경을 착용했어요! 🎨`
                      );
                      setTimeout(() => setPurchaseMessage(''), 2000);
                    }}
                  >
                    {activeTab === 'character' 
                      ? (playerData.characterSkin === item.id ? '착용중' : '착용')
                      : (playerData.backgroundSkin === item.id ? '착용중' : '착용')
                    }
                  </EquipButton>
                </ButtonContainer>
              ) : (
                <PurchaseButton
                  $canAfford={canAfford}
                  $owned={false}
                  $canUnlock={canUnlock}
                  onClick={() => canUnlock && (item.price === 0 || canAfford) && handlePurchase(activeTab, item.id, item.price)}
                >
                  {!canUnlock 
                    ? '레벨 부족' 
                    : item.price === 0
                      ? '무료 획득'
                      : canAfford 
                        ? '구매하기' 
                        : '코인 부족'
                  }
                </PurchaseButton>
              )}
            </ItemCard>
          );
        })}
      </ItemGrid>

      <div style={{
        marginTop: '3rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        maxWidth: '1000px',
        margin: '3rem auto 0'
      }}>
        <div style={{
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '1rem',
          padding: '2rem'
        }}>
          <h3 style={{ marginTop: 0 }}>💡 코인을 얻는 방법</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
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

        <div style={{
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '1rem',
          padding: '2rem'
        }}>
          <h3 style={{ marginTop: 0 }}>🔓 레벨별 해금 아이템</h3>
          <div style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
            <div>🐱 레벨 2: 고양이</div>
            <div>🌈 레벨 2: 무지개 배경</div>
            <div>🐶 레벨 3: 강아지</div>
            <div>🌊 레벨 3: 바다 배경</div>
            <div>🐼 레벨 4: 판다</div>
            <div>🌲 레벨 5: 숲 배경</div>
            <div>🦁 레벨 6: 사자</div>
            <div>🤖 레벨 7: 로봇</div>
            <div>🌅 레벨 7: 노을 배경</div>
            <div>🦄 레벨 8: 유니콘</div>
            <div style={{ color: '#fbbf24', fontWeight: 'bold' }}>🌌 레벨 10: 우주 배경 (최고급!)</div>
          </div>
        </div>
      </div>
    </Container>
  );
};
