// app/components/PixelSmash/engine/PhysicsEngine.ts
import type { Ball, Paddle, Brick } from '../types/GameTypes';

export class PhysicsEngine {
  static handlePaddleBallCollision(ball: Ball, paddle: Paddle): void {
    // 計算碰撞點相對於擋板中心的位置 (-1 到 1)
    const paddleCenter = paddle.x + paddle.w / 2;
    const ballCenter = ball.x + ball.r / 2;
    const relativeIntersectX = (ballCenter - paddleCenter) / (paddle.w / 2);

    // 限制相對位置在 -1 到 1 之間
    const normalizedRelativeIntersection = Math.max(-1, Math.min(1, relativeIntersectX));

    // 計算反射角度 (最大 60 度)
    const maxBounceAngle = Math.PI / 3; // 60 degrees in radians
    const bounceAngle = normalizedRelativeIntersection * maxBounceAngle;

    // 計算小球當前速度大小
    const ballSpeed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);

    // 擋板動能影響係數 (0.15 表示擋板速度的 15% 會傳遞給小球)
    const paddleInfluence = 0.15;
    const paddleVelocityBonus = paddle.velocity * paddleInfluence;

    // 計算新的速度分量
    const newSpeed = Math.max(ballSpeed, 4); // 確保最小速度
    ball.vx = Math.sin(bounceAngle) * newSpeed + paddleVelocityBonus;
    ball.vy = -Math.cos(bounceAngle) * newSpeed;

    // 限制最大速度避免遊戲過快
    const maxSpeed = 8;
    const currentSpeed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
    if (currentSpeed > maxSpeed) {
      ball.vx = (ball.vx / currentSpeed) * maxSpeed;
      ball.vy = (ball.vy / currentSpeed) * maxSpeed;
    }

    // 確保小球向上運動（避免卡在擋板上）
    if (ball.vy > -2) {
      ball.vy = -2;
    }

    // 微調小球位置避免重複碰撞
    ball.y = paddle.y - ball.r - 1;

    console.log(`Paddle collision: angle=${bounceAngle.toFixed(2)}, speed=${currentSpeed.toFixed(2)}, paddle_vel=${paddle.velocity.toFixed(2)}`);
  }

  static handleBrickCollision(ball: Ball, brick: Brick): 'horizontal' | 'vertical' {
    // 更精確的碰撞檢測 - 判斷碰撞面
    const ballCenterX = ball.x + ball.r / 2;
    const ballCenterY = ball.y + ball.r / 2;
    const brickCenterX = brick.x + brick.w / 2;
    const brickCenterY = brick.y + brick.h / 2;

    const deltaX = ballCenterX - brickCenterX;
    const deltaY = ballCenterY - brickCenterY;

    // 判斷主要碰撞方向
    if (Math.abs(deltaX / brick.w) > Math.abs(deltaY / brick.h)) {
      ball.vx *= -1; // 水平碰撞
      return 'horizontal';
    } else {
      ball.vy *= -1; // 垂直碰撞
      return 'vertical';
    }
  }

  static checkBallBrickCollision(ball: Ball, brick: Brick): boolean {
    return (
      ball.y < brick.y + brick.h &&
      ball.y + ball.r > brick.y &&
      ball.x < brick.x + brick.w &&
      ball.x + ball.r > brick.x
    );
  }

  static checkBallPaddleCollision(ball: Ball, paddle: Paddle): boolean {
    return (
      ball.y + ball.r >= paddle.y &&
      ball.y < paddle.y + paddle.h &&
      ball.x + ball.r >= paddle.x &&
      ball.x <= paddle.x + paddle.w &&
      ball.vy > 0
    );
  }
}
