// app/components/PixelSmash/engine/GameManager.ts
import type { GameState, Ball, Paddle, Brick, PowerUp } from '../types/GameTypes';
import { GAME_CONSTANTS } from '../constants/GameConstants';
import { AudioSystem } from '../utils/AudioSystem';
import { PhysicsEngine } from './PhysicsEngine';
import { LevelGenerator } from './LevelGenerator';
import type p5 from 'p5';

export class GameManager {
  private gameState: React.MutableRefObject<GameState>;
  private forceUpdate: () => void;
  private p: p5;

  constructor(gameState: React.MutableRefObject<GameState>, forceUpdate: () => void, p: p5) {
    this.gameState = gameState;
    this.forceUpdate = forceUpdate;
    this.p = p;
  }

  createBall(x: number, y: number, vx: number, vy: number): Ball {
    return { x, y, r: 10, vx, vy };
  }

  setupBricks(): void {
    const brickWidth = 55, brickHeight = 18, cols = 10;
    this.gameState.current.bricks = [];

    console.log(`Setting up bricks for level ${this.gameState.current.level}`);

    const currentLayout = LevelGenerator.getLayoutForLevel(this.gameState.current.level, this.p);
    const rows = currentLayout.length;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const char = currentLayout[i][j];
        if (char !== ' ') {
          this.gameState.current.bricks.push({
            x: j * (brickWidth + 2) + 10,
            y: i * (brickHeight + 2) + 40,
            w: brickWidth,
            h: brickHeight,
            color: GAME_CONSTANTS.BRICK_COLORS[char] || [128, 128, 128],
            isPowerUp: char === 'P'
          });
        }
      }
    }

    console.log(`Created ${this.gameState.current.bricks.length} bricks for level ${this.gameState.current.level}`);
  }

  spawnPowerUp(x: number, y: number): void {
    const type = this.p.random(GAME_CONSTANTS.POWER_UP_TYPES);
    let char = '?';
    let color: [number, number, number] = [255, 255, 255];

    if (type === 'EXTEND') { char = 'E'; color = [0, 255, 0]; }
    if (type === 'SLOW') { char = 'S'; color = [0, 255, 255]; }
    if (type === 'MULTI') { char = 'M'; color = [255, 0, 255]; }

    this.gameState.current.powerUps.push({ x, y, type, char, color, vy: 2 });
  }

  activatePowerUp(type: string): void {
    AudioSystem.playSound('powerup');
    const paddle = this.gameState.current.paddle!;
    const balls = this.gameState.current.balls;

    if (type === 'EXTEND') paddle.w = Math.min(paddle.w + 30, 150);
    if (type === 'SLOW') balls.forEach(b => { b.vx *= 0.8; b.vy *= 0.8; });
    if (type === 'MULTI') {
      const currentBall = balls[0];
      if (currentBall) {
        balls.push(this.createBall(currentBall.x, currentBall.y, -currentBall.vx, currentBall.vy));
        balls.push(this.createBall(currentBall.x, currentBall.y, currentBall.vx, -currentBall.vy));
      }
    }
  }

  initializeGame(): void {
    console.log('Initializing game objects...');
    this.gameState.current.paddle = {
      x: GAME_CONSTANTS.CANVAS_WIDTH / 2 - 40,
      y: GAME_CONSTANTS.CANVAS_HEIGHT - 30,
      w: 80,
      h: 12,
      speed: 8,
      prevX: GAME_CONSTANTS.CANVAS_WIDTH / 2 - 40,
      velocity: 0
    };

    const initialBall = this.createBall(GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2, 0, 0);
    this.gameState.current.balls = [initialBall];

    this.gameState.current.powerUps = [];
    this.setupBricks();
    this.forceUpdate();

    console.log('Game initialized with ball:', this.gameState.current.balls[0]);
  }

  startBallMovement(): void {
    if (this.gameState.current.balls.length > 0) {
      const ball = this.gameState.current.balls[0];
      ball.vx = this.p.random(-4, 4);
      ball.vy = -5;
      console.log('Ball movement started:', ball.vx, ball.vy);
    }
  }

  updateGameLogic(): void {
    const gameState = this.gameState.current;
    const paddle = gameState.paddle!;
    const balls = gameState.balls;
    const bricks = gameState.bricks;
    const powerUps = gameState.powerUps;

    // 更新擋板速度計算
    paddle.velocity = paddle.x - paddle.prevX;
    paddle.prevX = paddle.x;

    // Power-ups movement
    for (let i = powerUps.length - 1; i >= 0; i--) {
      const pu = powerUps[i];
      pu.y += pu.vy;
      if (pu.y > paddle.y && pu.x > paddle.x && pu.x < paddle.x + paddle.w) {
        this.activatePowerUp(pu.type);
        powerUps.splice(i, 1);
      } else if (pu.y > this.p.height) {
        powerUps.splice(i, 1);
      }
    }

    // Ball physics
    for (let i = balls.length - 1; i >= 0; i--) {
      const ball = balls[i];
      ball.x += ball.vx;
      ball.y += ball.vy;

      // Wall collision
      if (ball.x < 0 || ball.x > this.p.width - ball.r) {
        ball.vx *= -1;
        AudioSystem.playSound('bounce');
      }
      if (ball.y < 0) {
        ball.vy *= -1;
        AudioSystem.playSound('bounce');
      }

      // Enhanced Paddle collision
      if (PhysicsEngine.checkBallPaddleCollision(ball, paddle)) {
        PhysicsEngine.handlePaddleBallCollision(ball, paddle);
        AudioSystem.playSound('bounce');
      }

      // Brick collision
      for (let j = bricks.length - 1; j >= 0; j--) {
        const brick = bricks[j];
        if (PhysicsEngine.checkBallBrickCollision(ball, brick)) {
          PhysicsEngine.handleBrickCollision(ball, brick);

          if (brick.isPowerUp) this.spawnPowerUp(brick.x + brick.w / 2, brick.y + brick.h / 2);
          bricks.splice(j, 1);
          gameState.score += 100;
          AudioSystem.playSound('break');
          this.forceUpdate();

          if (bricks.length === 0) {
            gameState.level++;
            AudioSystem.playSound('level_up');
            gameState.paddle.w = 80;
            this.initializeGame();
            setTimeout(() => {
              this.startBallMovement();
            }, 100);
            return;
          }
          break;
        }
      }

      // Ball falls off screen
      if (ball.y > this.p.height) {
        balls.splice(i, 1);
        if (balls.length === 0) {
          gameState.lives--;
          AudioSystem.playSound('lose_life');
          this.forceUpdate();
          if (gameState.lives > 0) {
            const newBall = this.createBall(this.p.width / 2, this.p.height / 2, this.p.random(-4, 4), -4);
            balls.push(newBall);
          } else {
            gameState.state = 'gameOver';
            this.forceUpdate();
          }
        }
      }
    }

    // Enhanced Paddle movement
    let paddleMoving = false;
    if (this.p.keyIsDown(this.p.LEFT_ARROW)) {
      paddle.x -= paddle.speed;
      paddleMoving = true;
    }
    if (this.p.keyIsDown(this.p.RIGHT_ARROW)) {
      paddle.x += paddle.speed;
      paddleMoving = true;
    }

    if (!paddleMoving) {
      paddle.velocity *= 0.8;
    }

    paddle.x = this.p.constrain(paddle.x, 0, this.p.width - paddle.w);
  }

  resetGame(): void {
    this.gameState.current.state = 'start';
    this.gameState.current.score = 0;
    this.gameState.current.lives = 3;
    this.gameState.current.level = 1;
    this.gameState.current.powerUps = [];
    this.gameState.current.paused = false;
    this.gameState.current.paddle = null;
    this.gameState.current.balls = [];
    this.gameState.current.bricks = [];
    this.forceUpdate();
  }
}
