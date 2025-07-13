export interface CountryScore {
  country_code: string;
  total_score: string; // BigInt serialized as string
  updated_at?: string;
}

export interface ScoreSubmissionResult {
  success: boolean;
  previousScore: string;
  newScore: string;
  scoreGained: number;
  previousRank?: number;
  newRank: number;
  rankChange: 'up' | 'down' | 'same';
  leaderboard: CountryScore[];
}

export interface UserLocation {
  country: string;
}
