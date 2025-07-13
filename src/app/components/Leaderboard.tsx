'use client';
import React, { useState, useEffect } from 'react';
import { getLeaderboard, formatScore, getCountryName, getCountryFlag } from '@/utils/scoreApi';
import { CountryScore } from '@/types/score';

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<CountryScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await getLeaderboard();
        setLeaderboard(data);
      } catch (err) {
        setError('無法載入排行榜');
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="theme-text p-4">
        <div className="text-center">
          <div className="animate-pulse">📊 載入世界排行榜中...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="theme-text p-4">
        <div className="text-center theme-error">
          ❌ {error}
        </div>
      </div>
    );
  }

  return (
    <div className="theme-text p-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold theme-primary mb-2">🏆 PixelSmash 世界排行榜</h2>
        <p className="theme-text-secondary text-sm">各國玩家累積分數排名</p>
      </div>

      {leaderboard.length === 0 ? (
        <div className="text-center theme-text-secondary">
          目前還沒有任何分數記錄
        </div>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((country, index) => (
            <div
              key={country.country_code}
              className={`flex justify-between items-center p-3 rounded border theme-border ${
                index < 3 ? 'theme-surface' : 'theme-background'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`w-12 text-center font-bold text-lg ${
                  index === 0 ? 'theme-warning' :
                  index === 1 ? 'theme-text-secondary' :
                  index === 2 ? 'theme-accent' : 'theme-text'
                }`}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                </span>
                <span className="text-2xl">
                  {getCountryFlag(country.country_code)}
                </span>
                <div>
                  <div className="font-semibold theme-text">
                    {getCountryName(country.country_code)}
                  </div>
                  <div className="text-xs theme-text-secondary">
                    {country.country_code}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold theme-accent text-lg">
                  {formatScore(country.total_score)}
                </div>
                <div className="text-xs theme-text-secondary">
                  累積分數
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 text-center theme-text-secondary text-sm">
        <p>💡 提示：玩 PixelSmash 遊戲為你的國家爭取更高排名！</p>
        <p className="mt-1">輸入 <span className="theme-accent">game</span> 開始遊戲</p>
      </div>
    </div>
  );
};

export default Leaderboard;
