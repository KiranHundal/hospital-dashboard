export type Theme = 'dark' | 'light';

export interface ThemeColors {
  background: string;
  cardBg: string;
  tableBg: string;
  border: string;
  hover: string;
  text: {
    primary: string;
    secondary: string;
    accent: string;
  };
  input: {
    bg: string;
    border: string;
    text: string;
    placeholder: string;
  };
  critical: {
    bg: string;
    text: string;
    border: string;
  };
}

export interface ThemeContextType {
  theme: Theme;
  colors: ThemeColors;
  toggleTheme: () => void;
}
