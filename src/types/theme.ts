export interface Theme {
  name: string;
  displayName: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    backgroundSecondary: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    glow: string;
  };
  effects: {
    textShadow: string;
    boxShadow: string;
    glowEffect: string;
  };
}

export type ThemeName = 'green' | 'amber' | 'dos' | 'blue' | 'red' | 'purple' | 'white';
