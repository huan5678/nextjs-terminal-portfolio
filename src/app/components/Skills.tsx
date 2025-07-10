import React, { useState, useCallback } from 'react';
import TypingAnimation from './TypingAnimation';

type SkillCategory = {
  category: string;
  skills: string[];
};

const skillsData: SkillCategory[] = [
  {
    category: '語言與框架',
    skills: [
      'Go (主力學習與開發語言)',
      'Python (FastAPI、工具整合)',
      'JavaScript / TypeScript',
      'Node.js',
      'Express',
      'React',
      'Next.js',
      'Tailwind CSS v4 (CLI 模式)',
    ],
  },
  {
    category: '資料庫與後端系統',
    skills: [
      'PostgreSQL / Supabase',
      'RESTful API 設計與 WebSocket 整合',
      'Payload CMS',
      'Strapi CMS',
      'Secure Boot / UEFI 模式驅動安裝維護 (NVIDIA 驅動經驗)',
    ],
  },
  {
    category: 'DevOps & 部署',
    skills: [
      'Docker / GitHub Actions / CLI 自動化部署',
      'Cloudflare Workers',
      'Pages',
      'DNS 管理',
      'Linux 系統環境操作與伺服器維運',
    ],
  },
  {
    category: 'AI 與創意應用',
    skills: [
      'Midjourney / AI 藝術風格提示詞設計',
      'ChatGPT / OpenAI API 工程',
      'AI 圖像轉換',
      '語音文字應用 (如 FastAPI + Whisper)',
    ],
  },
];

const Skills: React.FC = () =>
{
  const [visibleCategories, setVisibleCategories] = useState(0);
  const [visibleSkills, setVisibleSkills] = useState(-1);

  const handleCategoryComplete = useCallback(() => {
    setVisibleSkills(0);
  }, []);

  const handleSkillComplete = useCallback(() => {
    setVisibleSkills(prev => prev + 1);
  }, []);

  const handleLastSkillComplete = useCallback(() => {
    setVisibleCategories(prev => prev + 1);
    setVisibleSkills(-1);
  }, []);

  return (
    <div className="w-full font-mono text-sm">
      {skillsData.map((item, index) => (
        index <= visibleCategories && (
          <div key={index} className="mb-4">
            <TypingAnimation
              text={`# ${item.category}`}
              className="text-green-400 text-base font-mono text-left"
              onComplete={index === visibleCategories ? handleCategoryComplete : undefined}
            />
            {(index < visibleCategories || (visibleSkills >= 0 && index === visibleCategories)) && (
              <ul className="mt-1 ml-2">
                {item.skills.map((skill, skillIndex) => (
                  (index < visibleCategories || visibleSkills >= skillIndex) && (
                    <li key={skillIndex} className="flex items-start">
                      <span className="text-gray-500 mr-2">-</span>
                      <TypingAnimation
                        text={skill}
                        className="text-gray-300 text-base font-mono text-left"
                        onComplete={index === visibleCategories && visibleSkills === skillIndex ? (skillIndex === item.skills.length - 1 ? handleLastSkillComplete : handleSkillComplete) : undefined}
                      />
                    </li>
                  )
                ))}
              </ul>
            )}
          </div>
        )
      ))}
    </div>
  );
};

export default Skills;
