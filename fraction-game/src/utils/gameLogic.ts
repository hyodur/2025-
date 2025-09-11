import { Player, GameStats, Problem } from '../types/game';

// 레벨별 필요 경험치 계산
export function getExperienceRequired(level: number): number {
  // 레벨이 올라갈수록 더 많은 경험치가 필요
  return Math.floor(100 * Math.pow(1.15, level - 1));
}

// 난이도별 경험치 보상
export function getExperienceReward(difficulty: number, isCorrect: boolean, streak: number = 0): number {
  if (!isCorrect) return 0;
  
  let baseExp = difficulty * 10;
  
  // 연속 정답에 따른 보너스
  const streakBonus = Math.min(streak * 2, 50); // 최대 50 보너스
  
  return baseExp + streakBonus;
}

// 난이도별 코인 보상
export function getCoinReward(difficulty: number, isCorrect: boolean, streak: number = 0): number {
  if (!isCorrect) return 0;
  
  let baseCoins = difficulty * 5;
  
  // 연속 정답에 따른 보너스
  const streakBonus = Math.min(streak * 1, 25); // 최대 25 보너스
  
  return baseCoins + streakBonus;
}

// 플레이어 레벨업 확인 및 처리
export function checkLevelUp(player: Player): { leveledUp: boolean; newLevel: number; levelsGained: number } {
  let currentLevel = player.level;
  let currentExp = player.experience;
  let levelsGained = 0;
  
  while (currentExp >= getExperienceRequired(currentLevel + 1)) {
    currentExp -= getExperienceRequired(currentLevel + 1);
    currentLevel++;
    levelsGained++;
    
    // 최대 레벨 제한 (예: 50레벨)
    if (currentLevel >= 50) break;
  }
  
  return {
    leveledUp: levelsGained > 0,
    newLevel: currentLevel,
    levelsGained
  };
}

// 플레이어 데이터 업데이트
export function updatePlayerStats(
  player: Player, 
  problem: Problem, 
  isCorrect: boolean, 
  timeSpent: number
): Player {
  const newStats = { ...player };
  
  // 연속 정답 처리
  if (isCorrect) {
    newStats.streak++;
    newStats.maxStreak = Math.max(newStats.maxStreak, newStats.streak);
    newStats.totalProblemsCompleted++;
  } else {
    newStats.streak = 0;
  }
  
  // 경험치와 코인 추가
  const expGain = getExperienceReward(problem.difficulty, isCorrect, newStats.streak);
  const coinGain = getCoinReward(problem.difficulty, isCorrect, newStats.streak);
  
  newStats.experience += expGain;
  newStats.coins += coinGain;
  
  // 레벨업 확인
  const levelUpResult = checkLevelUp(newStats);
  if (levelUpResult.leveledUp) {
    newStats.level = levelUpResult.newLevel;
    newStats.experience -= getExperienceRequired(newStats.level);
  }
  
  // 다음 레벨까지 필요한 경험치 업데이트
  newStats.experienceToNext = getExperienceRequired(newStats.level + 1) - newStats.experience;
  
  return newStats;
}

// 게임 통계 업데이트
export function updateGameStats(
  stats: GameStats, 
  problem: Problem, 
  isCorrect: boolean, 
  timeSpent: number
): GameStats {
  const newStats = { ...stats };
  
  newStats.totalAnswers++;
  
  if (isCorrect) {
    newStats.correctAnswers++;
    newStats.currentStreak++;
    newStats.maxStreak = Math.max(newStats.maxStreak, newStats.currentStreak);
    
    // 보상 추가
    newStats.coinsEarned += getCoinReward(problem.difficulty, isCorrect, newStats.currentStreak);
    newStats.experienceGained += getExperienceReward(problem.difficulty, isCorrect, newStats.currentStreak);
  } else {
    newStats.currentStreak = 0;
  }
  
  return newStats;
}

// 정확도 계산
export function getAccuracy(stats: GameStats): number {
  if (stats.totalAnswers === 0) return 0;
  return (stats.correctAnswers / stats.totalAnswers) * 100;
}

