'use client';
import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

interface PixelSmashProps
{
  onClose: () => void;
}

interface ScoreData
{
  country_code: string;
  total_score: string;
}

const PixelSmash: React.FC<PixelSmashProps> = ({ onClose }) =>
{
  const canvasRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<p5 | null>(null);
  const isInitializedRef = useRef(false);

  useEffect(() =>
  {
    // 防止重複初始化
    if (isInitializedRef.current || !canvasRef.current) return;

    console.log('Initializing game - single time');
    isInitializedRef.current = true;

    // 清理現有內容
    if (canvasRef.current) {
      canvasRef.current.innerHTML = '';
    }

    const sketch = (p: p5) =>
    {
      // 遊戲狀態 - 直接在 sketch 內部管理
      let gameState = {
        state: 'start',
        score: 0,
        lives: 3,
        paddle: null as any,
        balls: [] as any[],
        bricks: [] as any[],
        powerUps: [] as any[],
        paused: false
      };

      let playerCountry = 'DEV';
      let leaderboard: ScoreData[] = [];
      let gameData = { score: 0, initialRank: -1, finalRank: -1 };

      let pixelFont: p5.Font | null = null;
      let fontLoaded = false;
      let useWebFont = false;
      let setupComplete = false;

      // Game constants
      const BRICK_COLORS: { [ key: string ]: [ number, number, number ] } = {
        '1': [ 255, 0, 255 ], '2': [ 0, 255, 255 ], '3': [ 255, 255, 0 ], 'P': [ 255, 255, 255 ],
      };
      const POWER_UP_TYPES = [ 'EXTEND', 'SLOW', 'MULTI' ];

      // 音效函數
      const playSound = (soundType: string) =>
      {
        try {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          switch (soundType) {
            case 'bounce': oscillator.frequency.setValueAtTime(200, audioContext.currentTime); break;
            case 'break': oscillator.frequency.setValueAtTime(400, audioContext.currentTime); break;
            case 'powerup': oscillator.frequency.setValueAtTime(600, audioContext.currentTime); break;
            case 'lose_life': oscillator.frequency.setValueAtTime(100, audioContext.currentTime); break;
            case 'pause': oscillator.frequency.setValueAtTime(150, audioContext.currentTime); break;
            default: oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
          }

          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
          console.log('Audio not available');
        }
      };

      // Helper functions
      const createBall = (x: number, y: number, vx: number, vy: number) => ({
        x, y, r: 10, vx, vy
      });

      const setupBricks = () =>
      {
        const brickWidth = 60, brickHeight = 20, rows = 5, cols = 10;
        const brickLayout = [ '2222P22222', '3333333333', '111P11P111', '2222222222', '333P333P33' ];
        gameState.bricks = [];
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
            const char = brickLayout[ i ][ j ];
            if (char !== ' ') {
              gameState.bricks.push({
                x: j * (brickWidth + 4) + 15,
                y: i * (brickHeight + 4) + 50,
                w: brickWidth,
                h: brickHeight,
                color: BRICK_COLORS[ char ],
                isPowerUp: char === 'P'
              });
            }
          }
        }
      };

      const resetLevel = () =>
      {
        gameState.paddle = {
          x: p.width / 2 - 50,
          y: p.height - 30,
          w: 100,
          h: 15,
          speed: 8
        };
        gameState.balls = [ createBall(p.width / 2, p.height / 2, 0, 0) ];
        setupBricks();
      };

      const spawnPowerUp = (x: number, y: number) =>
      {
        const type = p.random(POWER_UP_TYPES);
        let char = '?';
        let color: [ number, number, number ] = [ 255, 255, 255 ];
        if (type === 'EXTEND') { char = 'E'; color = [ 0, 255, 0 ]; }
        if (type === 'SLOW') { char = 'S'; color = [ 0, 255, 255 ]; }
        if (type === 'MULTI') { char = 'M'; color = [ 255, 0, 255 ]; }
        gameState.powerUps.push({ x, y, type, char, color, vy: 2 });
      };

      const activatePowerUp = (type: string) =>
      {
        playSound('powerup');
        const paddle = gameState.paddle;
        const balls = gameState.balls;

        if (type === 'EXTEND') paddle.w = Math.min(paddle.w + 40, 200);
        if (type === 'SLOW') balls.forEach(b => { b.vx *= 0.8; b.vy *= 0.8; });
        if (type === 'MULTI') {
          const currentBall = balls[ 0 ];
          if (currentBall) {
            balls.push(createBall(currentBall.x, currentBall.y, -currentBall.vx, currentBall.vy));
            balls.push(createBall(currentBall.x, currentBall.y, currentBall.vx, -currentBall.vy));
          }
        }
      };

      // 載入字體
      const loadWebFont = async () =>
      {
        try {
          const font = new FontFace('PixelFont', `url('/fonts/fusion-pixel-12px-monospaced-zh_hant.otf.woff2')`);
          await font.load();
          document.fonts.add(font);
          console.log('Web font loaded successfully');
          useWebFont = true;
          return true;
        } catch (error) {
          console.warn('Web font loading failed:', error);
          return false;
        }
      };

      const setupFont = () =>
      {
        if (useWebFont) {
          p.textFont('PixelFont, "Courier New", monospace');
          p.noSmooth();
        } else if (fontLoaded && pixelFont) {
          try {
            p.textFont(pixelFont);
            p.noSmooth();
          } catch (error) {
            console.warn('Error applying pixel font:', error);
            p.textFont('"Courier New", monospace');
          }
        } else {
          p.textFont('"Courier New", "Monaco", "Menlo", monospace');
        }
      };

      // 獲取玩家位置
      const fetchPlayerLocation = async () =>
      {
        try {
          const response = await fetch('/api/location');
          const data = await response.json();
          playerCountry = data.country || 'DEV';
        } catch (error) {
          playerCountry = 'DEV';
        }
      };

      // p5.js setup function
      p.setup = async function ()
      {
        console.log('p5 setup started');

        const canvas = p.createCanvas(640, 480);
        if (canvasRef.current) {
          canvas.parent(canvasRef.current);
        }
        canvas.id('pixelsmash-canvas');
        p.noStroke();
        p.noSmooth();

        // 載入字體和玩家位置
        await Promise.all([
          loadWebFont(),
          fetchPlayerLocation()
        ]);

        // 初始化遊戲
        resetLevel();
        setupComplete = true;

        console.log('p5 setup completed');
        p.redraw();
      };

      p.draw = function ()
      {
        if (!setupComplete) {
          p.background(0);
          p.fill(255);
          p.textAlign(p.CENTER, p.CENTER);
          p.textSize(24);
          p.text('載入中...', p.width / 2, p.height / 2);
          return;
        }

        p.background(0);
        setupFont();

        if (gameState.state === 'start') {
          p.fill(255);
          p.textAlign(p.CENTER, p.CENTER);
          p.textSize(48);
          p.text('PIXEL_SMASH.EXE', p.width / 2, p.height / 2 - 60);

          p.textSize(24);
          p.text('按下 ENTER 開始遊戲', p.width / 2, p.height / 2);

          p.textSize(16);
          p.fill(100, 255, 100);
          const fontStatus = useWebFont ? '✓ 使用 Web 字體' :
            fontLoaded ? '✓ 使用 p5 字體' :
              '⚠ 使用系統字體';
          p.text(fontStatus, p.width / 2, p.height / 2 + 40);

          p.textSize(14);
          p.fill(150);
          p.text('使用 ← → 方向鍵控制', p.width / 2, p.height - 60);
          p.text('按下 SPACE 暫停遊戲', p.width / 2, p.height - 40);

          p.noLoop();
          return;
        }

        if (gameState.state === 'playing') {
          // Game UI
          p.fill(255);
          p.textSize(24);
          p.textAlign(p.LEFT, p.TOP);
          p.text(`分數: ${gameState.score}`, 10, 10);
          p.text(`生命: ${gameState.lives}`, p.width - 120, 10);

          // Draw paddle
          if (gameState.paddle) {
            p.fill(0, 255, 255);
            p.rect(gameState.paddle.x, gameState.paddle.y, gameState.paddle.w, gameState.paddle.h);
          }

          // Draw balls
          gameState.balls.forEach(ball =>
          {
            p.fill(255);
            p.rect(ball.x, ball.y, ball.r, ball.r);
          });

          // Draw bricks
          gameState.bricks.forEach(brick =>
          {
            p.fill(brick.color[ 0 ], brick.color[ 1 ], brick.color[ 2 ]);
            p.rect(brick.x, brick.y, brick.w, brick.h);
          });

          // Draw power-ups
          gameState.powerUps.forEach(pu =>
          {
            p.fill(pu.color[ 0 ], pu.color[ 1 ], pu.color[ 2 ]);
            p.textSize(24);
            p.textAlign(p.CENTER, p.CENTER);
            p.text(pu.char, pu.x, pu.y);
          });

          // 暫停覆蓋層
          if (gameState.paused) {
            p.fill(0, 0, 0, 150);
            p.rect(0, 0, p.width, p.height);

            p.fill(255);
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(48);
            p.text('遊戲暫停', p.width / 2, p.height / 2 - 30);
            p.textSize(24);
            p.text('按下 SPACE 繼續', p.width / 2, p.height / 2 + 30);
            return;
          }

          // Game logic
          const paddle = gameState.paddle;
          const balls = gameState.balls;
          const bricks = gameState.bricks;
          const powerUps = gameState.powerUps;

          // Power-ups movement
          for (let i = powerUps.length - 1; i >= 0; i--) {
            const pu = powerUps[ i ];
            pu.y += pu.vy;
            if (pu.y > paddle.y && pu.x > paddle.x && pu.x < paddle.x + paddle.w) {
              activatePowerUp(pu.type);
              powerUps.splice(i, 1);
            } else if (pu.y > p.height) {
              powerUps.splice(i, 1);
            }
          }

          // Ball physics
          for (let i = balls.length - 1; i >= 0; i--) {
            const ball = balls[ i ];
            ball.x += ball.vx;
            ball.y += ball.vy;

            // Wall collision
            if (ball.x < 0 || ball.x > p.width - ball.r) {
              ball.vx *= -1;
              playSound('bounce');
            }
            if (ball.y < 0) {
              ball.vy *= -1;
              playSound('bounce');
            }

            // Paddle collision
            if (ball.y > paddle.y - ball.r && ball.y < paddle.y + paddle.h &&
              ball.x > paddle.x && ball.x < paddle.x + paddle.w) {
              ball.vy *= -1;
              playSound('bounce');
            }

            // Brick collision
            for (let j = bricks.length - 1; j >= 0; j--) {
              const brick = bricks[ j ];
              if (ball.y < brick.y + brick.h && ball.y + ball.r > brick.y &&
                ball.x < brick.x + brick.w && ball.x + ball.r > brick.x) {
                ball.vy *= -1;
                if (brick.isPowerUp) spawnPowerUp(brick.x + brick.w / 2, brick.y + brick.h / 2);
                bricks.splice(j, 1);
                gameState.score += 100;
                playSound('break');
                if (bricks.length === 0) {
                  gameState.state = 'youWin';
                  p.noLoop();
                }
                break;
              }
            }

            // Ball falls off screen
            if (ball.y > p.height) {
              balls.splice(i, 1);
              if (balls.length === 0) {
                gameState.lives--;
                playSound('lose_life');
                if (gameState.lives > 0) {
                  balls.push(createBall(p.width / 2, p.height / 2, p.random(-4, 4), -4));
                } else {
                  gameState.state = 'gameOver';
                  p.noLoop();
                }
              }
            }
          }

          // Paddle movement
          if (p.keyIsDown(p.LEFT_ARROW)) paddle.x -= paddle.speed;
          if (p.keyIsDown(p.RIGHT_ARROW)) paddle.x += paddle.speed;
          paddle.x = p.constrain(paddle.x, 0, p.width - paddle.w);
        } else {
          // Other game states
          p.fill(255);
          p.textAlign(p.CENTER, p.CENTER);
          if (gameState.state === 'gameOver') {
            p.fill(255, 0, 0);
            p.textSize(72);
            p.text('遊戲結束', p.width / 2, p.height / 2);
            p.fill(255);
            p.textSize(28);
            p.text(`最終分數: ${gameState.score}`, p.width / 2, p.height / 2 + 60);
            p.textSize(20);
            p.text('按下 R 重新開始', p.width / 2, p.height / 2 + 100);
          } else if (gameState.state === 'youWin') {
            p.fill(0, 255, 0);
            p.textSize(72);
            p.text('你贏了！', p.width / 2, p.height / 2);
            p.fill(255);
            p.textSize(28);
            p.text(`最終分數: ${gameState.score}`, p.width / 2, p.height / 2 + 60);
            p.textSize(20);
            p.text('按下 R 重新開始', p.width / 2, p.height / 2 + 100);
          }
          p.noLoop();
        }
      };

      // 鍵盤事件
      p.keyPressed = function ()
      {
        console.log('Key pressed:', p.keyCode, 'Current state:', gameState.state);

        if (p.keyCode === p.ENTER || p.keyCode === 13) {
          if (gameState.state === 'start') {
            console.log('Starting game...');
            playSound('start');
            gameState.state = 'playing';
            // 給球一個初始速度
            if (gameState.balls.length > 0) {
              gameState.balls[ 0 ].vx = p.random(-4, 4);
              gameState.balls[ 0 ].vy = -5;
            }
            p.loop();
          }
        }

        if (p.keyCode === 32) { // SPACE
          if (gameState.state === 'playing') {
            gameState.paused = !gameState.paused;
            playSound('pause');
            if (gameState.paused) {
              p.noLoop();
            } else {
              p.loop();
            }
          }
        }

        if (p.keyCode === 82 || p.key === 'r' || p.key === 'R') { // R key
          if (gameState.state === 'gameOver' || gameState.state === 'youWin') {
            gameState.state = 'start';
            gameState.score = 0;
            gameState.lives = 3;
            gameState.powerUps = [];
            gameState.paused = false;
            resetLevel();
            p.loop();
          }
        }
      };
    };

    // 創建 p5 實例
    try {
      const p5Instance = new p5(sketch);
      p5InstanceRef.current = p5Instance;
      console.log('p5 instance created successfully');
    } catch (error) {
      console.error('Error creating p5 instance:', error);
    }

    // 清理函數
    return () =>
    {
      console.log('Cleaning up p5 instance');
      if (p5InstanceRef.current) {
        try {
          p5InstanceRef.current.noLoop();
          p5InstanceRef.current.remove();
        } catch (error) {
          console.error('Error removing p5 instance:', error);
        }
        p5InstanceRef.current = null;
      }
      isInitializedRef.current = false;
    };
  }, []); // 空依賴陣列，只執行一次

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="w-[680px] h-[520px] bg-black border-2 border-cyan-400 p-4 rounded-md font-mono">
        <div className="flex justify-between items-center mb-2">
          <span className="text-cyan-400">PIXEL_SMASH.EXE</span>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700 focus:outline-none"
            title="關閉遊戲"
          >
            [X]
          </button>
        </div>
        <div ref={canvasRef} />
      </div>
    </div>
  );
};

export default PixelSmash;
