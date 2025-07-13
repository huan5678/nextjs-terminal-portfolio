'use client';
import React, { useEffect } from 'react';

interface RetroModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const RetroModal: React.FC<RetroModalProps> = ({ isOpen, onClose, title = "PIXEL_SMASH.EXE", children }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // 防止背景滾動
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 theme-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal 內容 */}
              <div className="relative theme-background border-2 theme-border theme-glow max-w-6xl max-h-[95vh] overflow-hidden font-mono">
          {/* 標題欄 */}
          <div className="theme-primary theme-background px-4 py-2 flex justify-between items-center text-sm font-bold">
          <div className="flex items-center gap-2">
            <span>█</span>
            <span>{title}</span>
          </div>
          <button
            onClick={onClose}
            className="hover:opacity-80 px-2 py-1 transition-colors rounded"
            title="關閉 (ESC)"
          >
            ✕
          </button>
        </div>

                  {/* 邊框裝飾 */}
          <div className="border-b theme-border/20 theme-background">
            <div className="theme-text-secondary font-mono text-xs px-4 py-1">
            {'═'.repeat(80)}
          </div>
        </div>

                  {/* 內容區域 */}
          <div className="relative theme-background theme-text min-h-[400px]">
          {children}
        </div>

                  {/* 底部邊框 */}
          <div className="border-t theme-border/20 theme-background">
            <div className="theme-text-secondary font-mono text-xs px-4 py-1">
            {'═'.repeat(80)}
          </div>
        </div>

                  {/* 狀態欄 */}
          <div className="theme-primary theme-background px-4 py-1 flex justify-between items-center text-xs">
          <span>STATUS: RUNNING</span>
          <span>ESC: 退出遊戲 | ENTER: 開始</span>
        </div>
      </div>
    </div>
  );
};

export default RetroModal;
