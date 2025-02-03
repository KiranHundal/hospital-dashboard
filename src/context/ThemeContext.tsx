// contexts/ThemeContext.tsx
import React, { createContext, useState, useEffect } from "react";
import { Theme, ThemeContextType} from "../types/theme";
import { themeColors } from "../hooks/useTheme";

// const themeColors: Record<Theme, ThemeColors> = {
//   dark: {
//     background: "bg-slate-900",
//     cardBg: "bg-slate-900/50",
//     tableBg: "bg-slate-900/30",
//     border: "border-slate-800",
//     hover: "bg-slate-800",
//     text: {
//       primary: "text-white",
//       secondary: "text-gray-400",
//       accent: "text-gray-300",
//     },
//     input: {
//       bg: "bg-slate-800",
//       border: "border-0",
//       text: "text-white",
//       placeholder: "placeholder-gray-400",
//     },
//     critical: {
//       bg: "bg-red-900/20",
//       text: "text-red-400",
//       border: "border-red-800",
//     },
//   },
//   light: {
//     background: "bg-gray-50",
//     cardBg: "bg-white",
//     tableBg: "bg-white",
//     border: "border-gray-200",
//     hover: "bg-gray-100",
//     text: {
//       primary: "text-gray-900",
//       secondary: "text-gray-600",
//       accent: "text-gray-500",
//     },
//     input: {
//       bg: "bg-white",
//       border: "border-gray-300",
//       text: "text-gray-900",
//       placeholder: "placeholder-gray-500",
//     },
//     critical: {
//       bg: "bg-red-50",
//       text: "text-red-600",
//       border: "border-red-200",
//     },
//   },
// };

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem("theme") as Theme) || "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  const value: ThemeContextType = {
    theme,
    colors: themeColors[theme],
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
