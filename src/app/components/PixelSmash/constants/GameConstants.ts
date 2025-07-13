// app/components/PixelSmash/constants/GameConstants.ts
export const GAME_CONSTANTS = {
  CANVAS_WIDTH: 580,
  CANVAS_HEIGHT: 440,
  BRICK_COLORS: {
    '1': [255, 0, 255] as [number, number, number],
    '2': [0, 255, 255] as [number, number, number],
    '3': [255, 255, 0] as [number, number, number],
    '4': [255, 128, 0] as [number, number, number],
    'P': [255, 255, 255] as [number, number, number],
  },
  POWER_UP_TYPES: ['EXTEND', 'SLOW', 'MULTI'],
  LEVEL_1_LAYOUT: [
    '2222P22222',
    '3333333333',
    '111P11P111',
    '2222222222',
    '333P333P33'
  ]
} as const;
