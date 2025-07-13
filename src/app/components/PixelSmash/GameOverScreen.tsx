'use client';
import React, { useState, useEffect } from 'react';
import { submitScore, formatScore, getCountryName, getCountryFlag, getRankChangeIcon } from '@/utils/scoreApi';
import { ScoreSubmissionResult } from '@/types/score';

interface GameOverScreenProps {
  score: number;
  level: number;
  onRestart: () => void;
  onClose: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, level, onRestart, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<ScoreSubmissionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // 自動提交分數
  useEffect(() => {
    if (!hasSubmitted && score > 0) {
      handleSubmitScore();
    }
  }, [score, hasSubmitted]);

  const handleSubmitScore = async () => {
    if (isSubmitting || hasSubmitted) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await submitScore(score);
      setSubmissionResult(result);
      setHasSubmitted(true);
    } catch (err) {
      setError('分數提交失敗，請稍後再試');
      console.error('Score submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRankChangeText = (result: ScoreSubmissionResult) => {
    const { previousRank, newRank, rankChange } = result;

    if (!previousRank) {
      return `首次上榜！排名第 ${newRank} 名`;
    }

    const change = previousRank - newRank;
    if (change > 0) {
      return `上升 ${change} 名！從第 ${previousRank} 名升至第 ${newRank} 名`;
    } else if (change < 0) {
      return `下降 ${Math.abs(change)} 名，從第 ${previousRank} 名降至第 ${newRank} 名`;
    } else {
      return `維持第 ${newRank} 名`;
    }
  };

  return (
    <div className="theme-background theme-text p-6 min-h-[400px] flex flex-col">
      {/* 遊戲結束標題 */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold theme-error mb-2">🎮 遊戲結束</h1>
        <div className="theme-text-secondary">
          <p>關卡: {level}</p>
          <p className="text-2xl font-bold theme-warning">最終分數: {formatScore(score)}</p>
        </div>
      </div>

      {/* 分數提交狀態 */}
      <div className="flex-grow mb-6">
        {isSubmitting && (
          <div className="text-center theme-text-secondary">
            <div className="mb-2">📊 正在提交分數到世界排行榜...</div>
            <div className="animate-pulse">請稍候...</div>
          </div>
        )}

        {error && (
          <div className="text-center theme-error mb-4">
            <div className="mb-2">❌ {error}</div>
            <button
              onClick={handleSubmitScore}
              className="theme-primary hover:opacity-80 px-4 py-2 rounded border theme-border transition-colors"
            >
              重新提交
            </button>
          </div>
        )}

        {submissionResult && (
          <div className="space-y-6">
            {/* Space Invaders 風格的高分榜標題 */}
            <div className="text-center">
              <div className="theme-primary text-3xl font-bold mb-2 tracking-wider">
                ★ HIGH SCORES ★
              </div>
              <div className="theme-text-secondary text-sm">
                你的分數: {formatScore(submissionResult.previousScore)} (+{formatScore(submissionResult.scoreGained)}) = {formatScore(submissionResult.newScore)}
              </div>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="theme-text-secondary">排名變化:</span>
                <span>{getRankChangeIcon(submissionResult.rankChange)}</span>
                <span className={`font-bold ${
                  submissionResult.rankChange === 'up' ? 'theme-success' :
                  submissionResult.rankChange === 'down' ? 'theme-error' : 'theme-text'
                }`}>
                  {getRankChangeText(submissionResult)}
                </span>
              </div>
            </div>

            {/* Space Invaders 風格的排行榜 */}
            <div className="theme-surface p-6 rounded border theme-border">
              <div className="space-y-2 font-mono">
                {submissionResult.leaderboard.slice(0, 10).map((country, index) => {
                  const isCurrentPlayer = index + 1 === submissionResult.newRank;
                  const rank = index + 1;

                  // 計算排名變化箭頭（僅對當前玩家顯示）
                  let rankChangeArrow = '';
                  if (isCurrentPlayer) {
                    rankChangeArrow = getRankChangeIcon(submissionResult.rankChange);
                  }

                  // 獲取排名顏色
                  const getRankColor = () => {
                    if (isCurrentPlayer) return 'theme-warning'; // 當前玩家高亮
                    if (rank === 1) return 'theme-success'; // 第一名
                    if (rank === 2) return 'theme-accent'; // 第二名
                    if (rank === 3) return 'theme-error'; // 第三名
                    return 'theme-text'; // 其他
                  };

                  return (
                    <div
                      key={country.country_code}
                      className={`flex items-center justify-between py-1 px-2 ${
                        isCurrentPlayer ? 'theme-primary/20 rounded' : ''
                      }`}
                    >
                      {/* 左側: 排名 + 國旗 */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span className={`${getRankColor()} font-bold text-right w-8`}>
                          {rank.toString().padStart(2, '0')}.
                        </span>
                        <span className="text-2xl">
                          {getCountryFlag(country.country_code)}
                        </span>
                        <span className={`${getRankColor()} font-bold uppercase tracking-wider truncate`}>
                          {country.country_code}
                        </span>
                        {/* 排名變化箭頭 */}
                        {rankChangeArrow && (
                          <span className="text-lg">{rankChangeArrow}</span>
                        )}
                      </div>

                      {/* 右側: 分數 */}
                      <div className="flex flex-col items-end">
                        <span className={`${getRankColor()} font-bold text-lg tracking-wider`}>
                          {formatScore(country.total_score)}
                        </span>
                        {/* 如果是當前玩家，顯示分數構成 */}
                        {isCurrentPlayer && (
                          <span className="theme-text-secondary text-xs">
                            ({formatScore(submissionResult.previousScore)}+{formatScore(submissionResult.scoreGained)})
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 底部說明 */}
              <div className="mt-4 pt-3 border-t theme-border/30 text-center">
                <div className="theme-text-secondary text-sm">
                  🏆 世界排行榜 - 前10名國家 🏆
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 操作按鈕 */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={onRestart}
          className="theme-success hover:opacity-80 px-6 py-3 rounded border theme-border transition-colors font-bold"
        >
          🔄 再玩一次
        </button>
        <button
          onClick={onClose}
          className="theme-error hover:opacity-80 px-6 py-3 rounded border theme-border transition-colors font-bold"
        >
          🚪 退出遊戲
        </button>
      </div>
    </div>
  );
};

export default GameOverScreen;
