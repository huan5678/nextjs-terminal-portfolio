import { CountryScore, ScoreSubmissionResult, UserLocation } from '@/types/score';

/**
 * 獲取用戶位置信息
 */
export async function getUserLocation(): Promise<UserLocation> {
  try {
    const response = await fetch('/api/location');
    if (!response.ok) {
      throw new Error('Failed to get location');
    }
    return await response.json();
  } catch (error) {
    console.error('Error getting user location:', error);
    return { country: 'DEV' };
  }
}

/**
 * 獲取當前排行榜
 */
export async function getLeaderboard(): Promise<CountryScore[]> {
  try {
    const response = await fetch('/api/scores');
    if (!response.ok) {
      throw new Error('Failed to get leaderboard');
    }
    return await response.json();
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return [];
  }
}

/**
 * 提交分數並獲取更新後的排名信息
 */
export async function submitScore(score: number): Promise<ScoreSubmissionResult> {
  try {
    // 先獲取當前排行榜以計算排名變化
    const previousLeaderboard = await getLeaderboard();
    const userLocation = await getUserLocation();

    // 找到用戶國家的當前排名和分數
    const userCountryIndex = previousLeaderboard.findIndex(
      country => country.country_code === userLocation.country
    );
    const previousScore = userCountryIndex >= 0 ? previousLeaderboard[userCountryIndex].total_score : '0';
    const previousRank = userCountryIndex >= 0 ? userCountryIndex + 1 : undefined;

    // 提交分數
    const response = await fetch('/api/scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ score }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit score');
    }

    const newLeaderboard: CountryScore[] = await response.json();

    // 計算新排名
    const newUserCountryIndex = newLeaderboard.findIndex(
      country => country.country_code === userLocation.country
    );
    const newScore = newUserCountryIndex >= 0 ? newLeaderboard[newUserCountryIndex].total_score : '0';
    const newRank = newUserCountryIndex + 1;

    // 計算排名變化
    let rankChange: 'up' | 'down' | 'same' = 'same';
    if (previousRank && newRank < previousRank) {
      rankChange = 'up';
    } else if (previousRank && newRank > previousRank) {
      rankChange = 'down';
    }

    return {
      success: true,
      previousScore,
      newScore,
      scoreGained: score,
      previousRank,
      newRank,
      rankChange,
      leaderboard: newLeaderboard,
    };
  } catch (error) {
    console.error('Error submitting score:', error);
    throw error;
  }
}

/**
 * 格式化分數顯示
 */
export function formatScore(score: string | number): string {
  const numScore = typeof score === 'string' ? parseInt(score) : score;
  return numScore.toLocaleString();
}

/**
 * 獲取國旗 emoji
 */
export function getCountryFlag(countryCode: string): string {
  const flags: { [key: string]: string } = {
    'US': '🇺🇸',
    'CN': '🇨🇳',
    'JP': '🇯🇵',
    'KR': '🇰🇷',
    'TW': '🇹🇼',
    'HK': '🇭🇰',
    'SG': '🇸🇬',
    'GB': '🇬🇧',
    'DE': '🇩🇪',
    'FR': '🇫🇷',
    'CA': '🇨🇦',
    'AU': '🇦🇺',
    'IN': '🇮🇳',
    'BR': '🇧🇷',
    'MX': '🇲🇽',
    'DEV': '🏴‍☠️',
  };

  return flags[countryCode] || '🏳️';
}

/**
 * 獲取國家名稱
 */
export function getCountryName(countryCode: string): string {
  const countryNames: { [key: string]: string } = {
    'US': '美國',
    'CN': '中國',
    'JP': '日本',
    'KR': '韓國',
    'TW': '台灣',
    'HK': '香港',
    'SG': '新加坡',
    'GB': '英國',
    'DE': '德國',
    'FR': '法國',
    'CA': '加拿大',
    'AU': '澳洲',
    'IN': '印度',
    'BR': '巴西',
    'MX': '墨西哥',
    'DEV': '開發環境',
  };

  return countryNames[countryCode] || countryCode;
}

/**
 * 獲取排名變化圖標
 */
export function getRankChangeIcon(rankChange: 'up' | 'down' | 'same'): string {
  switch (rankChange) {
    case 'up': return '⬆️';
    case 'down': return '⬇️';
    case 'same': return '➡️';
  }
}
