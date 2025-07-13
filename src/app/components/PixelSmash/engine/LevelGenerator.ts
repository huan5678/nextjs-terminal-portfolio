// app/components/PixelSmash/engine/LevelGenerator.ts
import { GAME_CONSTANTS } from '../constants/GameConstants';
import type p5 from 'p5';

export class LevelGenerator {
  static generateRandomLayout(level: number, p: p5): string[] {
    const cols = 10;
    const brickHeight = 18;
    const paddleArea = 30;
    const safetyMargin = 4 * (brickHeight + 2);
    const topMargin = 40;

    // 計算可用的行數
    const availableHeight = GAME_CONSTANTS.CANVAS_HEIGHT - paddleArea - safetyMargin - topMargin;
    const maxRows = Math.floor(availableHeight / (brickHeight + 2));

    // 根據關卡決定行數和密度
    const minRows = Math.min(3, maxRows);
    const maxRowsForLevel = Math.min(maxRows, 3 + Math.floor(level / 2));
    const rows = Math.max(minRows, Math.min(maxRowsForLevel, maxRows));

    console.log(`Level ${level}: Available height=${availableHeight}, Max rows=${maxRows}, Using rows=${rows}`);

    const layout: string[] = [];
    const brickTypes = ['1', '2', '3', '4'];

    // 計算需要的最少方塊數和道具數
    const minBricks = 10;
    const powerUpChance = 0.15;
    const densityByLevel = Math.min(0.4 + (level - 1) * 0.1, 0.8);

    let totalBricks = 0;
    let attempts = 0;
    const maxAttempts = 10;

    // 重複生成直到滿足最少方塊數要求
    do {
      layout.length = 0;
      totalBricks = 0;
      attempts++;

      for (let i = 0; i < rows; i++) {
        let row = '';
        for (let j = 0; j < cols; j++) {
          // 根據位置和關卡調整生成機率
          let chance = densityByLevel;

          // 邊緣位置稍微降低密度
          if (j === 0 || j === cols - 1) {
            chance *= 0.8;
          }

          // 頂部行增加密度
          if (i < 2) {
            chance *= 1.2;
          }

          if (p.random() < chance) {
            if (p.random() < powerUpChance) {
              row += 'P'; // 道具方塊
            } else {
              row += p.random(brickTypes); // 隨機普通方塊
            }
            totalBricks++;
          } else {
            row += ' '; // 空位
          }
        }
        layout.push(row);
      }

      console.log(`Attempt ${attempts}: Generated ${totalBricks} bricks`);

      // 如果方塊太少，在隨機位置添加方塊
      if (totalBricks < minBricks && attempts < maxAttempts) {
        const needed = minBricks - totalBricks;
        for (let add = 0; add < needed; add++) {
          const row = Math.floor(p.random(rows));
          const col = Math.floor(p.random(cols));

          if (layout[row][col] === ' ') {
            const rowArray = layout[row].split('');
            rowArray[col] = p.random(brickTypes);
            layout[row] = rowArray.join('');
            totalBricks++;
          }
        }
      }

    } while (totalBricks < minBricks && attempts < maxAttempts);

    console.log(`Final layout for level ${level}: ${totalBricks} bricks in ${rows} rows`);
    return layout;
  }

  static getLayoutForLevel(level: number, p: p5): string[] {
    if (level === 1) {
      return [...GAME_CONSTANTS.LEVEL_1_LAYOUT];
    } else {
      return this.generateRandomLayout(level, p);
    }
  }
}
