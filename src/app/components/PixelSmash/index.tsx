'use client';
import React, { useEffect, useRef, useCallback, useState } from 'react';
import p5 from 'p5';
import RetroModal from './RetroModal';
import GameOverScreen from './GameOverScreen';

// 導入所有模組
import type { GameState } from './types/GameTypes';
import { GAME_CONSTANTS } from './constants/GameConstants';
import { AudioSystem } from './utils/AudioSystem';
import { GameManager } from './engine/GameManager';

interface PixelSmashProps {
  onClose: () => void;
}

const PixelSmash: React.FC<PixelSmashProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<p5 | null>(null);
  const [showGameOverScreen, setShowGameOverScreen] = useState(false);
  const gameStateRef = useRef<GameState>({
    state: 'start',
    score: 0,
    lives: 3,
    level: 1,
    paddle: null,
    balls: [],
    bricks: [],
    powerUps: [],
    paused: false
  });

  const [, forceUpdate] = useState({});
  const forceUpdateComponent = useCallback(() => {
    forceUpdate({});
  }, []);

  const handleGameRestart = useCallback(() => {
    setShowGameOverScreen(false);
    gameStateRef.current.state = 'start';
    gameStateRef.current.score = 0;
    gameStateRef.current.lives = 3;
    gameStateRef.current.level = 1;
    gameStateRef.current.powerUps = [];
    gameStateRef.current.paused = false;
    gameStateRef.current.paddle = null;
    gameStateRef.current.balls = [];
    gameStateRef.current.bricks = [];
    forceUpdateComponent();
  }, [forceUpdateComponent]);

  const cleanup = useCallback(() => {
    console.log('Cleanup called');
    if (p5InstanceRef.current) {
      try {
        p5InstanceRef.current.noLoop();
        p5InstanceRef.current.remove();
        console.log('p5 instance removed');
      } catch (error) {
        console.error('Error during cleanup:', error);
      }
      p5InstanceRef.current = null;
    }

    if (canvasRef.current) {
      canvasRef.current.innerHTML = '';
    }
  }, []);

  useEffect(() => {
    cleanup();

    if (!canvasRef.current) return;

    console.log('Creating new p5 instance');

    const sketch = (p: p5) => {
      let setupComplete = false;
      let useWebFont = false;
      let gameManager: GameManager;

      // 載入字體
      const loadWebFont = async () => {
        try {
          const font = new FontFace('PixelFont', `url('/fonts/fusion-pixel-12px-monospaced-zh_hant.otf.woff2')`);
          await font.load();
          document.fonts.add(font);
          useWebFont = true;
          return true;
        } catch (error) {
          console.warn('Web font loading failed:', error);
          return false;
        }
      };

      const setupFont = () => {
        if (useWebFont) {
          p.textFont('PixelFont, "Courier New", monospace');
        } else {
          p.textFont('"Courier New", "Monaco", "Menlo", monospace');
        }
        p.noSmooth();
      };

      p.setup = async function () {
        console.log('p5 setup started');

        const canvas = p.createCanvas(GAME_CONSTANTS.CANVAS_WIDTH, GAME_CONSTANTS.CANVAS_HEIGHT);
        if (canvasRef.current) {
          canvasRef.current.innerHTML = '';
          canvas.parent(canvasRef.current);
        }

        p.noStroke();
        p.noSmooth();

        await loadWebFont();

        // 初始化遊戲管理器
        gameManager = new GameManager(gameStateRef, forceUpdateComponent, p, () => {
          setShowGameOverScreen(true);
        });

        gameStateRef.current.state = 'start';
        setupComplete = true;
        forceUpdateComponent();

        console.log('p5 setup completed, state:', gameStateRef.current.state);
      };

      p.draw = function () {
        const gameState = gameStateRef.current;

        p.background(0);

        if (!setupComplete) {
          p.fill(255);
          p.textAlign(p.CENTER, p.CENTER);
          p.textSize(20);
          p.text('載入中...', p.width / 2, p.height / 2);
          return;
        }

        setupFont();

        switch (gameState.state) {
          case 'start':
            p.fill(255);
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(32);
            p.text('PIXEL_SMASH.EXE', p.width / 2, p.height / 2 - 40);

            p.textSize(18);
            p.fill(0, 255, 0);
            p.text('按下 ENTER 開始遊戲', p.width / 2, p.height / 2 + 20);

            p.textSize(12);
            p.fill(100, 255, 100);
            p.text(useWebFont ? '✓ 使用 Web 字體' : '⚠ 使用系統字體', p.width / 2, p.height / 2 + 50);
            break;

          case 'playing':
            if (!gameState.paddle) {
              if (gameManager && typeof gameManager.initializeGame === 'function') {
                gameManager.initializeGame();
              } else {
                console.warn('gameManager 或 initializeGame 尚未正確初始化');
              }
            }

            // Draw paddle
            if (gameState.paddle) {
              p.fill(0, 255, 255);
              p.rect(gameState.paddle.x, gameState.paddle.y, gameState.paddle.w, gameState.paddle.h);

              // 速度指示器
              if (Math.abs(gameState.paddle.velocity) > 0.5) {
                p.fill(255, 255, 0, 100);
                const indicatorWidth = Math.abs(gameState.paddle.velocity) * 5;
                const indicatorX = gameState.paddle.velocity > 0 ?
                  gameState.paddle.x + gameState.paddle.w :
                  gameState.paddle.x - indicatorWidth;
                p.rect(indicatorX, gameState.paddle.y - 3, indicatorWidth, 2);
              }
            }

            // Draw balls
            gameState.balls.forEach(ball => {
              p.fill(255);
              p.rect(ball.x, ball.y, ball.r, ball.r);
            });

            // Draw bricks
            gameState.bricks.forEach(brick => {
              p.fill(brick.color[0], brick.color[1], brick.color[2]);
              p.rect(brick.x, brick.y, brick.w, brick.h);
            });

            // Draw power-ups
            gameState.powerUps.forEach(pu => {
              p.fill(pu.color[0], pu.color[1], pu.color[2]);
              p.textSize(20);
              p.textAlign(p.CENTER, p.CENTER);
              p.text(pu.char, pu.x, pu.y);
            });

            if (gameState.paused) {
              p.fill(0, 0, 0, 150);
              p.rect(0, 0, p.width, p.height);
              p.fill(255);
              p.textAlign(p.CENTER, p.CENTER);
              p.textSize(36);
              p.text('遊戲暫停', p.width / 2, p.height / 2 - 20);
              p.textSize(18);
              p.text('按下 SPACE 繼續', p.width / 2, p.height / 2 + 20);
              return;
            }

            gameManager.updateGameLogic();
            break;

          case 'gameOver':
            p.fill(255, 0, 0);
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(48);
            p.text('遊戲結束', p.width / 2, p.height / 2 - 30);
            p.fill(255);
            p.textSize(20);
            p.text(`最終分數: ${gameState.score}`, p.width / 2, p.height / 2 + 20);
            p.textSize(16);
            p.text('按下 R 重新開始', p.width / 2, p.height / 2 + 50);
            break;
        }
      };

      // 鍵盤事件處理
      p.keyPressed = function () {
        const gameState = gameStateRef.current;
        console.log('Key pressed:', p.keyCode, 'Current state:', gameState.state);

        // 確保 gameManager 已經初始化
        if (!gameManager) {
          console.warn('gameManager 尚未初始化，忽略按鍵事件');
          return;
        }

        if (p.keyCode === p.ENTER || p.keyCode === 13) {
          if (gameState.state === 'start') {
            console.log('Starting game...');
            AudioSystem.playSound('start');
            gameState.state = 'playing';
            gameManager.initializeGame();
            gameManager.startBallMovement();
            forceUpdateComponent();
          }
        }

        if (p.keyCode === 32) { // SPACE
          if (gameState.state === 'playing') {
            gameState.paused = !gameState.paused;
            AudioSystem.playSound('pause');
            forceUpdateComponent();
          }
        }

        if (p.keyCode === 82 || p.key === 'r' || p.key === 'R') { // R key
          if (gameState.state === 'gameOver') {
            gameManager.resetGame();
          }
        }

        // ESC 鍵退出遊戲
        if (p.keyCode === 27) { // ESC
          onClose();
        }
      };
    };

    // 創建新的 p5 實例
    try {
      const p5Instance = new p5(sketch);
      p5InstanceRef.current = p5Instance;
      console.log('New p5 instance created');
    } catch (error) {
      console.error('Error creating p5 instance:', error);
    }

    // 清理函數
    return cleanup;
  }, [cleanup, forceUpdateComponent, onClose]);

  // 組件卸載時清理
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return (
    <RetroModal
      isOpen={true}
      onClose={onClose}
      title="🎮 PIXEL_SMASH.EXE"
    >
      {showGameOverScreen ? (
        <GameOverScreen
          score={gameStateRef.current.score}
          level={gameStateRef.current.level}
          onRestart={handleGameRestart}
          onClose={onClose}
        />
      ) : (
              <div className="flex flex-col lg:flex-row gap-4 p-4 theme-background theme-text font-mono max-h-[80vh] overflow-y-auto">
        {/* 遊戲畫布區域 */}
                  <div className="flex-1">
                   <div className="theme-surface p-3 rounded border theme-border">
           <div className="mb-3 text-center">
            <div className="text-sm text-gray-400">
              增強物理引擎版本 | 模組化架構
            </div>
          </div>
            <div
              ref={canvasRef}
              className="border theme-border theme-background mx-auto"
              style={{ width: 'fit-content' }}
            />
          </div>
        </div>

              {/* 遊戲資訊側邊欄 */}
      <div className="lg:w-72 space-y-3">
                  {/* 遊戲狀態 */}
        <div className="theme-surface p-3 rounded border theme-border">
          <h3 className="text-base font-bold mb-2 theme-primary">📊 遊戲狀態</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>分數:</span>
                <span className="theme-warning font-bold">{gameStateRef.current.score.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>生命:</span>
                <span className="theme-error font-bold">{'❤️'.repeat(gameStateRef.current.lives)}</span>
              </div>
              <div className="flex justify-between">
                <span>關卡:</span>
                <span className="text-blue-400 font-bold">{gameStateRef.current.level}</span>
              </div>
              <div className="flex justify-between">
                <span>狀態:</span>
                              <span className={`font-bold ${
                gameStateRef.current.state === 'playing' ? 'theme-success' :
                gameStateRef.current.state === 'start' ? 'theme-warning' : 'theme-error'
              }`}>
                  {gameStateRef.current.state === 'playing' ? '遊戲中' :
                   gameStateRef.current.state === 'start' ? '等待開始' : '遊戲結束'}
                </span>
              </div>
              {gameStateRef.current.paused && (
                <div className="text-center theme-warning font-bold animate-pulse">
                  ⏸️ 遊戲暫停
                </div>
              )}
            </div>
          </div>

                  {/* 操作說明 */}
        <div className="theme-surface p-3 rounded border theme-border">
          <h3 className="text-base font-bold mb-2 theme-primary">🎮 操作說明</h3>
            <div className="space-y-2 text-sm">
                          <div><span className="theme-warning">ENTER:</span> 開始遊戲</div>
            <div><span className="theme-warning">← →:</span> 移動擋板</div>
            <div><span className="theme-warning">SPACE:</span> 暫停/繼續</div>
            <div><span className="theme-warning">R:</span> 重新開始</div>
            <div><span className="theme-warning">ESC:</span> 退出遊戲</div>
            </div>
          </div>

                  {/* 關閉按鈕 */}
        <button
          onClick={onClose}
          className="w-full bg-red-900 hover:bg-red-800 text-white font-bold py-2 px-3 rounded border border-red-400 transition-colors text-sm"
        >
          🚪 退出遊戲
        </button>
        </div>
      </div>
      )}
    </RetroModal>
  );
};

export default PixelSmash;
