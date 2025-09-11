import { ShopItem, PowerUp, Player } from '../types/game';

// 상점 아이템 정의
export const shopItems: ShopItem[] = [
  // 파워업 아이템들
  {
    id: 'hint_pack',
    name: '힌트 팩',
    description: '어려운 문제에서 힌트를 볼 수 있어요! (3개)',
    price: 30,
    type: 'power-up',
    icon: '💡',
    owned: false
  },
  {
    id: 'double_coins',
    name: '더블 코인',
    description: '5분 동안 획득하는 코인이 2배가 됩니다!',
    price: 50,
    type: 'power-up',
    icon: '💰',
    owned: false
  },
  {
    id: 'extra_time',
    name: '시간 연장',
    description: '문제 풀이 시간을 30초 더 줍니다! (3개)',
    price: 40,
    type: 'power-up',
    icon: '⏰',
    owned: false
  },
  {
    id: 'skip_problem',
    name: '문제 건너뛰기',
    description: '너무 어려운 문제를 건너뛸 수 있어요! (2개)',
    price: 60,
    type: 'power-up',
    icon: '⏭️',
    owned: false
  },
  
  // 부스터 아이템들
  {
    id: 'experience_booster',
    name: '경험치 부스터',
    description: '10분 동안 획득하는 경험치가 1.5배가 됩니다!',
    price: 75,
    type: 'booster',
    icon: '📈',
    owned: false
  },
  {
    id: 'streak_protector',
    name: '연속 보호막',
    description: '한 번 틀려도 연속 정답이 끊어지지 않아요! (1개)',
    price: 100,
    type: 'power-up',
    icon: '🛡️',
    owned: false
  },
  
  // 코스메틱 아이템들
  {
    id: 'rainbow_theme',
    name: '무지개 테마',
    description: '게임 배경을 예쁜 무지개색으로 바꿔요!',
    price: 80,
    type: 'cosmetic',
    icon: '🌈',
    owned: false
  },
  {
    id: 'star_theme',
    name: '별빛 테마',
    description: '게임 배경을 반짝이는 별빛으로 바꿔요!',
    price: 80,
    type: 'cosmetic',
    icon: '✨',
    owned: false
  },
  {
    id: 'ocean_theme',
    name: '바다 테마',
    description: '게임 배경을 시원한 바다로 바꿔요!',
    price: 80,
    type: 'cosmetic',
    icon: '🌊',
    owned: false
  },
  {
    id: 'forest_theme',
    name: '숲속 테마',
    description: '게임 배경을 푸른 숲으로 바꿔요!',
    price: 80,
    type: 'cosmetic',
    icon: '🌲',
    owned: false
  }
];

// 파워업 효과 정의
export const powerUpEffects: Record<string, PowerUp> = {
  hint_pack: {
    id: 'hint_pack',
    name: '힌트',
    description: '문제에 대한 힌트를 보여줍니다',
    duration: 0, // 즉시 사용
    effect: 'hint',
    active: false,
    remaining: 3
  },
  double_coins: {
    id: 'double_coins',
    name: '더블 코인',
    description: '코인 획득량 2배',
    duration: 300, // 5분
    effect: 'double-coins',
    active: false,
    remaining: 0
  },
  extra_time: {
    id: 'extra_time',
    name: '시간 연장',
    description: '문제 풀이 시간 30초 연장',
    duration: 0, // 즉시 사용
    effect: 'extra-time',
    active: false,
    remaining: 3
  },
  skip_problem: {
    id: 'skip_problem',
    name: '문제 건너뛰기',
    description: '현재 문제를 건너뜁니다',
    duration: 0, // 즉시 사용
    effect: 'skip-problem',
    active: false,
    remaining: 2
  },
  experience_booster: {
    id: 'experience_booster',
    name: '경험치 부스터',
    description: '경험치 획득량 1.5배',
    duration: 600, // 10분
    effect: 'double-coins', // 경험치도 코인과 같은 방식으로 처리
    active: false,
    remaining: 0
  },
  streak_protector: {
    id: 'streak_protector',
    name: '연속 보호막',
    description: '한 번의 오답을 무시합니다',
    duration: 0, // 즉시 사용
    effect: 'hint', // 특별 효과
    active: false,
    remaining: 1
  }
};

