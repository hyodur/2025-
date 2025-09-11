// 게임 관련 타입 정의

export interface Fraction {
  numerator: number;
  denominator: number;
}

export interface Problem {
  id: string;
  fraction1: Fraction;
  fraction2: Fraction;
  operation: '+' | '-' | '*' | '/';
  answer: Fraction;
  difficulty: 1 | 2 | 3 | 4 | 5;
}

export interface Player {
  name: string;
  level: number;
  experience: number;
  experienceToNext: number;
  coins: number;
  totalProblemsCompleted: number;
  streak: number;
  maxStreak: number;
}

export interface GameStats {
  correctAnswers: number;
  totalAnswers: number;
  currentStreak: number;
  maxStreak: number;
  coinsEarned: number;
  experienceGained: number;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'power-up' | 'cosmetic' | 'booster';
  icon: string;
  owned: boolean;
}

export interface PowerUp {
  id: string;
  name: string;
  description: string;
  duration: number; // seconds
  effect: 'double-coins' | 'hint' | 'extra-time' | 'skip-problem';
  active: boolean;
  remaining: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  requirement: (player: Player, stats: GameStats) => boolean;
  reward: { coins: number; experience: number };
  unlocked: boolean;
}