import { useContext } from "react";

import { ThemeContext } from '../context/ThemeContext';

export const themeColors = {
  dark: {
    background: 'bg-slate-900',
    cardBg: 'bg-slate-900/50',
    tableBg: 'bg-slate-900/30',
    border: 'border-slate-800',
    hover: 'bg-slate-800',
    text: {
      primary: 'text-white',
      secondary: 'text-gray-400',
      accent: 'text-gray-300'
    },
    input: {
      bg: 'bg-slate-800',
      border: 'border-0',
      text: 'text-white',
      placeholder: 'placeholder-gray-400'
    },
    critical: {
      bg: 'bg-red-900/20',
      text: 'text-red-400',
      border: 'border-red-800'
    },
    table: {
        background: 'bg-slate-900',
        header: 'bg-slate-800/50',
        row: 'bg-slate-900',
        rowHover: 'hover:bg-slate-800',
        text: {
          header: 'text-gray-400',
          primary: 'text-white',
          secondary: 'text-gray-300'
        }
      }
    },
  light: {
    background: 'bg-gray-50',
    cardBg: 'bg-white',
    tableBg: 'bg-white',
    border: 'border-gray-200',
    hover: 'bg-gray-100',
    text: {
      primary: 'text-gray-900',
      secondary: 'text-gray-600',
      accent: 'text-gray-500'
    },
    input: {
      bg: 'bg-white',
      border: 'border-gray-300',
      text: 'text-gray-900',
      placeholder: 'placeholder-gray-500'
    },
    critical: {
      bg: 'bg-red-50',
      text: 'text-red-600',
      border: 'border-red-200'
    },
    table: {
        background: 'bg-white',
        header: 'bg-gray-50',
        row: 'bg-white',
        rowHover: 'hover:bg-gray-50',
        text: {
          header: 'text-gray-500',
          primary: 'text-gray-900',
          secondary: 'text-gray-500'
        }
      }
  }
} as const;

type Theme = 'light' | 'dark';

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
      throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
  };

  export default useTheme;

export type ThemeColors = typeof themeColors[Theme];
