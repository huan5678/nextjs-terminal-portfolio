'use client';
import dynamic from 'next/dynamic';
import AsciiHero from '@/app/components/AsciiHero';
import ProgressBar from '@/app/components/ProgressBar';

const Terminal = dynamic(() => import('@/app/components/Terminal'), { ssr: false });

export default function Home() {
  return (
    <main className="p-4">
      <AsciiHero />
      <ProgressBar />
      <Terminal />
    </main>
  );
}