// 아이템 구매 처리
export function purchaseItem(player: Player, itemId: string, ownedItems: string[]): {
  success: boolean;
  updatedPlayer: Player;
  updatedOwnedItems: string[];
  message: string;
} {
  const item = shopItems.find(i => i.id === itemId);
  
  if (!item) {
    return {
      success: false,
      updatedPlayer: player,
      updatedOwnedItems: ownedItems,
      message: '아이템을 찾을 수 없습니다.'
    };
  }
  
  // 이미 소유한 코스메틱 아이템인지 확인
  if (item.type === 'cosmetic' && ownedItems.includes(itemId)) {
    return {
      success: false,
      updatedPlayer: player,
      updatedOwnedItems: ownedItems,
      message: '이미 소유한 아이템입니다.'
    };
  }
  
  // 코인이 충분한지 확인
  if (player.coins < item.price) {
    return {
      success: false,
      updatedPlayer: player,
      updatedOwnedItems: ownedItems,
      message: '코인이 부족합니다.'
    };
  }
  
  // 구매 처리
  const updatedPlayer = {
    ...player,
    coins: player.coins - item.price
  };
  
  let updatedOwnedItems = [...ownedItems];
  
  // 코스메틱 아이템은 영구 소유
  if (item.type === 'cosmetic') {
    updatedOwnedItems.push(itemId);
  }
  
  return {
    success: true,
    updatedPlayer,
    updatedOwnedItems,
    message: `${item.name}을(를) 구매했습니다!`
  };
}

// 파워업 사용 처리
export function usePowerUp(powerUpId: string, activePowerUps: PowerUp[]): {
  success: boolean;
  updatedPowerUps: PowerUp[];
  message: string;
} {
  const powerUp = powerUpEffects[powerUpId];
  
  if (!powerUp) {
    return {
      success: false,
      updatedPowerUps: activePowerUps,
      message: '파워업을 찾을 수 없습니다.'
    };
  }
  
  // 이미 활성화된 파워업인지 확인
  const existingPowerUp = activePowerUps.find(p => p.id === powerUpId);
  
  if (existingPowerUp) {
    if (existingPowerUp.remaining > 0) {
      // 사용 가능한 경우
      const updatedPowerUps = activePowerUps.map(p => {
        if (p.id === powerUpId) {
          return {
            ...p,
            remaining: p.remaining - 1,
            active: p.duration > 0 ? true : p.active
          };
        }
        return p;
      });
      
      return {
        success: true,
        updatedPowerUps,
        message: `${powerUp.name}을(를) 사용했습니다!`
      };
    } else {
      return {
        success: false,
        updatedPowerUps: activePowerUps,
        message: '사용할 수 있는 파워업이 없습니다.'
      };
    }
  }
  
  return {
    success: false,
    updatedPowerUps: activePowerUps,
    message: '파워업을 먼저 구매해주세요.'
  };
}

// 파워업 시간 업데이트
export function updatePowerUpTimers(powerUps: PowerUp[], deltaTime: number): PowerUp[] {
  return powerUps.map(powerUp => {
    if (powerUp.active && powerUp.duration > 0) {
      const newRemaining = Math.max(0, powerUp.remaining - deltaTime);
      return {
        ...powerUp,
        remaining: newRemaining,
        active: newRemaining > 0
      };
    }
    return powerUp;
  });
}

