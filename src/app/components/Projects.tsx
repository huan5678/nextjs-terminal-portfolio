import React, { useState, useCallback } from 'react';
import TypingAnimation from './TypingAnimation';

type Project = {
  title: string;
  description: string;
  tech: string[];
  status: string;
};

const projectData: Project[] = [
  {
    title: 'AI 語音應用 PoC 平台',
    description: '基於 FastAPI + Uvicorn 建構 HTTPS 語音辨識服務，結合 OpenAI 模型進行語音轉文字與語意回應，部署支援虛擬環境與 SSL 加密。',
    tech: [ 'Python', 'FastAPI', 'Uvicorn', 'SSL 憑證', 'Linux' ],
    status: '私有部署中',
  },
  {
    title: '個人終端機風格網站',
    description: '使用 React + Tailwind CLI 建立像素風終端機主題個人網頁，整合 ASCII Logo 與 monospace 字體，支援 Hero Section CLI 輸入效果。',
    tech: [ 'React', 'Next.js', 'Tailwind v4', 'oh-my-logo', '像素字體' ],
    status: '前端架構建構中（尚未部署）',
  },
  {
    title: 'Cloudflare Workers 靜態部署自動化流程',
    description: '以 Wrangler 自動部署工具整合 DNS 管理與靜態網站發佈，實作 Workers 中介轉址與 CDN 加速。',
    tech: [ 'Cloudflare Workers', 'Wrangler CLI', 'HTML/JS', 'DNS 操作' ],
    status: '部署完成，私有應用中',
  },
];

const Projects: React.FC = () =>
{
  const [visibleProjects, setVisibleProjects] = useState(0);
  const [visibleDetails, setVisibleDetails] = useState(-1);

  const handleTitleComplete = useCallback(() => {
    setVisibleDetails(0);
  }, []);

  const handleDetailComplete = useCallback(() => {
    setVisibleDetails(prev => prev + 1);
  }, []);

  const handleStatusComplete = useCallback(() => {
    setVisibleProjects(prev => prev + 1);
    setVisibleDetails(-1);
  }, []);

  return (
    <div className="flex flex-col gap-y-6">
      {projectData.map((project, index) => (
        index <= visibleProjects && (
          <div key={index} className="flex flex-col gap-y-1 text-sm font-mono">
            <div className="flex items-center gap-x-2">
              <TypingAnimation
                text={project.title}
                className="theme-accent font-bold text-base font-mono text-left"
                onComplete={index === visibleProjects ? handleTitleComplete : undefined}
              />
            </div>
            {(index < visibleProjects || (visibleDetails >= 0 && index === visibleProjects)) && (
              <div className="pl-4 border-l-2 border-neutral-700 flex flex-col gap-y-1 mt-1">
                {(index < visibleProjects || visibleDetails >= 0) && (
                  <div>
                    <span className="theme-warning w-20 inline-block shrink-0">描述:</span>
                    <TypingAnimation
                      text={project.description}
                      className="text-neutral-300 text-base font-mono text-left"
                      onComplete={index === visibleProjects && visibleDetails === 0 ? handleDetailComplete : undefined}
                    />
                  </div>
                )}
                {(index < visibleProjects || visibleDetails >= 1) && (
                  <div>
                    <span className="theme-warning w-20 inline-block shrink-0">技術:</span>
                    <TypingAnimation
                      text={project.tech.join(', ')}
                      className="text-neutral-300 text-base font-mono text-left"
                      onComplete={index === visibleProjects && visibleDetails === 1 ? handleDetailComplete : undefined}
                    />
                  </div>
                )}
                {(index < visibleProjects || visibleDetails >= 2) && (
                  <div>
                    <span className="theme-warning w-20 inline-block shrink-0">狀態:</span>
                    <TypingAnimation
                      text={project.status}
                      className="text-pink-400 text-base font-mono text-left"
                      onComplete={index === visibleProjects && visibleDetails === 2 ? handleStatusComplete : undefined}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )
      ))}
    </div>
  );
};

export default Projects;
