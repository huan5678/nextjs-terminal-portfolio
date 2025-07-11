
'use client';
import React, { useState, useEffect } from 'react';

export default function ProgressBar({ isLoading = false }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      // Continuous animation for loading state
      const interval = setInterval(() => {
        setProgress(prev => (prev + 10) % 100); // Simple continuous loop
      }, 100);
      return () => clearInterval(interval);
    } else {
      // Reset or hide when not loading
      setProgress(0);
    }
  }, [isLoading]);

  if (!isLoading) return null; // Don't render if not loading

  const barLength = 20; // Total length of the ASCII progress bar
  const filledLength = Math.floor((progress / 100) * barLength);
  const emptyLength = barLength - filledLength;

  const filled = '█'.repeat(filledLength);
  const empty = '░'.repeat(emptyLength);

  return (
    <pre className="text-green-500 font-mono text-lg">
      {`[${filled}${empty}] ${progress}%`}
    </pre>
  );
}
