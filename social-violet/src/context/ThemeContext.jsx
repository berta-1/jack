import React, { createContext, useContext, useState, useEffect } from 'react';

export const PALETTES = {
  blue: {
    name: 'Facebook Classic Blue',
    primary: '#0866ff',
    primaryHover: '#166fe5',
    primaryLight: 'rgba(8, 102, 255, 0.12)',
    primaryGlow: 'rgba(8, 102, 255, 0.35)',
    badgeBg: '#1877f2',
  },
  teal: {
    name: 'Emerald Teal',
    primary: '#0d9488',
    primaryHover: '#0f766e',
    primaryLight: 'rgba(13, 148, 136, 0.12)',
    primaryGlow: 'rgba(13, 148, 136, 0.35)',
    badgeBg: '#14b8a6',
  },
  rose: {
    name: 'Crimson Rose',
    primary: '#e11d48',
    primaryHover: '#be123c',
    primaryLight: 'rgba(225, 29, 72, 0.12)',
    primaryGlow: 'rgba(225, 29, 72, 0.35)',
    badgeBg: '#f43f5e',
  },
  amber: {
    name: 'Cyber Amber',
    primary: '#d97706',
    primaryHover: '#b45309',
    primaryLight: 'rgba(217, 119, 6, 0.12)',
    primaryGlow: 'rgba(217, 119, 6, 0.35)',
    badgeBg: '#f59e0b',
  },
  cyan: {
    name: 'Ocean Cyan',
    primary: '#0284c7',
    primaryHover: '#0369a1',
    primaryLight: 'rgba(2, 132, 199, 0.12)',
    primaryGlow: 'rgba(2, 132, 199, 0.35)',
    badgeBg: '#0ea5e9',
  },
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('sphere_dark_mode');
    return saved !== null ? JSON.parse(saved) : false;
  });

  const [activePalette, setActivePalette] = useState(() => {
    const saved = localStorage.getItem('sphere_palette');
    if (!saved || saved === 'violet') {
      localStorage.setItem('sphere_palette', 'blue');
      return 'blue';
    }
    return saved;
  });

  useEffect(() => {
    localStorage.setItem('sphere_dark_mode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('sphere_palette', activePalette);
    const pal = PALETTES[activePalette] || PALETTES.blue;
    const root = document.documentElement;
    root.style.setProperty('--color-primary', pal.primary);
    root.style.setProperty('--color-primary-hover', pal.primaryHover);
    root.style.setProperty('--color-primary-light', pal.primaryLight);
    root.style.setProperty('--color-primary-glow', pal.primaryGlow);
    root.style.setProperty('--badge-bg', pal.badgeBg);
  }, [activePalette]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        activePalette,
        setActivePalette,
        PALETTES,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
