import { Player, GameStats, PowerUp, Achievement } from '../types/game';
import { createDefaultPlayer, createDefaultGameStats, achievements } from './gameLogic';
import { getInitialOwnedItems, getInitialPowerUps } from './shopSystem';

// 로컬 스토리지 키 상수
const STORAGE_KEYS = {
  PLAYER: 'fraction-game-player',
  GAME_STATS: 'fraction-game-stats',
  OWNED_ITEMS: 'fraction-game-owned-items',
  POWER_UPS: 'fraction-game-power-ups',
  ACHIEVEMENTS: 'fraction-game-achievements',
  SETTINGS: 'fraction-game-settings',
  CURRENT_THEME: 'fraction-game-theme'
};

// 게임 설정 인터페이스
export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  difficulty: 1 | 2 | 3 | 4 | 5;
  autoAdvance: boolean;
  showHints: boolean;
  timeLimit: number; // seconds
}

// 기본 설정
const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  musicEnabled: true,
  difficulty: 1,
  autoAdvance: false,
  showHints: true,
  timeLimit: 60
};

// 안전한 JSON 파싱
function safeJsonParse<T>(json: string | null, defaultValue: T): T {
  if (!json) return defaultValue;
  
  try {
    const parsed = JSON.parse(json);
    return parsed !== null ? parsed : defaultValue;
  } catch (error) {
    console.warn('Failed to parse JSON from localStorage:', error);
    return defaultValue;
  }
}

// 안전한 로컬 스토리지 저장
function safeSetItem(key: string, value: any): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    return false;
  }
}

// 플레이어 데이터 관리
export const playerStorage = {
  load(): Player {
    const data = localStorage.getItem(STORAGE_KEYS.PLAYER);
    return safeJsonParse(data, createDefaultPlayer());
  },
  
  save(player: Player): boolean {
    return safeSetItem(STORAGE_KEYS.PLAYER, player);
  },
  
  reset(): void {
    localStorage.removeItem(STORAGE_KEYS.PLAYER);
  }
};

// 게임 통계 관리
export const gameStatsStorage = {
  load(): GameStats {
    const data = localStorage.getItem(STORAGE_KEYS.GAME_STATS);
    return safeJsonParse(data, createDefaultGameStats());
  },
  
  save(stats: GameStats): boolean {
    return safeSetItem(STORAGE_KEYS.GAME_STATS, stats);
  },
  
  reset(): void {
    localStorage.removeItem(STORAGE_KEYS.GAME_STATS);
  }
};

// 소유 아이템 관리
export const ownedItemsStorage = {
  load(): string[] {
    const data = localStorage.getItem(STORAGE_KEYS.OWNED_ITEMS);
    return safeJsonParse(data, getInitialOwnedItems());
  },
  
  save(ownedItems: string[]): boolean {
    return safeSetItem(STORAGE_KEYS.OWNED_ITEMS, ownedItems);
  },
  
  reset(): void {
    localStorage.removeItem(STORAGE_KEYS.OWNED_ITEMS);
  }
};

// 파워업 관리
export const powerUpsStorage = {
  load(): PowerUp[] {
    const data = localStorage.getItem(STORAGE_KEYS.POWER_UPS);
    return safeJsonParse(data, getInitialPowerUps());
  },
  
  save(powerUps: PowerUp[]): boolean {
    return safeSetItem(STORAGE_KEYS.POWER_UPS, powerUps);
  },
  
  reset(): void {
    localStorage.removeItem(STORAGE_KEYS.POWER_UPS);
  }
};

// 성취 관리
export const achievementsStorage = {
  load(): Achievement[] {
    const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    const saved = safeJsonParse(data, []);
    
    // 새로운 성취가 추가되었을 수 있으므로 기본 성취 목록과 병합
    const merged = [...achievements];
    
    saved.forEach((savedAchievement: Achievement) => {
      const index = merged.findIndex(a => a.id === savedAchievement.id);
      if (index !== -1) {
        merged[index] = savedAchievement;
      }
    });
    
    return merged;
  },
  
  save(achievements: Achievement[]): boolean {
    return safeSetItem(STORAGE_KEYS.ACHIEVEMENTS, achievements);
  },
  
  reset(): void {
    localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
  }
};

