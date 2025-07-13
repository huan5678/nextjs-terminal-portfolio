import { Theme, ThemeName } from '@/types/theme';

export const themes: Record<ThemeName, Theme> = {
  // 經典綠色主題 (Default Green)
  green: {
    name: 'green',
    displayName: '經典綠色',
    colors: {
      primary: '#00ff00',
      secondary: '#00cc00',
      background: '#000000',
      backgroundSecondary: 'rgba(0, 50, 0, 0.8)',
      surface: '#1a1a1a',
      text: '#00ff00',
      textSecondary: '#00cc00',
      border: '#00ff00',
      accent: '#00ffff',
      success: '#00ff00',
      warning: '#ffff00',
      error: '#ff0000',
      glow: 'rgba(0, 255, 0, 0.3)',
    },
    effects: {
      textShadow: '0 0 10px #00ff00',
      boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)',
      glowEffect: '0 0 15px rgba(0, 255, 0, 0.5)',
    },
  },

  // 琥珀色主題 (Default Amber)
  amber: {
    name: 'amber',
    displayName: '琥珀色',
    colors: {
      primary: '#ffb000',
      secondary: '#ff8800',
      background: '#000000',
      backgroundSecondary: 'rgba(50, 30, 0, 0.8)',
      surface: '#1a1200',
      text: '#ffb000',
      textSecondary: '#ff8800',
      border: '#ffb000',
      accent: '#ffff00',
      success: '#00ff00',
      warning: '#ffff00',
      error: '#ff0000',
      glow: 'rgba(255, 176, 0, 0.3)',
    },
    effects: {
      textShadow: '0 0 10px #ffb000',
      boxShadow: '0 0 20px rgba(255, 176, 0, 0.3)',
      glowEffect: '0 0 15px rgba(255, 176, 0, 0.5)',
    },
  },

  // IBM DOS 主題
  dos: {
    name: 'dos',
    displayName: 'IBM DOS',
    colors: {
      primary: '#aaaaaa',
      secondary: '#888888',
      background: '#000080',
      backgroundSecondary: 'rgba(0, 0, 50, 0.8)',
      surface: '#000040',
      text: '#aaaaaa',
      textSecondary: '#888888',
      border: '#aaaaaa',
      accent: '#ffffff',
      success: '#00ff00',
      warning: '#ffff00',
      error: '#ff0000',
      glow: 'rgba(170, 170, 170, 0.3)',
    },
    effects: {
      textShadow: '0 0 5px #aaaaaa',
      boxShadow: '0 0 15px rgba(170, 170, 170, 0.2)',
      glowEffect: '0 0 10px rgba(170, 170, 170, 0.4)',
    },
  },

  // 藍色主題
  blue: {
    name: 'blue',
    displayName: '藍色終端',
    colors: {
      primary: '#00aaff',
      secondary: '#0088cc',
      background: '#000000',
      backgroundSecondary: 'rgba(0, 30, 50, 0.8)',
      surface: '#001122',
      text: '#00aaff',
      textSecondary: '#0088cc',
      border: '#00aaff',
      accent: '#00ffff',
      success: '#00ff00',
      warning: '#ffff00',
      error: '#ff0000',
      glow: 'rgba(0, 170, 255, 0.3)',
    },
    effects: {
      textShadow: '0 0 10px #00aaff',
      boxShadow: '0 0 20px rgba(0, 170, 255, 0.3)',
      glowEffect: '0 0 15px rgba(0, 170, 255, 0.5)',
    },
  },

  // 紅色主題
  red: {
    name: 'red',
    displayName: '紅色終端',
    colors: {
      primary: '#ff0040',
      secondary: '#cc0033',
      background: '#000000',
      backgroundSecondary: 'rgba(50, 0, 20, 0.8)',
      surface: '#220011',
      text: '#ff0040',
      textSecondary: '#cc0033',
      border: '#ff0040',
      accent: '#ff4080',
      success: '#00ff00',
      warning: '#ffff00',
      error: '#ff0000',
      glow: 'rgba(255, 0, 64, 0.3)',
    },
    effects: {
      textShadow: '0 0 10px #ff0040',
      boxShadow: '0 0 20px rgba(255, 0, 64, 0.3)',
      glowEffect: '0 0 15px rgba(255, 0, 64, 0.5)',
    },
  },

  // 紫色主題
  purple: {
    name: 'purple',
    displayName: '紫色終端',
    colors: {
      primary: '#cc00ff',
      secondary: '#9900cc',
      background: '#000000',
      backgroundSecondary: 'rgba(40, 0, 50, 0.8)',
      surface: '#220033',
      text: '#cc00ff',
      textSecondary: '#9900cc',
      border: '#cc00ff',
      accent: '#ff00ff',
      success: '#00ff00',
      warning: '#ffff00',
      error: '#ff0000',
      glow: 'rgba(204, 0, 255, 0.3)',
    },
    effects: {
      textShadow: '0 0 10px #cc00ff',
      boxShadow: '0 0 20px rgba(204, 0, 255, 0.3)',
      glowEffect: '0 0 15px rgba(204, 0, 255, 0.5)',
    },
  },

  // 白色主題
  white: {
    name: 'white',
    displayName: '白色終端',
    colors: {
      primary: '#ffffff',
      secondary: '#cccccc',
      background: '#000000',
      backgroundSecondary: 'rgba(30, 30, 30, 0.8)',
      surface: '#222222',
      text: '#ffffff',
      textSecondary: '#cccccc',
      border: '#ffffff',
      accent: '#ffffff',
      success: '#00ff00',
      warning: '#ffff00',
      error: '#ff0000',
      glow: 'rgba(255, 255, 255, 0.3)',
    },
    effects: {
      textShadow: '0 0 10px #ffffff',
      boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
      glowEffect: '0 0 15px rgba(255, 255, 255, 0.5)',
    },
  },
};

export const defaultTheme: ThemeName = 'green';
export const availableThemes = Object.keys(themes) as ThemeName[];