// 활성 파워업 효과 확인
export function getActivePowerUpEffects(powerUps: PowerUp[]): {
  doubleCoin: boolean;
  experienceBoost: boolean;
  timeExtension: boolean;
  hintAvailable: boolean;
  skipAvailable: boolean;
  streakProtection: boolean;
} {
  return {
    doubleCoin: powerUps.some(p => p.active && p.effect === 'double-coins'),
    experienceBoost: powerUps.some(p => p.active && p.effect === 'double-coins' && p.id === 'experience_booster'),
    timeExtension: powerUps.some(p => p.remaining > 0 && p.effect === 'extra-time'),
    hintAvailable: powerUps.some(p => p.remaining > 0 && p.effect === 'hint' && p.id === 'hint_pack'),
    skipAvailable: powerUps.some(p => p.remaining > 0 && p.effect === 'skip-problem'),
    streakProtection: powerUps.some(p => p.remaining > 0 && p.id === 'streak_protector')
  };
}

// 코인 보상에 파워업 효과 적용
export function applyCoinBonus(baseCoins: number, powerUps: PowerUp[]): number {
  const effects = getActivePowerUpEffects(powerUps);
  
  let multiplier = 1;
  if (effects.doubleCoin) {
    multiplier *= 2;
  }
  
  return Math.floor(baseCoins * multiplier);
}

// 경험치 보상에 파워업 효과 적용
export function applyExperienceBonus(baseExp: number, powerUps: PowerUp[]): number {
  const effects = getActivePowerUpEffects(powerUps);
  
  let multiplier = 1;
  if (effects.experienceBoost) {
    multiplier *= 1.5;
  }
  
  return Math.floor(baseExp * multiplier);
}

// 문제 힌트 생성
export function generateHint(problem: any): string {
  const { fraction1, fraction2, operation } = problem;
  
  switch (operation) {
    case '+':
      if (fraction1.denominator === fraction2.denominator) {
        return `분모가 같으니 분자끼리만 더하면 돼요: ${fraction1.numerator} + ${fraction2.numerator} = ?`;
      } else {
        const lcm = Math.max(fraction1.denominator, fraction2.denominator); // 간단한 예시
        return `분모를 같게 만들어야 해요. 공통분모는 ${lcm}이에요!`;
      }
      
    case '-':
      if (fraction1.denominator === fraction2.denominator) {
        return `분모가 같으니 분자끼리만 빼면 돼요: ${fraction1.numerator} - ${fraction2.numerator} = ?`;
      } else {
        return `분모를 같게 만든 다음에 분자끼리 빼요!`;
      }
      
    case '*':
      return `분수의 곱셈은 분자끼리, 분모끼리 곱해요: ${fraction1.numerator}×${fraction2.numerator}/${fraction1.denominator}×${fraction2.denominator}`;
      
    case '/':
      return `분수의 나눗셈은 두 번째 분수를 뒤집어서 곱해요! ${fraction2.denominator}/${fraction2.numerator}를 곱하면 돼요.`;
      
    default:
      return '차근차근 계산해보세요!';
  }
}

// 테마별 색상 설정
export const themes = {
  default: {
    primary: '#4f46e5',
    secondary: '#06b6d4',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    accent: '#f59e0b'
  },
  rainbow: {
    primary: '#ec4899',
    secondary: '#8b5cf6',
    background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
    accent: '#f97316'
  },
  star: {
    primary: '#fbbf24',
    secondary: '#a78bfa',
    background: 'linear-gradient(135deg, #1e1b4b 0%, #3730a3 100%)',
    accent: '#fde047'
  },
  ocean: {
    primary: '#0ea5e9',
    secondary: '#06b6d4',
    background: 'linear-gradient(135deg, #0891b2 0%, #1e40af 100%)',
    accent: '#0284c7'
  },
  forest: {
    primary: '#10b981',
    secondary: '#059669',
    background: 'linear-gradient(135deg, #064e3b 0%, #166534 100%)',
    accent: '#34d399'
  }
};

// 소유한 아이템 초기 데이터
export function getInitialOwnedItems(): string[] {
  return []; // 빈 배열로 시작
}

// 초기 파워업 데이터
export function getInitialPowerUps(): PowerUp[] {
  return []; // 빈 배열로 시작
}