// 게임 설정 관리
export const settingsStorage = {
  load(): GameSettings {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return safeJsonParse(data, DEFAULT_SETTINGS);
  },
  
  save(settings: GameSettings): boolean {
    return safeSetItem(STORAGE_KEYS.SETTINGS, settings);
  },
  
  reset(): void {
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  }
};

// 현재 테마 관리
export const themeStorage = {
  load(): string {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_THEME) || 'default';
  },
  
  save(theme: string): boolean {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_THEME, theme);
      return true;
    } catch (error) {
      console.error('Failed to save theme:', error);
      return false;
    }
  },
  
  reset(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_THEME);
  }
};

// 전체 게임 데이터 관리
export const gameDataStorage = {
  // 모든 게임 데이터 로드
  loadAll() {
    return {
      player: playerStorage.load(),
      stats: gameStatsStorage.load(),
      ownedItems: ownedItemsStorage.load(),
      powerUps: powerUpsStorage.load(),
      achievements: achievementsStorage.load(),
      settings: settingsStorage.load(),
      currentTheme: themeStorage.load()
    };
  },
  
  // 모든 게임 데이터 저장
  saveAll(data: {
    player: Player;
    stats: GameStats;
    ownedItems: string[];
    powerUps: PowerUp[];
    achievements: Achievement[];
    settings: GameSettings;
    currentTheme: string;
  }): boolean {
    try {
      const results = [
        playerStorage.save(data.player),
        gameStatsStorage.save(data.stats),
        ownedItemsStorage.save(data.ownedItems),
        powerUpsStorage.save(data.powerUps),
        achievementsStorage.save(data.achievements),
        settingsStorage.save(data.settings),
        themeStorage.save(data.currentTheme)
      ];
      
      return results.every(result => result === true);
    } catch (error) {
      console.error('Failed to save all game data:', error);
      return false;
    }
  },
  
  // 게임 데이터 초기화
  resetAll(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },
  
  // 게임 데이터 내보내기 (백업)
  export(): string {
    const data = this.loadAll();
    return JSON.stringify(data, null, 2);
  },
  
  // 게임 데이터 가져오기 (복원)
  import(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      
      // 데이터 유효성 검사
      if (!data.player || !data.stats) {
        throw new Error('Invalid game data format');
      }
      
      return this.saveAll({
        player: data.player || createDefaultPlayer(),
        stats: data.stats || createDefaultGameStats(),
        ownedItems: data.ownedItems || getInitialOwnedItems(),
        powerUps: data.powerUps || getInitialPowerUps(),
        achievements: data.achievements || achievements,
        settings: data.settings || DEFAULT_SETTINGS,
        currentTheme: data.currentTheme || 'default'
      });
    } catch (error) {
      console.error('Failed to import game data:', error);
      return false;
    }
  }
};

// 자동 저장 기능
export class AutoSave {
  private intervalId: number | null = null;
  private saveCallback: () => void;
  
  constructor(saveCallback: () => void, interval: number = 30000) { // 30초마다 자동 저장
    this.saveCallback = saveCallback;
    this.start(interval);
  }
  
  start(interval: number): void {
    this.stop(); // 기존 인터벌 정리
    this.intervalId = window.setInterval(() => {
      try {
        this.saveCallback();
        console.log('Auto-saved game data');
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, interval);
  }
  
  stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  
  saveNow(): void {
    try {
      this.saveCallback();
      console.log('Manual save completed');
    } catch (error) {
      console.error('Manual save failed:', error);
    }
  }
}

// 로컬 스토리지 용량 확인
export function getStorageUsage(): { used: number; total: number; percentage: number } {
  let used = 0;
  
  try {
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage.getItem(key)?.length || 0;
      }
    }
  } catch (error) {
    console.error('Failed to calculate storage usage:', error);
  }
  
  const total = 5 * 1024 * 1024; // 5MB (일반적인 localStorage 한계)
  const percentage = (used / total) * 100;
  
  return { used, total, percentage };
}

// 게임 데이터 마이그레이션 (버전 업그레이드 시 사용)
export function migrateGameData(version: string): boolean {
  try {
    // 향후 게임 업데이트 시 데이터 구조가 변경될 때 사용
    console.log(`Migrating game data to version ${version}`);
    
    // 현재는 마이그레이션이 필요하지 않음
    return true;
  } catch (error) {
    console.error('Data migration failed:', error);
    return false;
  }
}