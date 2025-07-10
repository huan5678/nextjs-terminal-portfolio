'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface TypingAnimationProps {
  text: string;
  duration?: number;
  className?: string;
  onComplete?: () => void;
}

export default function TypingAnimation({ text, duration = 10, className, onComplete }: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState<string>("");
  const [i, setI] = useState<number>(0);

  useEffect(() => {
    const typingEffect = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prevState) => prevState + text.charAt(i));
        setI(i + 1);
      } else {
        clearInterval(typingEffect);
        if (onComplete) {
          onComplete();
        }
      }
    }, duration);

    return () => {
      clearInterval(typingEffect);
    };
  }, [duration, i, text, onComplete]);

  return (
    <div className={cn("", className)}>
      {displayedText}
    </div>
  );
}
