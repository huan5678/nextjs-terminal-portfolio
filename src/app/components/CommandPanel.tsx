'use client';

import React, { useState, useEffect, useCallback } from 'react';

const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

const KeyButton = ({ label, active }) => (
        <div className={`w-12 h-12 flex items-center justify-center border-2 theme-border theme-text font-bold text-xl
      ${active ? 'theme-primary theme-background' : 'theme-background'}
        transition-colors duration-100 ease-in-out
    `}>
        {label}
    </div>
);

export default function CommandPanel({ onKonamiCode, onClose }) {
    const [sequence, setSequence] = useState<string[]>([]);
    const [activeKey, setActiveKey] = useState<string | null>(null);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        const key = e.key;
        setActiveKey(key);

        const newSequence = [...sequence, key];

        if (newSequence.length > KONAMI_CODE.length) {
            newSequence.shift();
        }

        if (JSON.stringify(newSequence) === JSON.stringify(KONAMI_CODE)) {
            e.preventDefault(); // Prevent the default behavior of the last key (e.g., 'a')
            onKonamiCode();
            setSequence([]);
            setActiveKey(null);
        } else {
            setSequence(newSequence);
        }
    }, [sequence, onKonamiCode]);

    const handleKeyUp = useCallback(() => {
        setActiveKey(null);
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [handleKeyDown, handleKeyUp]);

    return (
              <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="theme-surface p-8 rounded-none shadow-lg border-2 theme-border text-lg">
                <h2 className="text-white text-2xl mb-6 text-center">Enter Command Sequence</h2>
                <div className="flex items-center space-x-4 mb-8">
                        <KeyButton label="←" active={activeKey === 'ArrowLeft'} />
                    <KeyButton label="↑" active={activeKey === 'ArrowUp'} />
                        <KeyButton label="↓" active={activeKey === 'ArrowDown'} />
                        <KeyButton label="→" active={activeKey === 'ArrowRight'} />
                        <KeyButton label="A" active={activeKey === 'a'} />
                        <KeyButton label="B" active={activeKey === 'b'} />
                </div>
                <button
                    onClick={onClose}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-none border-2 border-red-700 font-bold"
                >
                    Close Panel
                </button>
            </div>
        </div>
    );
}
