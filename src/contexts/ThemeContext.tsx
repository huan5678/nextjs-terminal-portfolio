'use client';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Theme, ThemeName } from '@/types/theme';
import { themes, defaultTheme } from '@/config/themes';

interface ThemeContextType {
  currentTheme: Theme;
  themeName: ThemeName;
  setTheme: (theme: ThemeName) => void;
  availableThemes: ThemeName[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeName, setThemeName] = useState<ThemeName>(defaultTheme);
  const [isClient, setIsClient] = useState(false);

  // 確保在客戶端運行
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 從 localStorage 載入主題
  useEffect(() => {
    if (isClient) {
      const savedTheme = localStorage.getItem('terminal-theme') as ThemeName;
      if (savedTheme && themes[savedTheme]) {
        setThemeName(savedTheme);
      }
    }
  }, [isClient]);

  // 設定主題並保存到 localStorage
  const setTheme = (newTheme: ThemeName) => {
    if (themes[newTheme]) {
      setThemeName(newTheme);
      if (isClient) {
        localStorage.setItem('terminal-theme', newTheme);
      }
    }
  };

  // 動態更新 CSS 變數
  useEffect(() => {
    if (isClient) {
      const theme = themes[themeName];
      const root = document.documentElement;

      // 設定 CSS 變數
      root.style.setProperty('--theme-primary', theme.colors.primary);
      root.style.setProperty('--theme-secondary', theme.colors.secondary);
      root.style.setProperty('--theme-background', theme.colors.background);
      root.style.setProperty('--theme-background-secondary', theme.colors.backgroundSecondary);
      root.style.setProperty('--theme-surface', theme.colors.surface);
      root.style.setProperty('--theme-text', theme.colors.text);
      root.style.setProperty('--theme-text-secondary', theme.colors.textSecondary);
      root.style.setProperty('--theme-border', theme.colors.border);
      root.style.setProperty('--theme-accent', theme.colors.accent);
      root.style.setProperty('--theme-success', theme.colors.success);
      root.style.setProperty('--theme-warning', theme.colors.warning);
      root.style.setProperty('--theme-error', theme.colors.error);
      root.style.setProperty('--theme-glow', theme.colors.glow);

      // 設定效果變數
      root.style.setProperty('--theme-text-shadow', theme.effects.textShadow);
      root.style.setProperty('--theme-box-shadow', theme.effects.boxShadow);
      root.style.setProperty('--theme-glow-effect', theme.effects.glowEffect);
    }
  }, [themeName, isClient]);

  const value: ThemeContextType = {
    currentTheme: themes[themeName],
    themeName,
    setTheme,
    availableThemes: Object.keys(themes) as ThemeName[],
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
