// app/components/PixelSmash/types/GameTypes.ts
export interface GameState {
  state: 'start' | 'playing' | 'gameOver';
  score: number;
  lives: number;
  level: number;
  paddle: Paddle | null;
  balls: Ball[];
  bricks: Brick[];
  powerUps: PowerUp[];
  paused: boolean;
}

export interface Paddle {
  x: number;
  y: number;
  w: number;
  h: number;
  speed: number;
  prevX: number;
  velocity: number;
}

export interface Ball {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
}

export interface Brick {
  x: number;
  y: number;
  w: number;
  h: number;
  color: [number, number, number];
  isPowerUp: boolean;
}

export interface PowerUp {
  x: number;
  y: number;
  type: string;
  char: string;
  color: [number, number, number];
  vy: number;
}
