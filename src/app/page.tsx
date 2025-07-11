'use client';
import dynamic from 'next/dynamic';
import AsciiHero from '@/app/components/AsciiHero';
import ProgressBar from '@/app/components/ProgressBar';
import { useState } from 'react';

const Terminal = dynamic(() => import('@/app/components/Terminal'), { ssr: false });

export default function Home() {
  const [chatMode, setChatMode] = useState(false);

  return (
    <main className="p-4">
      <AsciiHero />
      <ProgressBar />
      <Terminal 
        isChatMode={chatMode} 
        onExitChat={() => setChatMode(false)} 
        onEnterChat={() => setChatMode(true)}
      />
    </main>
  );
}
