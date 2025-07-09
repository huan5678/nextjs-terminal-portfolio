'use client';
import dynamic from 'next/dynamic';

const Terminal = dynamic(() => import('@/app/components/Terminal'), { ssr: false });

export default function Home() {
  return (
    <main className="p-4">
      <Terminal />
    </main>
  );
}
