import React, { useState, useCallback } from 'react';
import TypingAnimation from './TypingAnimation';

const About: React.FC = () => {
  const [visibleLines, setVisibleLines] = useState(0);

  const lines = [
    "您好，我是 士桓（ShrHuan Huang），一位專注於 後端系統開發 與 全端架構整合 的工程師，擁有 Python、JavaScript/TypeScript 與 Node.js 等多語言經驗，擅長建構 API 系統、資料庫管理流程與雲端部署架構。",
    "我對開發流程與工具鏈優化充滿熱情，擅長在 CLI、Docker、Cloudflare Workers 等平台上進行快速原型開發與部署。",
    "我也熱衷於 AI 與創意設計的結合，擅長 Midjourney 與 AI Prompt 工程，並曾多次進行語音辨識、影像風格轉換與創意生成應用。"
  ];

  const handleComplete = useCallback(() => {
    setVisibleLines(prev => prev + 1);
  }, []);

  return (
    <div className="flex flex-col space-y-2 font-mono text-neutral-300">
      {lines.map((line, index) => (
        index <= visibleLines && (
          <TypingAnimation
            key={index}
            className="text-base font-normal font-mono text-neutral-300 text-left"
            text={line}
            onComplete={index === visibleLines ? handleComplete : undefined}
          />
        )
      ))}
    </div>
  );
};

export default About;
