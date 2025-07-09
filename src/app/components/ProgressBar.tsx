'use client';
import { useState, useEffect } from 'react';

export default function ProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0; // 重新開始
        }
        return prev + 2; // 每次增加2%，讓動畫更流暢
      });
    }, 80); // 每80ms增加2%，總共4秒完成一個循環

    return () => clearInterval(interval);
  }, []);

  const generateProgressBar = (percentage: number) => {
    const barLength = 40; // 進度條總長度
    const filledLength = Math.floor((percentage / 100) * barLength);
    const emptyLength = barLength - filledLength;
    
    const filled = '█'.repeat(filledLength);
    const empty = '░'.repeat(emptyLength);
    
    return `[${filled}${empty}] ${percentage.toString().padStart(3, ' ')}%`;
  };

  return (
    <div className="py-3 font-mono text-green-400 border-b border-green-600/30 mb-4">
      <div className="text-xs opacity-80 mb-2">⚡ System Initializing...</div>
      <pre className="text-sm tracking-wider">{generateProgressBar(progress)}</pre>
    </div>
  );
}