// 플레이어 등급 계산
export function getPlayerRank(level: number): string {
  if (level >= 40) return '분수 마법사 🧙‍♂️';
  if (level >= 30) return '분수 전문가 🎓';
  if (level >= 20) return '분수 달인 ⭐';
  if (level >= 15) return '분수 고수 🏆';
  if (level >= 10) return '분수 학자 📚';
  if (level >= 5) return '분수 학습자 🌱';
  return '분수 초보자 🐣';
}

// 권장 난이도 계산
export function getRecommendedDifficulty(player: Player, accuracy: number): 1 | 2 | 3 | 4 | 5 {
  // 레벨과 정확도를 기반으로 난이도 추천
  let baseDifficulty = Math.min(Math.floor(player.level / 5) + 1, 5);
  
  // 정확도가 높으면 난이도 증가
  if (accuracy >= 90) {
    baseDifficulty = Math.min(baseDifficulty + 1, 5);
  } else if (accuracy < 60) {
    baseDifficulty = Math.max(baseDifficulty - 1, 1);
  }
  
  return baseDifficulty as 1 | 2 | 3 | 4 | 5;
}

// 성취 시스템
export interface Achievement {
  id: string;
  name: string;
  description: string;
  requirement: (player: Player, stats: GameStats) => boolean;
  reward: { coins: number; experience: number };
  unlocked: boolean;
}

export const achievements: Achievement[] = [
  {
    id: 'first_correct',
    name: '첫 걸음',
    description: '첫 번째 문제를 맞혔어요!',
    requirement: (player) => player.totalProblemsCompleted >= 1,
    reward: { coins: 10, experience: 50 },
    unlocked: false
  },
  {
    id: 'streak_5',
    name: '연속 5개',
    description: '5개 문제를 연속으로 맞혔어요!',
    requirement: (player) => player.maxStreak >= 5,
    reward: { coins: 25, experience: 100 },
    unlocked: false
  },
  {
    id: 'streak_10',
    name: '완벽한 집중',
    description: '10개 문제를 연속으로 맞혔어요!',
    requirement: (player) => player.maxStreak >= 10,
    reward: { coins: 50, experience: 200 },
    unlocked: false
  },
  {
    id: 'level_5',
    name: '분수 학습자',
    description: '5레벨에 도달했어요!',
    requirement: (player) => player.level >= 5,
    reward: { coins: 30, experience: 0 },
    unlocked: false
  },
  {
    id: 'level_10',
    name: '분수 학자',
    description: '10레벨에 도달했어요!',
    requirement: (player) => player.level >= 10,
    reward: { coins: 75, experience: 0 },
    unlocked: false
  },
  {
    id: 'problems_100',
    name: '백문백답',
    description: '100개의 문제를 완료했어요!',
    requirement: (player) => player.totalProblemsCompleted >= 100,
    reward: { coins: 100, experience: 500 },
    unlocked: false
  },
  {
    id: 'coins_500',
    name: '부자가 되었다',
    description: '500코인을 모았어요!',
    requirement: (player) => player.coins >= 500,
    reward: { coins: 100, experience: 200 },
    unlocked: false
  }
];

// 달성한 성취 확인
export function checkAchievements(player: Player, stats: GameStats, currentAchievements: Achievement[]): Achievement[] {
  const newAchievements: Achievement[] = [];
  
  for (const achievement of currentAchievements) {
    if (!achievement.unlocked && achievement.requirement(player, stats)) {
      achievement.unlocked = true;
      newAchievements.push(achievement);
    }
  }
  
  return newAchievements;
}

// 기본 플레이어 데이터 생성
export function createDefaultPlayer(name: string = '플레이어'): Player {
  return {
    name,
    level: 1,
    experience: 0,
    experienceToNext: getExperienceRequired(2),
    coins: 50, // 시작 코인
    totalProblemsCompleted: 0,
    streak: 0,
    maxStreak: 0
  };
}

// 기본 게임 통계 생성
export function createDefaultGameStats(): GameStats {
  return {
    correctAnswers: 0,
    totalAnswers: 0,
    currentStreak: 0,
    maxStreak: 0,
    coinsEarned: 0,
    experienceGained: 0
  };
}